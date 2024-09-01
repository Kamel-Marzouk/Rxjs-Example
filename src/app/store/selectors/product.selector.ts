import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from '../reducers/product.reducer';

const selectProductState = createFeatureSelector<ProductsState>('products');

export const selectProduct = createSelector(
  selectProductState,
  (state) => state.products
);
