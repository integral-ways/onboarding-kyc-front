import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NafathService, NafathStatusResponse } from '../../../services/nafath.service';

@Component({
  selector: 'app-nafath-dialog',
  templateUrl: './nafath-dialog.component.html',
  styleUrls: ['./nafath-dialog.component.scss']
})
export class NafathDialogComponent implements OnInit, OnDestroy {
  @Input() transactionId!: string;
  @Input() requestId?: string;
  @Output() completed = new EventEmitter<NafathStatusResponse>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() failed = new EventEmitter<string>();

  status: string = 'WAITING';
  message: string = '';
  elapsedTime: number = 0;
  maxWaitTime: number = 120; // 2 minutes timeout

  private pollingSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(
    private nafathService: NafathService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.transactionId) {
      console.error('Transaction ID is required');
      this.failed.emit('Transaction ID is missing');
      return;
    }

    this.startPolling();
    this.startTimer();
  }

  startPolling() {
    console.log('Starting Nafath polling for transaction:', this.transactionId);
    
    this.pollingSubscription = this.nafathService.pollStatus(this.transactionId, 5000)
      .subscribe({
        next: (response) => {
          console.log('Nafath status response:', response);
          
          this.status = response.status;
          this.message = response.message || '';

          if (response.status === 'COMPLETED') {
            // Success - continue normal flow
            console.log('Nafath authentication successful');
            console.log('Nafath token received:', response.token);
            
            if (!response.token) {
              console.error('SUCCESS status but no token received!');
              this.failed.emit('Authentication successful but no token received');
              this.stopPolling();
              return;
            }
            
            // Emit completed event with token
            // Parent component will call /auth/nafath/complete
            this.completed.emit(response);
            this.stopPolling();
          } else if (response.status === 'REJECTED') {
            // Rejected - redirect to login after showing error
            console.log('Nafath authentication rejected');
            this.failed.emit('Authentication was rejected - redirecting to login');
            this.stopPolling();
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else if (response.status === 'EXPIRED') {
            // Expired - redirect to login after showing error
            console.log('Nafath authentication expired');
            this.failed.emit('Authentication request expired - redirecting to login');
            this.stopPolling();
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else {
            // WAITING or USER_ACTION_REQUIRED - continue polling
            console.log('Nafath status:', response.status, '- continuing to poll');
          }
        },
        error: (err) => {
          console.error('Polling error:', err);
          
          // Check if it's an authentication error (401/403)
          if (err.status === 401 || err.status === 403) {
            this.failed.emit('Session expired - redirecting to login');
            this.stopPolling();
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else {
            this.failed.emit('Failed to check authentication status');
            this.stopPolling();
          }
        },
        complete: () => {
          console.log('Polling completed (observable ended)');
        }
      });
  }

  startTimer() {
    console.log('Starting timer - max wait time:', this.maxWaitTime, 'seconds');
    
    this.timerSubscription = setInterval(() => {
      this.elapsedTime++;
      
      // Log every 10 seconds
      if (this.elapsedTime % 10 === 0) {
        console.log('Elapsed time:', this.elapsedTime, 'seconds');
      }

      if (this.elapsedTime >= this.maxWaitTime) {
        // 2 minutes timeout - redirect to login
        console.log('Timeout reached - redirecting to login');
        this.failed.emit('Authentication timeout - redirecting to login');
        this.stopPolling();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      }
    }, 1000) as any;
  }

  stopPolling() {
    console.log('Stopping polling and timer');
    this.pollingSubscription?.unsubscribe();
    if (this.timerSubscription) {
      clearInterval(this.timerSubscription as any);
    }
  }

  cancel() {
    this.stopPolling();
    this.cancelled.emit();
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = this.elapsedTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getStatusIcon(): string {
    switch (this.status) {
      case 'SUCCESS':
        return 'bi-check-circle-fill';
      case 'REJECTED':
      case 'EXPIRED':
        return 'bi-x-circle-fill';
      case 'USER_ACTION_REQUIRED':
        return 'bi-exclamation-circle-fill';
      default:
        return 'bi-hourglass-split';
    }
  }

  getStatusClass(): string {
    switch (this.status) {
      case 'SUCCESS':
        return 'success';
      case 'REJECTED':
      case 'EXPIRED':
        return 'error';
      case 'USER_ACTION_REQUIRED':
        return 'warning';
      default:
        return 'waiting';
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }
}
