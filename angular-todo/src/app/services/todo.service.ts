import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly storageKey = 'todos';
  private readonly todosSubject = new BehaviorSubject<Todo[]>(this.loadFromStorage());

  readonly todos$ = this.todosSubject.asObservable();

  add(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: this.generateId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    const updated = [newTodo, ...this.todosSubject.value];
    this.updateTodos(updated);
  }

  toggleCompleted(id: string): void {
    const updated = this.todosSubject.value.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    this.updateTodos(updated);
  }

  updateTitle(id: string, newTitle: string): void {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const updated = this.todosSubject.value.map(t => t.id === id ? { ...t, title: trimmed } : t);
    this.updateTodos(updated);
  }

  remove(id: string): void {
    const updated = this.todosSubject.value.filter(t => t.id !== id);
    this.updateTodos(updated);
  }

  clearCompleted(): void {
    const updated = this.todosSubject.value.filter(t => !t.completed);
    this.updateTodos(updated);
  }

  setAll(completed: boolean): void {
    const updated = this.todosSubject.value.map(t => ({ ...t, completed }));
    this.updateTodos(updated);
  }

  private updateTodos(next: Todo[]): void {
    this.todosSubject.next(next);
    this.saveToStorage(next);
  }

  private loadFromStorage(): Todo[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Todo[];
      if (!Array.isArray(parsed)) return [];
      return parsed.map(t => ({
        id: String((t as any).id),
        title: String((t as any).title ?? ''),
        completed: Boolean((t as any).completed),
        createdAt: Number((t as any).createdAt ?? Date.now()),
      }));
    } catch {
      return [];
    }
  }

  private saveToStorage(todos: Todo[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(todos));
    } catch {
      // ignore write errors
    }
  }

  private generateId(): string {
    try {
      // @ts-ignore
      if (typeof crypto !== 'undefined' && crypto?.randomUUID) {
        // @ts-ignore
        return crypto.randomUUID();
      }
    } catch {}
    return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }
}