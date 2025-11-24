# RTL (Right-to-Left) Layout Guide for KYC Frontend

## Overview
The KYC frontend fully supports RTL layout for Arabic language, with automatic layout switching based on the language direction.

## How It Works

### Language Toggle
When the user clicks the language toggle button, the system:
1. Switches the language between English (`en`) and Arabic (`ar`)
2. Sets the HTML `dir` attribute to `rtl` for Arabic or `ltr` for English
3. Saves the preference to localStorage

```typescript
toggleLanguage() {
  this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
  this.translate.use(this.currentLang);
  document.documentElement.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
  localStorage.setItem('language', this.currentLang);
}
```

## Layout Behavior

### LTR (English) Layout
```
┌─────────────────────────────────────────┐
│           Header (Top)                   │
├──────────────┬──────────────────────────┤
│  Progress    │                          │
│  Section     │    Main Content          │
│  (LEFT)      │    Card Forms            │
│              │    (RIGHT)               │
│              │                          │
└──────────────┴──────────────────────────┘
```

### RTL (Arabic) Layout
```
┌─────────────────────────────────────────┐
│           Header (Top)                   │
├──────────────────────────┬──────────────┤
│                          │  Progress    │
│    Main Content          │  Section     │
│    Card Forms            │  (RIGHT)     │
│    (LEFT)                │              │
│                          │              │
└──────────────────────────┴──────────────┘
```

## CSS Implementation

### Progress Section Positioning

#### LTR (Default)
```scss
.progress-section.vertical-layout {
  position: fixed;
  top: 80px;
  left: 0;           // Progress on LEFT
  right: auto;
  width: 320px;
  border-right: 1px solid var(--border-color);
  border-left: none;
}

.main-content.with-vertical-stepper {
  margin-left: 320px;  // Content shifted RIGHT
}
```

#### RTL (Arabic)
```scss
[dir="rtl"] {
  .progress-section.vertical-layout {
    left: auto !important;
    right: 0 !important;  // Progress on RIGHT
    border-right: none !important;
    border-left: 1px solid var(--border-color) !important;
  }

  .main-content.with-vertical-stepper {
    margin-left: 0 !important;
    margin-right: 320px !important;  // Content shifted LEFT
  }
}
```

## Responsive Behavior

### Mobile/Tablet (< 1024px)
On smaller screens, the vertical layout automatically switches to horizontal:
- Progress section becomes horizontal at the top
- No side margins on content
- Works the same for both LTR and RTL

```scss
@media (max-width: 1024px) {
  .progress-section.vertical-layout {
    position: relative;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .main-content.with-vertical-stepper {
    margin-left: 0;
  }

  [dir="rtl"] .main-content.with-vertical-stepper {
    margin-right: 0 !important;
  }
}
```

## Additional RTL Support

### Header Elements
```scss
[dir="rtl"] {
  .brand-logo:hover {
    transform: translateX(-5px);  // Reverse hover direction
  }

  .mobile-action-btn {
    text-align: right;  // Right-align text
  }
}
```

### Footer Elements
```scss
[dir="rtl"] {
  .compact-footer {
    .footer-content {
      flex-direction: row-reverse;  // Reverse flex direction
    }
  }
}
```

### Step Items in Vertical Layout
```scss
[dir="rtl"] {
  .progress-section.vertical-layout {
    .stepper-container.vertical {
      .stepper-track {
        left: auto !important;
        right: 16px !important;  // Track on right side
      }

      .step-item {
        flex-direction: row-reverse;  // Reverse step layout

        .step-content {
          text-align: right;  // Right-align text
        }
      }
    }
  }
}
```

## Testing RTL Layout

### Manual Testing
1. Open the KYC application
2. Click the language toggle button in the header
3. Select "العربية" (Arabic)
4. Verify:
   - Progress section moves to the right
   - Main content shifts to the left
   - Text aligns to the right
   - All UI elements mirror correctly

### Browser DevTools
1. Open browser DevTools
2. In Console, run:
   ```javascript
   document.documentElement.setAttribute('dir', 'rtl');
   ```
3. Verify layout changes
4. To switch back:
   ```javascript
   document.documentElement.setAttribute('dir', 'ltr');
   ```

## Key Features

### ✅ Automatic Layout Switching
- No manual configuration needed
- Switches based on `dir` attribute
- Persists across page reloads

### ✅ Complete RTL Support
- Progress section positioning
- Content margins
- Text alignment
- Flex direction
- Border positioning
- Hover effects

### ✅ Responsive Design
- Works on all screen sizes
- Adapts to mobile/tablet
- Maintains usability

### ✅ Accessibility
- Proper `dir` attribute
- Semantic HTML
- Keyboard navigation
- Screen reader support

## Browser Support
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

## Implementation Checklist

- [x] HTML `dir` attribute toggle
- [x] Progress section RTL positioning
- [x] Main content RTL margins
- [x] Step items RTL layout
- [x] Header RTL support
- [x] Footer RTL support
- [x] Responsive RTL behavior
- [x] localStorage persistence
- [x] Translation integration

## Summary

The KYC frontend is **fully RTL-ready**! The layout automatically adapts when the user switches to Arabic:

**English (LTR)**: Progress LEFT → Content RIGHT  
**Arabic (RTL)**: Progress RIGHT → Content LEFT

All UI elements, including the progress section, main content, headers, and footers, properly mirror for RTL languages, providing a native experience for Arabic-speaking users.
