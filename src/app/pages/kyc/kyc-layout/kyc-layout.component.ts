import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { KycService } from '../../../services/kyc.service';
import * as AuthActions from '../../../store/auth/auth.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-kyc-layout',
  templateUrl: './kyc-layout.component.html',
  styleUrls: ['./kyc-layout.component.scss']
})
export class KycLayoutComponent implements OnInit {
  progress: any;
  steps: any[] = [];
  completedSteps = 0;
  totalSteps = 8;
  currentTheme: 'light' | 'dark' = 'light';
  currentLang: 'en' | 'ar' = 'en';
  mobileMenuOpen = false;
  currentYear = new Date().getFullYear();
  stepperOrientation: 'horizontal' | 'vertical' = 'vertical'; // Configurable
  isSmallScreen = false; // Track if screen is small
  private hasRedirected = false;

  constructor(
    private kycService: KycService,
    private router: Router,
    private store: Store,
    private translate: TranslateService
  ) {
    this.currentTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    this.currentLang = (localStorage.getItem('language') as 'en' | 'ar') || 'en';
  }

  ngOnInit() {
    // Set initial dir and lang attributes
    const direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', this.currentLang);
    document.body.setAttribute('dir', direction);
    document.body.classList.toggle('rtl', this.currentLang === 'ar');
    document.body.classList.toggle('ltr', this.currentLang === 'en');
    this.translate.use(this.currentLang);
    
    // Check screen size and set stepper orientation
    this.checkScreenSize();
    
    // Listen to window resize
    window.addEventListener('resize', () => this.checkScreenSize());
    
    this.loadProgress();
    
    // Listen to route changes to update active step
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset flag when user manually navigates
      if (!this.router.url.includes('/kyc/personal-info')) {
        this.hasRedirected = true;
      }
      
      // Update current step indicator based on URL
      this.updateCurrentStepFromUrl();
    });
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    const wasSmallScreen = this.isSmallScreen;
    
    // Consider screens <= 992px as small (tablets and mobile)
    this.isSmallScreen = width <= 992;
    
    // Force horizontal orientation on small screens
    if (this.isSmallScreen) {
      this.stepperOrientation = 'horizontal';
    } else if (wasSmallScreen && !this.isSmallScreen) {
      // When transitioning from small to large screen, restore vertical
      this.stepperOrientation = 'vertical';
    }
  }

  loadProgress() {
    this.kycService.getProgress().subscribe({
      next: (data) => {
        if (!data) {
          console.warn('No progress data received');
          return;
        }
        
        this.progress = data;
        this.totalSteps = data.totalSteps || 8;
        
        // Convert steps object to array and sort by step number
        if (data.steps) {
          this.steps = Object.keys(data.steps)
            .map(key => ({
              key,
              ...data.steps[key]
            }))
            .sort((a, b) => a.stepNumber - b.stepNumber);
          
          this.completedSteps = this.steps.filter(s => s.completed).length;
          
          // Update current step based on URL
          this.updateCurrentStepFromUrl();
          
          // Redirect to current step if on base /kyc route
          this.redirectToCurrentStep(data);
        }
      },
      error: (err) => {
        console.error('Failed to load progress', err);
      }
    });
  }

  private updateCurrentStepFromUrl() {
    const currentUrl = this.router.url;
    const stepMap: { [key: string]: number } = {
      'personal-info': 1,
      'address-info': 2,
      'contact-info': 3,
      'employment-info': 4,
      'general-info': 5,
      'fatca-info': 6,
      'bank-info': 7,
      'account-credentials': 8
    };

    // Find which step we're currently on based on URL
    for (const [route, stepNum] of Object.entries(stepMap)) {
      if (currentUrl.includes(route)) {
        // Update the progress current step to match the URL
        if (this.progress) {
          this.progress.currentStep = stepNum;
        }
        break;
      }
    }
  }

  private redirectToCurrentStep(data: any) {
    // Only redirect once and if we're on a base route
    if (this.hasRedirected) {
      return;
    }

    const currentUrl = this.router.url;
    const isBaseRoute = currentUrl === '/kyc' || currentUrl === '/kyc/' || currentUrl === '/kyc/personal-info';
    
    if (!isBaseRoute) {
      this.hasRedirected = true;
      return;
    }

    // Check if all steps are completed
    if (data.allStepsCompleted) {
      // All steps completed, redirect to account summary
      this.hasRedirected = true;
      this.router.navigate(['/kyc/account-summary'], { replaceUrl: true });
      return;
    }

    const stepMap: { [key: string]: string } = {
      'personalInfo': 'personal-info',
      'addressInfo': 'address-info',
      'contactInfo': 'contact-info',
      'employmentInfo': 'employment-info',
      'generalInfo': 'general-info',
      'fatcaInfo': 'fatca-info',
      'bankInfo': 'bank-info',
      'accountCredentials': 'account-credentials'
    };

    // Find the first incomplete step
    const firstIncompleteStep = Object.keys(data.steps).find(
      key => !data.steps[key].completed
    );

    if (firstIncompleteStep) {
      const route = stepMap[firstIncompleteStep];
      if (route && currentUrl !== `/kyc/${route}`) {
        this.hasRedirected = true;
        this.router.navigate(['/kyc', route], { replaceUrl: true });
      }
    }
  }

  navigateToStep(stepKey: string) {
    const routeMap: { [key: string]: string } = {
      'personalInfo': 'personal-info',
      'addressInfo': 'address-info',
      'contactInfo': 'contact-info',
      'employmentInfo': 'employment-info',
      'generalInfo': 'general-info',
      'fatcaInfo': 'fatca-info',
      'bankInfo': 'bank-info',
      'accountCredentials': 'account-credentials'
    };
    
    const route = routeMap[stepKey] || stepKey;
    this.router.navigate(['/kyc', route]);
  }

  isActiveStep(step: any): boolean {
    const currentUrl = this.router.url;
    const routeMap: { [key: string]: string } = {
      'personalInfo': 'personal-info',
      'addressInfo': 'address-info',
      'contactInfo': 'contact-info',
      'employmentInfo': 'employment-info',
      'generalInfo': 'general-info',
      'fatcaInfo': 'fatca-info',
      'bankInfo': 'bank-info',
      'accountCredentials': 'account-credentials'
    };
    
    const route = routeMap[step.key];
    return currentUrl.includes(route);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    const direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Set direction on html and body
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', this.currentLang);
    document.body.setAttribute('dir', direction);
    
    // Toggle RTL/LTR classes
    if (this.currentLang === 'ar') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
    
    // Save to localStorage
    localStorage.setItem('language', this.currentLang);
    
    // Use translate service - this will update translations instantly
    this.translate.use(this.currentLang).subscribe(() => {
      // Translations updated successfully
      console.log('Language changed to:', this.currentLang);
    });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleStepperOrientation() {
    // Only allow toggle on large screens
    if (!this.isSmallScreen) {
      this.stepperOrientation = this.stepperOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    }
  }

  isToggleDisabled(): boolean {
    return this.isSmallScreen;
  }
}
