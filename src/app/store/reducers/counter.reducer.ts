import { createReducer, on } from '@ngrx/store';
import { CounterState } from '../counter.model';
import * as CounterActions from '../actions/counter.action';

export const initialState: CounterState = {
  counter: 0,
};

export const counterReducer = createReducer(
  initialState,
  on(CounterActions.increment, (state) => ({
    ...state,
    counter: state.counter + 1,
  })),
  on(CounterActions.decrement, (state) => ({
    ...state,
    counter: state.counter === 0 ? 0 : state.counter - 1,
  })),
  on(CounterActions.reset, (state) => ({ ...state, counter: 0 }))
);
