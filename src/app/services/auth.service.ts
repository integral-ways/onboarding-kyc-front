import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StartOnboardingRequest {
  idNumber: string;
  mobile: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
  trxRef?: string;
}

export interface JwtResponse {
  token: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

export interface StartOnboardingData {
  message: string;
  trxRef: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/auth';

  constructor(private http: HttpClient) {}

  startOnboarding(data: StartOnboardingRequest): Observable<ApiResponse<StartOnboardingData>> {
    return this.http.post<ApiResponse<StartOnboardingData>>(`${this.apiUrl}/login`, data);
  }

  verifyOtp(mobile: string, otp: string, trxRef?: string): Observable<ApiResponse<JwtResponse>> {
    const payload: any = { mobile, otp };
    if (trxRef) {
      payload.trxRef = trxRef;
    }
    return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/verify`, payload);
  }

  nafathStart(idNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/nafath/start/${idNumber}`, {});
  }

  nafathPoll(txId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/nafath/poll/${txId}`);
  }
}
