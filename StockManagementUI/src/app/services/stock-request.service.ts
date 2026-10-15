
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ApiResponse,
  StockRequestDto,
  StockReqResponseDto
} from '../models/stock-request';

import { environment } from '../enviorments/enviorments';

@Injectable({
  providedIn: 'root'
})
export class StockRequestService {

  private apiUrl = `${environment.apiBaseUrl}/Request`;

  constructor(private http: HttpClient) {}

  getRequests(
    requestStatusId?: string,
    fromBranchId?: string,
    toBranchId?: string,
    productId?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<StockReqResponseDto[]>> {

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

    return this.http.get<ApiResponse<StockReqResponseDto[]>>(
      `${this.apiUrl}/Requests`,
      { params }
    );
  }

  createRequest(dto: StockRequestDto): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/Requests`,
      dto
    );
  }

  dispatchRequest(requestId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${requestId}/dispatch`,
      {}
    );
  }

  receiveRequest(requestId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${requestId}/receive`,
      {}
    );
  }

  cancelRequest(requestId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${requestId}/cancel`,
      {}
    );
  }
}
