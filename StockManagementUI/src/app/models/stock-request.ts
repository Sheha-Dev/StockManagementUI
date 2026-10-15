
// Request item DTO
export interface StockRequestItemDto {
  productId: string;
  quantity: number;
}

// Create request DTO
export interface StockRequestDto {
  fromBranchId: string;
  toBranchId: string;
  requestItems: StockRequestItemDto[];
}

// Request item response (basic example)
export interface StockRequestItemResponseDto {
  requestItemId: string;
  productId: string;
  productName?: string;
  quantity: number;
}

// Stock request response (adjust to your actual GET response)
export interface StockRequestResponseDto {
  requestId: string;
  fromBranchId: string;
  toBranchId: string;
  requestStatusId: string;
  createdBy: string;
  createdDate: string;
  isActive: boolean;
  requestItems: StockRequestItemResponseDto[];
}

// API response wrapper
export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface StockReqResponseDto {
  requestId: string;
  fromBranchId: string;
  fromBranchName: string;
  toBranchId: string;
  toBranchName: string;
  requestStatusId: string;
  requestStatusName: string;
  isActive: boolean;
  requestItems: StockRequestItemResponseDto[];
}