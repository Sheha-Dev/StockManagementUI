
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { BranchService } from '../../services/branch.service';
import { ProductService } from '../../services/product.service';
import { RequestStatusService } from '../../services/stock-request-status.service';
import { StockRequestService } from '../../services/stock-request.service';

import { BranchResponseDto } from '../../models/branch';
import { ProductResponseDto } from '../../models/product';
import { RequestStatusResponseDto } from '../../models/stock-request-status';
import { StockReqResponseDto } from '../../models/stock-request';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './request-list.html',
  styleUrl: './request-list.scss'
})
export class RequestList implements OnInit {

  filterForm: FormGroup;

  branches: BranchResponseDto[] = [];
  products: ProductResponseDto[] = [];
  statuses: RequestStatusResponseDto[] = [];

  requests: StockReqResponseDto[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  pageNumber = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private productService: ProductService,
    private requestStatusService: RequestStatusService,
    private stockRequestService: StockRequestService,
    private router: Router,
    private cdr : ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      requestStatusId: [''],
      fromBranchId: [''],
      toBranchId: [''],
      productId: ['']
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.loadRequests();
  }

  // Load branches, products, and statuses for filters
  loadDropdownData(): void {
    forkJoin({
      branches: this.branchService.getBranches(),
      products: this.productService.getProducts(),
      statuses: this.requestStatusService.getRequestStatuses()
    }).subscribe({
      next: result => {
        this.branches = (result.branches.data ?? [])
          .filter(branch => branch.isActive);

        this.products = (result.products.data ?? [])
          .filter(product => product.isActive);

        this.statuses = result.statuses.data ?? [];
      },
      error: error => {
        console.error('Error loading filter data:', error);

        this.errorMessage =
          'Unable to load branches, products, or request statuses.';
      }
    });
  }

  // Load requests using the selected filters
  loadRequests(): void {
    this.loading = true;
    this.errorMessage = '';

    const filters = this.filterForm.getRawValue();

    this.stockRequestService.getRequests(
      filters.requestStatusId || undefined,
      filters.fromBranchId || undefined,
      filters.toBranchId || undefined,
      filters.productId || undefined,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: response => {
        this.requests = response.data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error loading stock requests:', error);

        this.requests = [];
        this.loading = false;

        this.errorMessage =
          error.error?.message || 'Unable to load stock requests.';
      }
    });
  }

  // Apply filters
  applyFilters(): void {
    this.pageNumber = 1;
    this.loadRequests();
  }

  // Clear filters
  resetFilters(): void {
    this.filterForm.reset({
      requestStatusId: '',
      fromBranchId: '',
      toBranchId: '',
      productId: ''
    });

    this.pageNumber = 1;
    this.loadRequests();
  }

  // Pagination
  changePage(page: number): void {
    if (page < 1 || page === this.pageNumber) {
      return;
    }

    this.pageNumber = page;
    this.loadRequests();
  }

  get hasPreviousPage(): boolean {
    return this.pageNumber > 1;
  }

  get hasNextPage(): boolean {
    // Assumes the API returns a full page when another page may exist.
    return this.requests.length === this.pageSize;
  }

  // Normalize status for comparisons
  getNormalizedStatus(request: StockReqResponseDto): string {
    return (request.requestStatusName ?? '')
      .trim()
      .toLowerCase();
  }

  // Requested -> Dispatch and Cancel
  canDispatch(request: StockReqResponseDto): boolean {
    return this.getNormalizedStatus(request) === 'requested';
  }

  canCancel(request: StockReqResponseDto): boolean {
    return this.getNormalizedStatus(request) === 'requested';
  }

  // Dispatched -> Receive
  canReceive(request: StockReqResponseDto): boolean {
    return this.getNormalizedStatus(request) === 'dispatched';
  }

  // Received -> Completed (disabled)
  isReceived(request: StockReqResponseDto): boolean {
    return this.getNormalizedStatus(request) === 'received';
  }

  // Cancelled -> Cancelled (disabled)
  isCancelled(request: StockReqResponseDto): boolean {
    return this.getNormalizedStatus(request) === 'cancelled';
  }

  // CSS status class
  getStatusClass(status: string): string {
    return (status ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  // Calculate total quantity
  getTotalQuantity(request: StockReqResponseDto): number {
    return (request.requestItems ?? []).reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // Show product names and quantities
  getItemSummary(request: StockReqResponseDto): string {
    if (!request.requestItems?.length) {
      return 'No items';
    }

    return request.requestItems.map(item => {
      const productName =
        item.productName || this.getProductName(item.productId);

      return `${productName} × ${item.quantity}`;
    }).join(', ');
  }

  private getProductName(productId: string): string {
    return this.products.find(
      product => product.productId === productId
    )?.productName ?? productId;
  }

  // Navigate to the shared action form with request ID
  goToAction(
    request: StockReqResponseDto,
    action: 'dispatch' | 'received' | 'cancelled'
  ): void {
    this.router.navigate([
      '/',
      action,
      request.requestId
    ]);
  }

  // Track table rows
  trackByRequestId(
    index: number,
    request: StockReqResponseDto
  ): string {
    return request.requestId;
  }
}
