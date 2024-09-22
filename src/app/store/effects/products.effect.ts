import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import * as Productactions from '../actions/product.action';

@Injectable()
export class ProductsEffects {
  constructor(private actions$: Actions, private httpService: HttpService) {}

  getAllProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Productactions.getAllProducts),
      mergeMap(() =>
        this.httpService.getAll('/products').pipe(
          map((products) => Productactions.setProducts({ products })),
          catchError((error) => {
            console.error('Error get all products', error);
            return of({ type: '[Products API] Get All Products Failed' });
          })
        )
      )
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Productactions.postProduct),
      mergeMap((action) => {
        return this.httpService.create('/products', action.product).pipe(
          map(() => {
            return Productactions.getAllProducts();
          }),
          catchError((error) => {
            console.error('Error creating product', error);
            return of({
              type: '[Creating Product API] Creating Product Failed',
            });
          })
        );
      })
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Productactions.putProduct),
      mergeMap((action) => {
        return this.httpService
          .update('/products', action.product.id, action.product)
          .pipe(map(() => Productactions.getAllProducts()));
      })
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Productactions.deleteProduct),
      mergeMap((action) => {
        return this.httpService
          .delete('/products', action.product.id!)
          .pipe(map(() => Productactions.getAllProducts()));
      })
    )
  );
}
