import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Product } from '../../../../store/product.model';
import { select, Store } from '@ngrx/store';
import * as Productactions from '../../../../store/actions/product.action';
import { selectProduct } from '../../../../store/selectors/product.selector';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateProductComponent } from '../../components/create-update-product/create-update-product.component';
import { MatButtonModule } from '@angular/material/button';
import { Actions } from '../../../../shared/enums/Actions';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { GeneralDialogComponent } from '../../../../shared/components/general-dialog/general-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [],
})
export class ProductsComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[] = [];
  productsSubscription: Observable<any> = new Observable();
  platformId = inject(PLATFORM_ID);

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.productsSubscriptions();
    this.getProducts();
  }

  private productsSubscriptions(): void {
    this.store.pipe(select(selectProduct), takeUntil(this.destroy$)).subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
    });
  }

  private getProducts(): void {
    this.store.dispatch(Productactions.getAllProducts());
  }

  createUpdateProduct(product?: Product): void {
    const dialogRef = this.dialog.open(CreateUpdateProductComponent, {
      width: '40vw',
      data: product,
    });
    const instance = dialogRef.componentInstance;
    instance.title = product ? Actions.edit : Actions.add;
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (instance.title === Actions.add)
        this.createProduct(instance.productForm.value);
      else
        this.updateProduct({ ...instance.productForm.value, id: product?.id });
    });
  }

  private createProduct(product: Product): void {
    this.store.dispatch(Productactions.postProduct({ product: product }));
    this.snackBarService.openSnackBar(
      'The product has been created successfully',
      Actions.add
    );
  }

  private updateProduct(product: Product): void {
    this.store.dispatch(Productactions.putProduct({ product: product }));
    this.snackBarService.openSnackBar(
      'The product has been updated successfully',
      Actions.edit
    );
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(GeneralDialogComponent, {
      width: '480px',
      height: '26vh',
      data: product,
    });
    const instance = dialogRef.componentInstance;
    instance.title = 'Delete Product';
    instance.textMessage = `Are you sure you want to delete ${product.name}?`;
    instance.iconSrc = 'icons/delete.svg';

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.deleteProductById(result);
    });
  }

  private deleteProductById(product: Product): void {
    this.store.dispatch(Productactions.deleteProduct({ product: product }));
    this.snackBarService.openSnackBar(
      'The product has been deleted successfully',
      Actions.delete
    );
  }
}
