
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { forkJoin } from 'rxjs';

import { BranchService } from '../../services/branch.service';
import { ProductService } from '../../services/product.service';
import { StockRequestService } from '../../services/stock-request.service';

import { BranchResponseDto } from '../../models/branch';
import { ProductResponseDto } from '../../models/product';
import {
  StockRequestDto,
  StockReqResponseDto
} from '../../models/stock-request';

export type RequestFormMode =
  | 'request'
  | 'dispatch'
  | 'received'
  | 'cancelled';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './request-form.html',
  styleUrl: './request-form.scss'
})
export class RequestForm implements OnInit {

  mode: RequestFormMode = 'request';
  requestId: string | null = null;

  requestForm: FormGroup;

  branches: BranchResponseDto[] = [];
  products: ProductResponseDto[] = [];

  selectedRequest: StockReqResponseDto | null = null;

  loading = false;
  submitting = false;
  loadingDropdowns = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private productService: ProductService,
    private stockRequestService: StockRequestService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.requestForm = this.fb.group({
      fromBranchId: ['', Validators.required],
      toBranchId: ['', Validators.required],
      requestItems: this.fb.array([
        this.createRequestItem()
      ])
    });
  }

  ngOnInit(): void {
    const routeMode = this.route.snapshot.data['mode'] as
      | RequestFormMode
      | undefined;

    this.mode = routeMode ?? 'request';
    this.requestId = this.route.snapshot.paramMap.get('requestId');

    console.log('Mode:', this.mode);
    console.log('Request ID:', this.requestId);

    this.loadDropdownData();

    if (this.mode === 'request') {
      this.resetForm();
      this.setFormEditable(true);
    } else if (this.requestId) {
      this.loadSelectedRequest();
    } else {
      this.errorMessage = 'No request ID was provided in the URL.';
    }
  }

  get requestItems(): FormArray {
    return this.requestForm.get('requestItems') as FormArray;
  }

  private createRequestItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[1-9]\d*$/)
        ]
      ]
    });
  }

  addRequestItem(): void {
    if (this.mode === 'request') {
      this.requestItems.push(this.createRequestItem());
    }
  }

  removeRequestItem(index: number): void {
    if (
      this.mode === 'request' &&
      this.requestItems.length > 1
    ) {
      this.requestItems.removeAt(index);
    }
  }

  loadDropdownData(): void {
    this.loadingDropdowns = true;

    forkJoin({
      branches: this.branchService.getBranches(),
      products: this.productService.getProducts()
    }).subscribe({
      next: result => {
        this.branches =
          (result.branches.data ?? [])
            .filter(branch => branch.isActive);

        this.products =
          (result.products.data ?? [])
            .filter(product => product.isActive);

        this.loadingDropdowns = false;
      },
      error: error => {
        console.error(
          'Failed to load dropdown data:',
          error
        );

        this.errorMessage =
          'Unable to load branches and products.';

        this.loadingDropdowns = false;
      }
    });
  }

  loadSelectedRequest(): void {
    if (!this.requestId || this.mode === 'request') {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.selectedRequest = null;

    // Uses your existing getRequests() service method.
    this.stockRequestService.getRequests(
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      100
    ).subscribe({
      next: response => {
        const requests = response.data ?? [];

        this.selectedRequest =
          requests.find(
            request =>
              request.requestId === this.requestId
          ) ?? null;

        if (!this.selectedRequest) {
          this.errorMessage =
            'Request not found. Check the request ID or API response.';

          this.loading = false;
          return;
        }

        this.populateForm(this.selectedRequest);
        this.loading = false;

        this.cdr.detectChanges();

        console.log(
          'Selected request:',
          this.selectedRequest
        );
      },
      error: error => {
        console.error(
          'Failed to load selected request:',
          error
        );

        this.errorMessage =
          error.error?.message ??
          'Unable to load request details.';

        this.loading = false;
      }
    });
  }

  private populateForm(
    request: StockReqResponseDto
  ): void {
    this.requestForm.enable({ emitEvent: false });

    this.requestForm.patchValue({
      fromBranchId: request.fromBranchId,
      toBranchId: request.toBranchId
    }, { emitEvent: false });

    this.requestItems.clear({ emitEvent: false });

    if (request.requestItems?.length) {
      request.requestItems.forEach(item => {
        this.requestItems.push(
          this.fb.group({
            productId: [
              item.productId,
              Validators.required
            ],
            quantity: [
              item.quantity,
              [
                Validators.required,
                Validators.min(1),
                Validators.pattern(/^[1-9]\d*$/)
              ]
            ]
          }),
          { emitEvent: false }
        );
      });
    } else {
      this.requestItems.push(
        this.createRequestItem()
      );
    }

    // Action modes display the request as read-only.
    this.setFormEditable(false);
  }

  private setFormEditable(
    editable: boolean
  ): void {
    if (editable) {
      this.requestForm.enable({
        emitEvent: false
      });
    } else {
      this.requestForm.disable({
        emitEvent: false
      });
    }
  }

  private resetForm(): void {
    this.requestForm.enable({
      emitEvent: false
    });

    this.requestForm.reset({
      fromBranchId: '',
      toBranchId: ''
    }, { emitEvent: false });

    this.requestItems.clear({
      emitEvent: false
    });

    this.requestItems.push(
      this.createRequestItem()
    );
  }

  submitRequest(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.mode !== 'request') {
      return;
    }

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.requestForm.getRawValue();

    if (
      formValue.fromBranchId ===
      formValue.toBranchId
    ) {
      this.errorMessage =
        'From Branch and To Branch must be different.';
      return;
    }

    const dto: StockRequestDto = {
      fromBranchId: formValue.fromBranchId,
      toBranchId: formValue.toBranchId,
      requestItems: formValue.requestItems.map(
        (item: {
          productId: string;
          quantity: number;
        }) => ({
          productId: item.productId,
          quantity: Number(item.quantity)
        })
      )
    };

    this.submitting = true;

    this.stockRequestService
      .createRequest(dto)
      .subscribe({
        next: () => {
          this.successMessage =
            'Stock request created successfully.';

          this.resetForm();
          this.submitting = false;
          this.cdr.detectChanges();
        },
        error: error => {
          console.error(
            'Failed to create request:',
            error
          );

          this.errorMessage =
            error.error?.message ??
            'Failed to create stock request.';

          this.submitting = false;
          this.cdr.detectChanges();
        }
      });
  }

  performAction(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.requestId || !this.selectedRequest) {
      this.errorMessage =
        'Load a valid stock request before continuing.';
      return;
    }

    const status =
      (this.selectedRequest.requestStatusName ?? '')
        .trim()
        .toLowerCase();

    const actionNames: Record<
      'dispatch' | 'received' | 'cancelled',
      string
    > = {
      dispatch: 'dispatch',
      received: 'receive',
      cancelled: 'cancel'
    };

    if (
      this.mode !== 'dispatch' &&
      this.mode !== 'received' &&
      this.mode !== 'cancelled'
    ) {
      return;
    }

    const actionName = actionNames[this.mode];

    const validAction =
      (this.mode === 'dispatch' &&
        status === 'requested') ||
      (this.mode === 'received' &&
        status === 'dispatched') ||
      (this.mode === 'cancelled' &&
        status === 'requested');

    if (!validAction) {
      this.errorMessage =
        `Cannot ${actionName} a request with status "${this.selectedRequest.requestStatusName}".`;
      return;
    }

    if (!confirm(
      `Are you sure you want to ${actionName} request ${this.requestId}?`
    )) {
      return;
    }

    this.submitting = true;

    const action$ =
      this.mode === 'dispatch'
        ? this.stockRequestService
          .dispatchRequest(this.requestId)
        : this.mode === 'received'
          ? this.stockRequestService
            .receiveRequest(this.requestId)
          : this.stockRequestService
            .cancelRequest(this.requestId);

    action$.subscribe({
      next: () => {
        this.successMessage =
          `Request ${actionName} operation completed successfully.`;

        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error(
          `Failed to ${actionName} request:`,
          error
        );

        this.errorMessage =
          error.error?.message ??
          `Failed to ${actionName} request.`;

        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  get pageTitle(): string {
    const titles: Record<RequestFormMode, string> = {
      request: 'Create Stock Request',
      dispatch: 'Dispatch Request',
      received: 'Receive Request',
      cancelled: 'Cancel Request'
    };

    return titles[this.mode];
  }

  get actionButtonText(): string {
    const labels: Record<RequestFormMode, string> = {
      request: 'Create Request',
      dispatch: 'Dispatch',
      received: 'Receive',
      cancelled: 'Cancel Request'
    };

    return labels[this.mode];
  }
}
