import { Injectable, computed, effect, signal } from '@angular/core';
import { TodoItem } from './todo.model';

const STORAGE_KEY = 'angular_todo_items_v1';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly itemsSignal = signal<TodoItem[]>(this.loadFromStorage());

  readonly items = computed(() => this.itemsSignal());
  readonly activeCount = computed(() => this.itemsSignal().filter(t => !t.completed).length);
  readonly completedCount = computed(() => this.itemsSignal().filter(t => t.completed).length);

  constructor() {
    effect(() => {
      const snapshot = this.itemsSignal();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    });
  }

  add(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    this.itemsSignal.update(list => [newItem, ...list]);
  }

  toggle(id: string): void {
    this.itemsSignal.update(list => list.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  }

  updateTitle(id: string, title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    this.itemsSignal.update(list => list.map(item => item.id === id ? { ...item, title: trimmed } : item));
  }

  remove(id: string): void {
    this.itemsSignal.update(list => list.filter(item => item.id !== id));
  }

  clearCompleted(): void {
    this.itemsSignal.update(list => list.filter(item => !item.completed));
  }

  private loadFromStorage(): TodoItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as TodoItem[];
      if (!Array.isArray(parsed)) return [];
      return parsed.map(item => ({
        id: item.id,
        title: item.title,
        completed: !!item.completed,
        createdAt: item.createdAt ?? Date.now(),
      }));
    } catch {
      return [];
    }
  }
}