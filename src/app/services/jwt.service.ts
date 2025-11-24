import { Injectable } from '@angular/core';

interface JwtPayload {
  sub: string; // Customer ID
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  /**
   * Decode JWT token and extract payload
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  /**
   * Get customer ID from JWT token
   */
  getCustomerId(token?: string): string | null {
    const jwtToken = token || localStorage.getItem('token');
    if (!jwtToken) {
      return null;
    }
    
    const payload = this.decodeToken(jwtToken);
    return payload?.sub || null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token?: string): boolean {
    const jwtToken = token || localStorage.getItem('token');
    if (!jwtToken) {
      return true;
    }
    
    const payload = this.decodeToken(jwtToken);
    if (!payload) {
      return true;
    }
    
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Save token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Remove token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem('token');
  }
}
