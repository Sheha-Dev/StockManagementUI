
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, StockRequestDto, StockRequestResponseDto } from '../models/stock-request';
import { environment } from '../enviorments/enviorments';

@Injectable({
  providedIn: 'root'
})
export class StockRequestService {

  private apiUrl = `${environment.apiBaseUrl}/Request`;

  constructor(private http: HttpClient) {}

  // Get stock requests with optional filters and pagination
  getRequests(
    requestStatusId?: string,
    fromBranchId?: string,
    toBranchId?: string,
    productId?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<StockRequestResponseDto[]>> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (requestStatusId) {
      params = params.set('requestStatusId', requestStatusId);
    }

    if (fromBranchId) {
      params = params.set('fromBranchId', fromBranchId);
    }

    if (toBranchId) {
      params = params.set('toBranchId', toBranchId);
    }

    if (productId) {
      params = params.set('productId', productId);
    }

    return this.http.get<ApiResponse<StockRequestResponseDto[]>>(
      `${this.apiUrl}/Requests`,
      { params }
    );
  }

  // Create a new stock request
  createRequest(dto: StockRequestDto): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/Requests`,
      dto
    );
  }

  // Dispatch a stock request
  dispatchRequest(requestId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${requestId}/dispatch`,
      {}
    );
  }

  // Receive a stock request
  receiveRequest(requestId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${requestId}/receive`,
      {}
    );
  }

  // Cancel a stock request
  cancelRequest(requestId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${requestId}/cancel`,
      {}
    );
  }
}
