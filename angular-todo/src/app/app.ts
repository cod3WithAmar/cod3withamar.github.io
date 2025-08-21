import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TodoService } from './todos/todo.service';
import { TodoItem } from './todos/todo.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly todoService = inject(TodoService);

  protected readonly newTitle = signal('');
  protected readonly items = this.todoService.items;
  protected readonly activeCount = this.todoService.activeCount;
  protected readonly completedCount = this.todoService.completedCount;

  constructor() {
    effect(() => {
      // Trigger computed values to keep template reactive
      this.items();
    });
  }

  protected addTodo(): void {
    const title = this.newTitle();
    this.todoService.add(title);
    this.newTitle.set('');
  }

  protected toggleTodo(item: TodoItem): void {
    this.todoService.toggle(item.id);
  }

  protected removeTodo(item: TodoItem): void {
    this.todoService.remove(item.id);
  }

  protected clearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
