
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { StockRequestDto } from '../../../models/stock-request';
import { BranchService } from '../../../services/branch.service';
import { ProductService } from '../../../services/product.service';
import { BranchResponseDto } from '../../../models/branch';
import { ProductResponseDto } from '../../../models/product';

@Component({
  selector: 'app-stock-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-request-form-component.html',
  styleUrl: './stock-request-form-component.scss'
})
export class StockRequestFormComponent implements OnInit {

  @Input() submitting = false;

  @Output() requestSubmit = new EventEmitter<StockRequestDto>();
  @Output() formCancel = new EventEmitter<void>();

  branches: BranchResponseDto[] = [];
  products: ProductResponseDto[] = [];

  loadingBranches = false;
  loadingProducts = false;
  errorMessage = '';

  requestForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      fromBranchId: ['', Validators.required],
      toBranchId: ['', Validators.required],
      requestItems: this.fb.array([
        this.createRequestItem()
      ])
    });

    this.loadBranches();
    this.loadProducts();
  }

  // Request items FormArray
  get requestItems(): FormArray {
    return this.requestForm.get('requestItems') as FormArray;
  }

  // Create one product and quantity form group
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

  // Load active branches
  loadBranches(): void {
    this.loadingBranches = true;

    this.branchService.getBranches().subscribe({
      next: response => {
        this.branches = (response.data ?? [])
          .filter(branch => branch.isActive);

        this.loadingBranches = false;
      },
      error: error => {
        console.error('Failed to load branches:', error);
        this.errorMessage = 'Unable to load branches.';
        this.loadingBranches = false;
      }
    });
  }

  // Load active products
  loadProducts(): void {
    this.loadingProducts = true;

    this.productService.getProducts().subscribe({
      next: response => {
        this.products = (response.data ?? [])
          .filter(product => product.isActive);

        this.loadingProducts = false;
      },
      error: error => {
        console.error('Failed to load products:', error);
        this.errorMessage = 'Unable to load products.';
        this.loadingProducts = false;
      }
    });
  }

  // Add another request item
  addItem(): void {
    this.requestItems.push(this.createRequestItem());
  }

  // Remove a request item
  removeItem(index: number): void {
    if (this.requestItems.length > 1) {
      this.requestItems.removeAt(index);
    }
  }

  // Submit the request
  submitRequest(): void {
    this.errorMessage = '';

    if (this.submitting) {
      return;
    }

    if (this.loadingBranches || this.loadingProducts) {
      this.errorMessage =
        'Please wait for branches and products to load.';
      return;
    }

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.errorMessage =
        'Please complete all required fields correctly.';
      return;
    }

    const formValue = this.requestForm.getRawValue();

    // Prevent the same source and destination branch
    if (formValue.fromBranchId === formValue.toBranchId) {
      this.errorMessage =
        'Source and destination branches must be different.';
      return;
    }

    // Validate active branches
    const validFromBranch = this.branches.some(
      branch => branch.branchId === formValue.fromBranchId
    );

    const validToBranch = this.branches.some(
      branch => branch.branchId === formValue.toBranchId
    );

    if (!validFromBranch || !validToBranch) {
      this.errorMessage = 'Please select valid active branches.';
      return;
    }

    // Validate products and quantities
    const invalidItem = formValue.requestItems.some(
      (item: { productId: string; quantity: number }) =>
        !this.products.some(
          product => product.productId === item.productId
        ) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
    );

    if (invalidItem) {
      this.errorMessage =
        'Select a valid product and enter a whole-number quantity greater than zero for each item.';
      return;
    }

    // Prevent duplicate products
    const productIds = formValue.requestItems.map(
      (item: { productId: string }) => item.productId
    );

    if (new Set(productIds).size !== productIds.length) {
      this.errorMessage = 'Each product can only be added once.';
      return;
    }

    // Build the API request DTO
    const request: StockRequestDto = {
      fromBranchId: formValue.fromBranchId,
      toBranchId: formValue.toBranchId,
      requestItems: formValue.requestItems.map(
        (item: { productId: string; quantity: number }) => ({
          productId: item.productId,
          quantity: Number(item.quantity)
        })
      )
    };

    this.requestSubmit.emit(request);
  }

  // Cancel the form
  cancelForm(): void {
    this.formCancel.emit();
  }

  isProductAlreadySelected(
    productId: string,
    currentIndex: number
  ): boolean {
    return this.requestItems.controls.some((item, index) =>
      index !== currentIndex &&
      item.get('productId')?.value === productId
    );
  }
}
