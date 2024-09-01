import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  constructor(public spinnerService: SpinnerService) {
  }
}
