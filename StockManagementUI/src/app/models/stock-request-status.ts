export interface RequestStatusResponseDto {
  requestStatusId: string;
  requestStatusName: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}