import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ProductResponseDto } from '../models/product';
import { environment } from '../enviorments/enviorments';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiBaseUrl}/Product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ApiResponse<ProductResponseDto[]>> {
    return this.http.get<ApiResponse<ProductResponseDto[]>>(
      `${this.apiUrl}/Products`
    );
  }
}