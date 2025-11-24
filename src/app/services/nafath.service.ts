import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, takeWhile, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface NafathStatusResponse {
  status: 'WAITING' | 'USER_ACTION_REQUIRED' | 'SUCCESS' | 'REJECTED' | 'EXPIRED';
  token?: string;
  message?: string;
  updatedAt?: string;
}

export interface NafathUserProfile {
  nationalId: string;
  fullNameAr: string;
  fullNameEn: string;
  gender: string;
  mobile: string;
  birthDateHijri: string;
  birthDateGregorian: string;
  address: {
    street: string;
    district: string;
    city: string;
    region: string;
    postalCode: string;
    additionalNumber: string;
    unitNumber: string;
  };
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class NafathService {
  private apiUrl = environment.apiUrl + '/api/nafath';

  constructor(private http: HttpClient) {}

  /**
   * Check Nafath authentication status
   */
  checkStatus(transId: string): Observable<ApiResponse<NafathStatusResponse>> {
    return this.http.get<ApiResponse<NafathStatusResponse>>(`${this.apiUrl}/status/${transId}`);
  }

  /**
   * Poll Nafath status every intervalMs milliseconds
   * Returns an observable that emits status responses
   * Component should handle when to stop polling
   */
  pollStatus(transId: string, intervalMs: number = 5000): Observable<NafathStatusResponse> {
    return interval(intervalMs).pipe(
      switchMap(() => this.checkStatus(transId)),
      map(response => response.data)
    );
  }

  /**
   * Get user profile from Nafath
   */
  getProfile(token: string): Observable<ApiResponse<NafathUserProfile>> {
    return this.http.get<ApiResponse<NafathUserProfile>>(`${this.apiUrl}/profile/${token}`);
  }
}
