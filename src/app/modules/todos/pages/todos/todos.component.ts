import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { TodosService } from '../../services/todos.service';
import { Todo } from '../../models/todo.interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [MatCheckboxModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent {
  // Services
  userService = inject(UsersService);
  todoService = inject(TodosService);

  // Signals
  users = this.userService.members;
  isLoading = this.todoService.isLoading;
  currentMember = this.todoService.currentMember;
  todosForMember = this.todoService.filteredToDos;
  errorMessage = this.todoService.error;

  // Actions
  onFilter(checked: boolean): void {
    this.todoService.filterToDos(checked);
  }

  onSelected(userId: number | undefined): void {
    if (!userId) this.todoService.getToDosForMembers(0);
    else this.todoService.getToDosForMembers(userId);
  }

  onChangeStatus(task: Todo, checked: boolean): void {
    this.todoService.changeStatus(task, checked);
  }
}
