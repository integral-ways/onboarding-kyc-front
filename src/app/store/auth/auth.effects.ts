import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ mobile, otp, trxRef }) =>
        this.authService.verifyOtp(mobile, otp, trxRef).pipe(
          map((response) => {
            // Handle nested response structure: response.data.token
            const token = response.data.token;
            return AuthActions.loginSuccess({ token });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.message || error.message || 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          localStorage.setItem('token', token);
          this.router.navigate(['/kyc']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => AuthActions.logoutSuccess())
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  loadToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadToken),
      map(() => {
        const token = localStorage.getItem('token');
        return token ? AuthActions.setToken({ token }) : AuthActions.clearToken();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
