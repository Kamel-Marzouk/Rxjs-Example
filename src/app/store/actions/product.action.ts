import { createAction, props } from '@ngrx/store';
import { Product } from '../product.model';

export const getAllProducts = createAction('getAllProducts');

export const setProducts = createAction(
  'setProducts',
  props<{ products: Product[] }>()
);
export const postProduct = createAction(
  'postProduct',
  props<{ product: Product }>()
);
export const putProduct = createAction(
  'putProduct',
  props<{ product: Product }>()
);
export const deleteProduct = createAction(
  'DeleteProduct',
  props<{ product: Product }>()
);
export const getproductFailure = createAction(
  'GetproductFailure',
  props<{ error: string }>()
);
