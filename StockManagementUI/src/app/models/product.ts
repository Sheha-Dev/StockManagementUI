export interface ProductResponseDto {
  productId: string;
  productName: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}