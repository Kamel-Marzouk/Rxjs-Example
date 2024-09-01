import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../store/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Actions } from '../../../../shared/enums/Actions';

@Component({
  selector: 'app-create-update-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-update-product.component.html',
  styleUrl: './create-update-product.component.scss',
})
export class CreateUpdateProductComponent implements OnInit {
  title: string = '';
  productForm: FormGroup = new FormGroup({});

  constructor(
    private dialogRef: MatDialogRef<CreateUpdateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.onDetectPath();
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    this.dialogRef.close(this.productForm.value);
  }

  private onDetectPath(): void {
    if (this.title == Actions.edit) this.productForm.reset(this.product);
    else this.title = Actions.add;
  }

  private initForm(): void {
    this.productForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      cost: new FormControl(null, Validators.required),
      familyId: new FormControl(null, Validators.required),
      locationId: new FormControl(null, Validators.required),
    });
  }
}
