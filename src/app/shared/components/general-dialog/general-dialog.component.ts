import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-general-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './general-dialog.component.html',
  styleUrl: './general-dialog.component.scss',
})
export class GeneralDialogComponent {
  title: string = '';
  iconSrc: string = '';
  textMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<GeneralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close(undefined);
  }

  confirm(): void {
    this.dialogRef.close(this.data);
  }
}
