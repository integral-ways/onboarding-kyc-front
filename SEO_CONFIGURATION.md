# SEO Configuration Guide

## Overview
This KYC Onboarding Platform includes comprehensive SEO optimization with configurable meta information, structured data, and professional web standards.

## Configuration File
All SEO settings are managed through: `src/assets/config/site-config.json`

### Configuration Options

```json
{
  "site": {
    "name": "Your Site Name",
    "title": "Page Title for SEO",
    "description": "Meta description (150-160 characters recommended)",
    "keywords": "comma, separated, keywords",
    "author": "Author Name",
    "url": "https://your-domain.com",
    "logo": "/assets/images/logo.png",
    "favicon": "/assets/images/favicon.ico",
    "language": "en",
    "locale": "en_US",
    "themeColor": "#4f46e5",
    "backgroundColor": "#ffffff"
  },
  "seo": {
    "robots": "index, follow",
    "googleSiteVerification": "your-google-verification-code",
    "bingSiteVerification": "your-bing-verification-code",
    "canonical": "https://your-domain.com"
  },
  "social": {
    "twitter": {
      "card": "summary_large_image",
      "site": "@yourhandle",
      "creator": "@yourhandle",
      "image": "/assets/images/social-preview.png"
    },
    "openGraph": {
      "type": "website",
      "image": "/assets/images/og-image.png",
      "imageWidth": "1200",
      "imageHeight": "630"
    }
  }
}
```

## Required Images

Create and place these images in `src/assets/images/`:

### Favicons
- `favicon.ico` - 32x32 or 16x16
- `favicon-16x16.png` - 16x16
- `favicon-32x32.png` - 32x32
- `apple-touch-icon.png` - 180x180

### PWA Icons
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Social Media
- `og-image.png` - 1200x630 (Open Graph)
- `social-preview.png` - 1200x630 (Twitter Card)

### Windows Tiles
- `mstile-70x70.png`
- `mstile-150x150.png`
- `mstile-310x310.png`
- `mstile-310x150.png`

## SEO Service Usage

### In Components

```typescript
import { SeoService } from './services/seo.service';

constructor(private seoService: SeoService) {}

ngOnInit() {
  // Update page-specific meta tags
  this.seoService.updatePageMeta(
    'Page Title',
    'Page description',
    'page, keywords'
  );
  
  // Update canonical URL
  this.seoService.updateCanonicalUrl('https://your-domain.com/page');
  
  // Add breadcrumb schema
  this.seoService.createBreadcrumbSchema([
    { name: 'Home', url: 'https://your-domain.com' },
    { name: 'KYC', url: 'https://your-domain.com/kyc' },
    { name: 'Personal Info', url: 'https://your-domain.com/kyc/personal-info' }
  ]);
}
```

## Files Included

1. **index.html** - Enhanced with comprehensive meta tags
2. **manifest.json** - PWA manifest for installable app
3. **robots.txt** - Search engine crawler instructions
4. **sitemap.xml** - Site structure for search engines
5. **browserconfig.xml** - Windows tile configuration
6. **site-config.json** - Centralized SEO configuration

## Structured Data

The platform automatically generates:
- Organization Schema
- Website Schema
- Breadcrumb Schema (per page)

## Best Practices

### Meta Descriptions
- Keep between 150-160 characters
- Include primary keywords
- Make it compelling and actionable

### Keywords
- Use 5-10 relevant keywords
- Separate with commas
- Focus on long-tail keywords

### Images
- Optimize all images (compress)
- Use descriptive file names
- Include alt text

### Performance
- Enable gzip compression
- Minify CSS/JS
- Use CDN for static assets
- Enable browser caching

## Verification

### Google Search Console
1. Get verification code from Google Search Console
2. Add to `site-config.json` → `seo.googleSiteVerification`
3. Deploy and verify

### Bing Webmaster Tools
1. Get verification code from Bing Webmaster Tools
2. Add to `site-config.json` → `seo.bingSiteVerification`
3. Deploy and verify

## Testing

### SEO Tools
- Google PageSpeed Insights
- Google Mobile-Friendly Test
- Google Rich Results Test
- Lighthouse (Chrome DevTools)
- SEMrush Site Audit
- Ahrefs Site Audit

### Social Media Preview
- Facebook Sharing Debugger
- Twitter Card Validator
- LinkedIn Post Inspector

## Monitoring

Track these metrics:
- Organic search traffic
- Keyword rankings
- Page load speed
- Mobile usability
- Core Web Vitals
- Crawl errors

## Updates

When updating SEO configuration:
1. Edit `site-config.json`
2. Update `sitemap.xml` with new pages
3. Test with SEO tools
4. Submit updated sitemap to search engines
5. Monitor Search Console for issues

## Support

For SEO-related issues:
- Check browser console for errors
- Validate structured data
- Test meta tags with preview tools
- Review Search Console reports
