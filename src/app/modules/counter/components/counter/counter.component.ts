import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as CounterSelectors from '../../../../store/selectors/counter.selector';
import * as CounterActions from '../../../../store/actions/counter.action';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [StoreModule, AsyncPipe],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent implements OnInit {
  counter$!: Observable<number>;

  constructor(private http: HttpClient, private store: Store) {}

  ngOnInit(): void {
    this.counter$ = this.store.select(CounterSelectors.selectCount);
  }

  increment(): void {
    this.store.dispatch(CounterActions.increment());
  }

  decrement(): void {
    this.store.dispatch(CounterActions.decrement());
  }

  reset(): void {
    this.store.dispatch(CounterActions.reset());
  }
}
