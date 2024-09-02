import { ActionReducerMap } from '@ngrx/store';
import * as counterReducer from './reducers/counter.reducer';
import * as productsReducer from './reducers/product.reducer';
import { CounterState } from './counter.model';
import { ProductsEffects } from './effects/products.effect';

export interface AppState {
  counter: CounterState;
  products: productsReducer.ProductsState;
}

export const appState: ActionReducerMap<AppState,any> = {
  counter: counterReducer.counterReducer,
  products:productsReducer.productsReducer
};

export const appEffects = [ProductsEffects];