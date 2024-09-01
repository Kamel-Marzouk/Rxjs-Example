import { createReducer, on } from '@ngrx/store';
import { Product } from '../product.model';
import * as Productactions from '../actions/product.action';

export interface ProductsState {
  readonly products: Product[];
  readonly error: any;
}

export const initialState: ProductsState = {
  products: [],
  error: null,
};

export const productsReducer = createReducer(
  initialState,
  on(Productactions.getAllProducts, (state) => ({ ...state })),
  on(Productactions.setProducts, (state, { products }) => ({
    ...state,
    products,
  })),
  on(Productactions.postProduct, (state, action) => {
    state = {
      ...state,
      products: [...state.products, action.product],
    };
    return state;
  }),
  on(Productactions.putProduct, (state, action) => {
    state = {
      ...state,
      products: state.products.map((product)=> product.id === action.product.id ? action.product : product),
    };
    return state;
  }),
  on(Productactions.deleteProduct, (state, action) => {
    const products = [...state.products];
    const index = products.findIndex(
      (product: Product) => product.id === action.product.id
    );
    products.splice(index, 1);
    state = {
      ...state,
      products: products,
    };
    return state;
  }),
  on(Productactions.getproductFailure, (state, action) => ({
    ...state,
    error: action.error,
  }))
);
