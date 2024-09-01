import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Product } from '../../../../store/product.model';
import { select, Store } from '@ngrx/store';
import {
  deleteProduct,
  postProduct,
  putProduct,
  setProducts,
} from '../../../../store/actions/product.action';
import { selectProduct } from '../../../../store/selectors/product.selector';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateProductComponent } from '../../components/create-update-product/create-update-product.component';
import { MatButtonModule } from '@angular/material/button';
import { Actions } from '../../../../shared/enums/Actions';
import { GeneralDialogComponent } from '../../../../shared/components/general-dialog/general-dialog.component';
import { HttpService } from '../../../../shared/services/http.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [HttpService],
})
export class ProductsComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[] = [];
  productsSubscription: Observable<any> = new Observable();
  platformId = inject(PLATFORM_ID);

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private httpService: HttpService
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
    this.httpService.getAll('/products').subscribe({
      next: (res) => {
        this.store.dispatch(setProducts({ products: res }));
      },
    });
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
      else this.updateProduct(product?.id, instance.productForm.value);
    });
  }

  private createProduct(product: Product): void {
    this.httpService.create('/products', product).subscribe({
      next: (product) => {
        this.store.dispatch(postProduct({ product: product }));
      },
    });
  }

  private updateProduct(productId: string | undefined, product: Product): void {
    this.httpService.update('/products', productId, product).subscribe({
      next: (product) => {
        this.store.dispatch(putProduct({ product: product }));
      },
    });
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
      this.deleteProductById(result.id);
    });
  }

  private deleteProductById(productId: string): void {
    this.httpService.delete('/products', productId).subscribe({
      next: (product) => {
        this.store.dispatch(deleteProduct({ product: product }));
      },
    });
  }
}
