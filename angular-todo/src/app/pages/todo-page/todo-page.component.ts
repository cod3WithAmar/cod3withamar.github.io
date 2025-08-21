import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, combineLatest } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoFilter } from '../../models/todo';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonToggleModule,
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent {
  private readonly todoService = inject(TodoService);

  newTodo = new FormControl<string>('', { nonNullable: true });
  filter = new FormControl<TodoFilter>('all', { nonNullable: true });

  readonly todos$ = this.todoService.todos$;
  readonly filter$ = this.filter.valueChanges.pipe(startWith(this.filter.value));

  readonly filteredTodos$ = combineLatest([this.todos$, this.filter$]).pipe(
    map(([todos, filter]) => {
      switch (filter) {
        case 'active':
          return todos.filter(t => !t.completed);
        case 'completed':
          return todos.filter(t => t.completed);
        default:
          return todos;
      }
    })
  );

  readonly remainingCount$ = this.todos$.pipe(map(todos => todos.filter(t => !t.completed).length));
  readonly hasCompleted$ = this.todos$.pipe(map(todos => todos.some(t => t.completed)));
  readonly allCompleted$ = this.todos$.pipe(map(todos => todos.length > 0 && todos.every(t => t.completed)));

  addTodo(): void {
    const title = this.newTodo.value;
    if (title && title.trim()) {
      this.todoService.add(title);
      this.newTodo.setValue('');
    }
  }

  toggleAll(completed: boolean): void {
    this.todoService.setAll(completed);
  }

  toggle(todo: Todo): void {
    this.todoService.toggleCompleted(todo.id);
  }

  remove(todo: Todo): void {
    this.todoService.remove(todo.id);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  trackById(_index: number, todo: Todo): string {
    return todo.id;
  }
}