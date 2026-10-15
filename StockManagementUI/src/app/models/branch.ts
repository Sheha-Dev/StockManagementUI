export interface BranchResponseDto {
  branchId: string;
  branchName: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}