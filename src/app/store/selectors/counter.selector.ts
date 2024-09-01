import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CounterState } from '../counter.model';

const selectCounterState = createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
  selectCounterState,
  (state) => state.counter
);
