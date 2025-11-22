import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface SiteConfig {
  site: {
    name: string;
    title: string;
    description: string;
    keywords: string;
    author: string;
    url: string;
    logo: string;
    favicon: string;
    language: string;
    locale: string;
    themeColor: string;
    backgroundColor: string;
  };
  seo: {
    robots: string;
    googleSiteVerification: string;
    bingSiteVerification: string;
    canonical: string;
  };
  social: {
    twitter: {
      card: string;
      site: string;
      creator: string;
      image: string;
    };
    openGraph: {
      type: string;
      image: string;
      imageWidth: string;
      imageHeight: string;
    };
  };
  contact: {
    email: string;
    phone: string;
  };
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private configSubject = new BehaviorSubject<SiteConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  constructor(
    private meta: Meta,
    private title: Title,
    private http: HttpClient
  ) {}

  loadConfig(): Observable<SiteConfig> {
    return this.http.get<SiteConfig>('/assets/config/site-config.json').pipe(
      tap(config => {
        this.configSubject.next(config);
        this.initializeSEO(config);
      })
    );
  }

  private initializeSEO(config: SiteConfig) {
    // Set page title
    this.title.setTitle(config.site.title);

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: config.site.description });
    this.meta.updateTag({ name: 'keywords', content: config.site.keywords });
    this.meta.updateTag({ name: 'author', content: config.site.author });
    this.meta.updateTag({ name: 'robots', content: config.seo.robots });

    // Language and locale
    this.meta.updateTag({ name: 'language', content: config.site.language });
    this.meta.updateTag({ property: 'og:locale', content: config.site.locale });

    // Theme colors
    this.meta.updateTag({ name: 'theme-color', content: config.site.themeColor });
    this.meta.updateTag({ name: 'msapplication-TileColor', content: config.site.themeColor });

    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: config.seo.canonical });

    // Site verification
    if (config.seo.googleSiteVerification) {
      this.meta.updateTag({ name: 'google-site-verification', content: config.seo.googleSiteVerification });
    }
    if (config.seo.bingSiteVerification) {
      this.meta.updateTag({ name: 'msvalidate.01', content: config.seo.bingSiteVerification });
    }

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: config.site.title });
    this.meta.updateTag({ property: 'og:description', content: config.site.description });
    this.meta.updateTag({ property: 'og:type', content: config.social.openGraph.type });
    this.meta.updateTag({ property: 'og:url', content: config.site.url });
    this.meta.updateTag({ property: 'og:image', content: config.site.url + config.social.openGraph.image });
    this.meta.updateTag({ property: 'og:image:width', content: config.social.openGraph.imageWidth });
    this.meta.updateTag({ property: 'og:image:height', content: config.social.openGraph.imageHeight });
    this.meta.updateTag({ property: 'og:site_name', content: config.site.name });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: config.social.twitter.card });
    this.meta.updateTag({ name: 'twitter:site', content: config.social.twitter.site });
    this.meta.updateTag({ name: 'twitter:creator', content: config.social.twitter.creator });
    this.meta.updateTag({ name: 'twitter:title', content: config.site.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.site.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.site.url + config.social.twitter.image });

    // Mobile app meta tags
    this.meta.updateTag({ name: 'apple-mobile-web-app-capable', content: 'yes' });
    this.meta.updateTag({ name: 'apple-mobile-web-app-status-bar-style', content: 'default' });
    this.meta.updateTag({ name: 'apple-mobile-web-app-title', content: config.site.name });
    this.meta.updateTag({ name: 'mobile-web-app-capable', content: 'yes' });

    // Update favicon
    this.updateFavicon(config.site.favicon);
  }

  updatePageMeta(title: string, description: string, keywords?: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  updateCanonicalUrl(url: string) {
    const link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', url);
    } else {
      const newLink = document.createElement('link');
      newLink.setAttribute('rel', 'canonical');
      newLink.setAttribute('href', url);
      document.head.appendChild(newLink);
    }
  }

  private updateFavicon(faviconPath: string) {
    const link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
    if (link) {
      link.setAttribute('href', faviconPath);
    }
  }

  addStructuredData(data: any) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  createOrganizationSchema(config: SiteConfig) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': config.site.name,
      'url': config.site.url,
      'logo': config.site.url + config.site.logo,
      'description': config.site.description,
      'contactPoint': {
        '@type': 'ContactPoint',
        'email': config.contact.email,
        'telephone': config.contact.phone,
        'contactType': 'Customer Service'
      },
      'sameAs': [
        config.social.twitter.site
      ]
    };
    this.addStructuredData(schema);
  }

  createWebsiteSchema(config: SiteConfig) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': config.site.name,
      'url': config.site.url,
      'description': config.site.description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': config.site.url + '/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
    this.addStructuredData(schema);
  }

  createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }));

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': itemListElement
    };
    this.addStructuredData(schema);
  }
}
