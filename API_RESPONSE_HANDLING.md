# API Response Handling

## Backend Response Format

The backend returns responses in a standardized wrapper format:

```json
{
  "status": 200,
  "message": "success",
  "timestamp": "2025-11-21T16:06:30.036840600Z",
  "data": {
    // Actual response data here
  }
}
```

## Updated Response Handling

### 1. Start Onboarding Response

**Backend Response:**
```json
{
  "status": 200,
  "message": "success",
  "timestamp": "2025-11-21T16:06:30.036840600Z",
  "data": {
    "message": "OTP sent",
    "trxRef": "BqESSYO3Am3Rk4p7j52vQLnVmV9XZ9bdZnmbIrDwTjWMQ4xtTSTZX7LZgnKKIbmqEUaeKDeUcB9vZ2/VzMacdCeT26OltkVlS97rWArivHKXH6y+dmOG8O0PjP/v31NsXuQv/DeNEKD5uza4qxt5Vg=="
  }
}
```

**Frontend Handling:**
```typescript
// start-onboarding.component.ts
this.authService.startOnboarding(this.startForm.value).subscribe({
  next: (response) => {
    // Extract trxRef from nested structure
    const trxRef = response?.data?.trxRef || response?.trxRef;
    if (trxRef) {
      sessionStorage.setItem('trxRef', trxRef);
    }
  }
});
```

### 2. Verify OTP Response

**Backend Response:**
```json
{
  "status": 200,
  "message": "success",
  "timestamp": "2025-11-21T16:06:30.036840600Z",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Frontend Handling:**
```typescript
// auth.effects.ts
this.authService.verifyOtp(mobile, otp, trxRef).pipe(
  map((response) => {
    // Extract token from nested structure
    const token = response?.data?.token || response?.token;
    return AuthActions.loginSuccess({ token });
  })
)
```

## TypeScript Interfaces

### Generic API Response
```typescript
export interface ApiResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}
```

### Start Onboarding
```typescript
export interface StartOnboardingData {
  message: string;
  trxRef: string;
}

// Service method
startOnboarding(data: StartOnboardingRequest): Observable<ApiResponse<StartOnboardingData>>
```

### Verify OTP
```typescript
export interface JwtResponse {
  token: string;
}

// Service method
verifyOtp(mobile: string, otp: string, trxRef?: string): Observable<ApiResponse<JwtResponse>>
```

## Backward Compatibility

The code handles both response formats:

```typescript
// Works with both:
// 1. Nested: { data: { token: "..." } }
// 2. Direct: { token: "..." }

const token = response?.data?.token || response?.token;
const trxRef = response?.data?.trxRef || response?.trxRef;
```

This ensures the frontend works even if the backend response format changes.

## Error Handling

Errors are also extracted from the nested structure:

```typescript
catchError((error) =>
  of(AuthActions.loginFailure({ 
    error: error.error?.message || error.message || 'Login failed' 
  }))
)
```

## Files Updated

1. ✅ `auth.service.ts` - Added interfaces and typed responses
2. ✅ `start-onboarding.component.ts` - Extract trxRef from nested data
3. ✅ `auth.effects.ts` - Extract token from nested data
4. ✅ Error handling updated for nested structure

## Testing

### Test Start Onboarding
```bash
# Request
POST /api/auth/start
{
  "idNumber": "1234567890",
  "mobile": "0512345678"
}

# Response
{
  "status": 200,
  "message": "success",
  "data": {
    "message": "OTP sent",
    "trxRef": "..."
  }
}

# Frontend should:
✅ Store mobile in sessionStorage
✅ Store trxRef in sessionStorage
✅ Redirect to login page
```

### Test Verify OTP
```bash
# Request
POST /api/auth/verify-otp
{
  "mobile": "0512345678",
  "otp": "123456",
  "trxRef": "..."
}

# Response
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "eyJ..."
  }
}

# Frontend should:
✅ Extract token from response.data.token
✅ Store token in localStorage
✅ Redirect to /kyc
```

## Benefits

✅ **Type Safety**: Proper TypeScript interfaces
✅ **Backward Compatible**: Works with both nested and direct responses
✅ **Error Handling**: Properly extracts error messages
✅ **Maintainable**: Clear structure and documentation
✅ **Flexible**: Easy to add new response types

## Next Steps

If other API endpoints also use this wrapper format, update their services similarly:

```typescript
// Example for KYC endpoints
getProgress(): Observable<ApiResponse<ProgressData>> {
  return this.http.get<ApiResponse<ProgressData>>(`${this.apiUrl}/progress`);
}

// Then extract data in component
this.kycService.getProgress().subscribe({
  next: (response) => {
    const progress = response?.data || response;
    // Use progress data
  }
});
```
