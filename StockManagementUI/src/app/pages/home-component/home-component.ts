
import { Component } from '@angular/core';
import { MenuComponent, StockMenuView } from '../menu-component/menu-component';
import { StockRequestFormComponent } from '../stock-request/stock-request-form-component/stock-request-form-component';
import { StockRequestService } from '../../services/stock-request.service';
import { StockRequestDto } from '../../models/stock-request';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuComponent,
    StockRequestFormComponent
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent {

  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private stockRequestService: StockRequestService
  ) {}

  onRequestSubmit(request: StockRequestDto): void {
    if (this.submitting) {
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.stockRequestService.createRequest(request)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Stock request created successfully.';
        },
        error: error => {
          console.error('Failed to create stock request:', error);

          this.errorMessage =
            error?.error?.message ??
            'Failed to create stock request. Please try again.';
        }
      });
  }
  
  activeView: StockMenuView = 'all';

  onMenuSelected(view: StockMenuView): void {
    this.activeView = view;
  }
}
