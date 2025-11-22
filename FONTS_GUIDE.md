# Font Configuration Guide

## Fonts Used

### Arabic Font: **Tajawal**
- **Source**: Google Fonts
- **Weights**: 300, 400, 500, 700, 900
- **Why Tajawal?**
  - Designed specifically for Arabic text
  - Excellent readability for Saudi Arabian users
  - Modern and professional appearance
  - Supports all Arabic characters and diacritics
  - Good web performance

### English Font: **Inter**
- **Source**: Google Fonts
- **Weights**: 300, 400, 500, 600, 700
- **Why Inter?**
  - Modern, clean, and professional
  - Excellent readability on screens
  - Pairs well with Tajawal
  - Widely used in modern web applications

## Font Stack

```scss
// Default (supports both languages)
font-family: 'Tajawal', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial', sans-serif;

// English specific
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

// Arabic specific (RTL)
font-family: 'Tajawal', 'Arial', sans-serif;
```

## Language Detection

The application automatically applies the correct font based on:
1. **HTML lang attribute**: Set via `document.documentElement.setAttribute('lang', lang)`
2. **RTL direction**: Set via `document.documentElement.setAttribute('dir', 'rtl')`
3. **CSS selectors**: `[lang="ar"]` and `[dir="rtl"]`

## Typography Features

### Arabic Typography Enhancements:
- ✅ Proper letter spacing (removed for Arabic)
- ✅ Appropriate word spacing (0.05em)
- ✅ Font feature settings for better rendering
- ✅ Heavier font weights for headings (700)
- ✅ Medium weight for buttons (500)

### English Typography:
- ✅ Standard letter spacing
- ✅ Clean, modern appearance
- ✅ Optimized for screen reading

## Font Loading

Fonts are loaded via Google Fonts CDN:
```scss
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
```

The `display=swap` parameter ensures text remains visible during font loading.

## Fallback Fonts

If Google Fonts fail to load:
- **Arabic**: Falls back to system Arial
- **English**: Falls back to system fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)

## Testing

To test fonts:
1. Toggle language using the language switcher in the navbar
2. Check that Arabic text uses Tajawal font
3. Check that English text uses Inter font
4. Verify RTL layout works correctly
5. Test on different browsers and devices

## Browser Support

Both fonts support:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Fonts are loaded asynchronously
- Only required weights are loaded
- Fonts are cached by the browser
- Total font size: ~150KB (compressed)
