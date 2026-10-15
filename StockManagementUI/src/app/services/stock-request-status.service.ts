import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, RequestStatusResponseDto } from '../models/stock-request-status';
import { environment } from '../enviorments/enviorments';



@Injectable({
  providedIn: 'root'
})
export class RequestStatusService {

  private apiUrl = `${environment.apiBaseUrl}/RequestStatus`;

  constructor(private http: HttpClient) {}

  getRequestStatuses(): Observable<ApiResponse<RequestStatusResponseDto[]>> {
    return this.http.get<ApiResponse<RequestStatusResponseDto[]>>(
      `${this.apiUrl}/RequestStatuses`
    );
  }
}