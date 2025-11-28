import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class KycService {
  private apiUrl = environment.apiUrl + '/api/kyc';

  constructor(private http: HttpClient) {}

  private extractData<T>(response: ApiResponse<T>): T {
    return response.data;
  }

  // Progress
  getProgress(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/progress`)
      .pipe(map(response => this.extractData(response)));
  }

  // Personal Info
  getPersonalInfo(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/personal`)
      .pipe(map(response => this.extractData(response)));
  }

  savePersonalInfo(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/personal`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // Address Info
  getAddressInfo(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/address`)
      .pipe(map(response => this.extractData(response)));
  }

  saveAddressInfo(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/address`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // Contact Info
  getContactInfo(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/contact`)
      .pipe(map(response => this.extractData(response)));
  }

  saveContactInfo(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/contact`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // Employment Info
  getEmploymentInfo(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/employment`)
      .pipe(map(response => this.extractData(response)));
  }

  saveEmploymentInfo(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/employment`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // General Info
  getGeneralInfo(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/general`)
      .pipe(map(response => this.extractData(response)));
  }

  saveGeneralInfo(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/general`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // FATCA Info
  getFatcaInfo(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/fatca`)
      .pipe(map(response => this.extractData(response)));
  }

  saveFatcaInfo(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/fatca`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // Bank Info
  getBankInfo(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/bank`)
      .pipe(map(response => this.extractData(response)));
  }

  saveBankInfo(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/bank`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // Account Credentials
  checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/check-username/${username}`)
      .pipe(map(response => this.extractData(response)));
  }

  saveAccountCredentials(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/account-credentials`, data)
      .pipe(map(response => this.extractData(response)));
  }

  // Complete Registration
  completeRegistration(data: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/complete`, data)
      .pipe(map(response => this.extractData(response)));
  }
}
