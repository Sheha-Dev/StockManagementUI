
export interface StockRequestItemDto {
  productId: string;
  quantity: number;
}

export interface StockRequestDto {
  fromBranchId: string;
  toBranchId: string;
  requestItems: StockRequestItemDto[];
}

export interface StockRequestItemResponseDto {
  requestItemId: string;
  productId: string;
  productName?: string;
  quantity: number;
}

export interface StockReqResponseDto {
  requestId: string;
  fromBranchId: string;
  fromBranchName: string;
  toBranchId: string;
  toBranchName: string;
  requestStatusId: string;
  requestStatusName: string;
  createdBy: string;
  createdDate: string;
  isActive: boolean;
  requestItems: StockRequestItemResponseDto[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
