import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import {
  catchError,
  delay,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Todo } from '../models/todo.interface';
import { User } from '../models/user.interface';
import { UsersService } from './users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private http: HttpService = inject(HttpService);
  private usersService: UsersService = inject(UsersService);
  private state: WritableSignal<TodoState> = signal<TodoState>({
    isLoading: false,
    currentMember: undefined,
    memberTodos: [],
    incompleteOnly: false,
    error: null,
  });

  // Selectors
  isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  currentMember: Signal<User | undefined> = computed(
    () => this.state().currentMember
  );
  toDos: Signal<Todo[]> = computed(() => this.state().memberTodos);
  incompleteOnly: Signal<boolean> = computed(() => this.state().incompleteOnly);
  memberTodos: Signal<Todo[]> = computed(() => this.state().memberTodos);
  error: Signal<string | null> = computed(() => this.state().error);
  initialTodos: Todo[] = [];
  filteredToDos: Signal<Todo[]> = computed(() => {
    if (this.incompleteOnly())
      return this.toDos().filter((t) => t.completed === false);
    else return this.toDos();
  });

  private selectedIdSubject: Subject<number> = new Subject<number>();
  private selectedId$ = this.selectedIdSubject.asObservable();

  constructor() {
    this.selectedId$
      .pipe(
        // Set the loading indicator
        tap(() => this.setLoadingIndicator(true)),
        // Set the current member
        tap((id) => this.setCurrentMember(id)),
        // Get the related todos
        switchMap((id) => this.getToDos(id)),
        // To better see the loading message
        delay(1000),
        // Ensure the observables are finalized when this service is destroyed
        takeUntilDestroyed()
      )
      .subscribe((todos) => this.setMemberTodos(todos));
  }

  private setLoadingIndicator(isLoading: boolean): void {
    this.state.update((state) => ({
      ...state,
      isLoading,
    }));
  }

  private setCurrentMember(id: number): void {
    const member = this.usersService.getCurrentMember(id);

    this.state.update((state) => ({
      ...state,
      currentMember: member,
      memberTodos: [],
    }));
  }

  private getToDos(id: number): Observable<Todo[]> {
    if (!id) return of([]);
    return this.http.getAll(`/todos?userId=${id}`).pipe(
      map((todos) =>
        todos.map((todo: Todo) =>
          todo.title.length > 20
            ? { ...todo, title: todo.title.substring(0, 20) }
            : todo
        )
      ),
      catchError((error) => this.setError(error))
    );
  }

  getToDosForMembers(memberId: number): void {
    this.selectedIdSubject.next(memberId);
  }

  filterToDos(filter: boolean): void {
    this.state.update((state) => ({
      ...state,
      incompleteOnly: filter,
    }));
  }

  changeStatus(todo: Todo, status: boolean): void {
    const updatedTodos: Todo[] = this.toDos().map((t: Todo) => {
      return t.id === todo.id ? { ...t, completed: status } : t;
    });
    this.state.update((state) => ({
      ...state,
      memberTodos: updatedTodos,
    }));
  }

  private setMemberTodos(todos: Todo[]): void {
    this.state.update((state) => ({
      ...state,
      memberTodos: todos,
      isLoading: false,
    }));
  }

  private setError(err: HttpErrorResponse): Observable<Todo[]> {
    const errorMessage = setErrorMessage(err);
    this.state.update((state) => ({
      ...state,
      error: errorMessage,
    }));
    return of([]);
  }
}

export interface TodoState {
  isLoading: boolean;
  currentMember: User | undefined;
  memberTodos: Todo[];
  incompleteOnly: boolean;
  error: string | null;
}

export function setErrorMessage(err: HttpErrorResponse): string {
  let errorMessage: string;
  if (err.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    errorMessage = `Backend returned code ${err.status}: ${err.message}`;
  }
  console.error(err);
  return errorMessage;
}
