import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, BranchResponseDto } from '../models/branch';
import { environment } from '../enviorments/enviorments';


@Injectable({
    providedIn: 'root'
})
export class BranchService {

    private apiUrl = `${environment.apiBaseUrl}/Branch`;

    constructor(private http: HttpClient) { }

    getBranches(): Observable<ApiResponse<BranchResponseDto[]>> {
        return this.http.get<ApiResponse<BranchResponseDto[]>>(
            `${this.apiUrl}/Branches`
        );
    }
}