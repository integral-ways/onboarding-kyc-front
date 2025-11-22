import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './services/seo.service';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'KYC Onboarding';
  currentTheme: 'light' | 'dark' = 'light';
  currentLang: 'en' | 'ar' = 'en';

  constructor(
    private store: Store,
    private translate: TranslateService,
    private seoService: SeoService
  ) {
    // Initialize translation
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    
    // Load saved preferences
    const savedLang = localStorage.getItem('language') as 'en' | 'ar' || 'en';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    
    this.setLanguage(savedLang);
    this.setTheme(savedTheme);
    
    // Initialize SEO
    this.initializeSEO();
  }

  ngOnInit() {
    // Load token from localStorage on app init
    this.store.dispatch(AuthActions.loadToken());
  }
  
  private initializeSEO() {
    this.seoService.loadConfig().subscribe(config => {
      // Create structured data schemas
      this.seoService.createOrganizationSchema(config);
      this.seoService.createWebsiteSchema(config);
    });
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang = lang;
    this.translate.use(lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('language', lang);
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }
}
