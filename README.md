# KYC Onboarding Frontend

Modern Angular application for KYC (Know Your Customer) onboarding process with amazing design, dark/light theme, RTL support, and i18n.

## Features

✨ **Modern Design**
- Beautiful, responsive UI with Bootstrap 5
- Smooth animations and transitions
- Card-based layouts with hover effects
- Modern color scheme and typography

🎨 **Theme Support**
- Light and Dark themes
- Smooth theme transitions
- Persistent theme selection
- CSS custom properties for easy customization

🌍 **Internationalization (i18n)**
- English and Arabic languages
- RTL (Right-to-Left) support for Arabic
- Persistent language selection
- Easy to add more languages

🔐 **State Management**
- NgRx for predictable state management
- Token management in store
- Persistent authentication
- Redux DevTools integration

📱 **Responsive Design**
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

## Tech Stack

- **Angular 16** - Modern web framework
- **NgRx** - State management
- **Bootstrap 5** - UI framework
- **ngx-translate** - Internationalization
- **SCSS** - Styling
- **TypeScript** - Type safety

## Prerequisites

- Node.js 16+ and npm
- Angular CLI: `npm install -g @angular/cli`

## Installation

```bash
# Navigate to frontend directory
cd kyc-frontend

# Install dependencies
npm install

# Start development server
ng serve

# Open browser at http://localhost:4200
```

## Project Structure

```
kyc-frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── store/               # NgRx store
│   │   │   └── auth/            # Auth state management
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── guards/              # Route guards
│   │   └── models/              # TypeScript interfaces
│   ├── assets/
│   │   └── i18n/                # Translation files
│   │       ├── en.json          # English translations
│   │       └── ar.json          # Arabic translations
│   ├── environments/            # Environment configs
│   └── styles.scss              # Global styles
└── package.json
```

## Configuration

### API Endpoint

Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'  // Your backend URL
};
```

### Adding New Languages

1. Create translation file: `src/assets/i18n/[lang].json`
2. Add language to app component:
```typescript
this.translate.addLangs(['en', 'ar', 'fr']); // Add 'fr'
```

### Theme Customization

Edit CSS variables in `src/styles.scss`:

```scss
:root {
  --primary-color: #4f46e5;      // Change primary color
  --secondary-color: #10b981;    // Change secondary color
  // ... more variables
}
```

## Available Scripts

```bash
# Development server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Run linting
ng lint

# Generate component
ng generate component components/my-component

# Generate service
ng generate service services/my-service
```

## NgRx Store

### Auth State

The authentication state is managed by NgRx:

```typescript
// Dispatch login action
store.dispatch(login({ mobile: '1234567890', otp: '123456' }));

// Select token
store.select(selectToken).subscribe(token => {
  console.log('Token:', token);
});

// Select authentication status
store.select(selectIsAuthenticated).subscribe(isAuth => {
  console.log('Is Authenticated:', isAuth);
});
```

## API Integration

All API calls are handled through services:

```typescript
// Inject service
constructor(private kycService: KycService) {}

// Get progress
this.kycService.getProgress().subscribe(progress => {
  console.log('Progress:', progress);
});

// Save personal info
this.kycService.savePersonalInfo(data).subscribe(response => {
  console.log('Saved:', response);
});
```

## Theme & Language Switching

```typescript
// In any component
constructor(private app: AppComponent) {}

// Toggle theme
this.app.toggleTheme();

// Toggle language
this.app.toggleLanguage();

// Set specific theme
this.app.setTheme('dark');

// Set specific language
this.app.setLanguage('ar');
```

## Building for Production

```bash
# Build with production configuration
ng build --configuration production

# Output will be in dist/kyc-frontend/
# Deploy the contents to your web server
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License
