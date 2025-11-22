# Stepper RTL Support Guide

## Overview
The stepper automatically adapts its position based on the language direction (LTR/RTL).

## Behavior

### LTR (English) - Left-to-Right
When `dir="ltr"` or language is English:

#### Vertical Mode
- **Position**: Left side of screen
- **Fixed Position**: `left: 0`
- **Border**: Right border
- **Content Margin**: `margin-left: 320px`
- **Track Position**: Left side (16px from left)
- **Step Layout**: Icon → Text (left to right)

#### Horizontal Mode
- **Layout**: Left to right
- **Text Alignment**: Left
- **Hover**: Slides right

### RTL (Arabic) - Right-to-Left
When `dir="rtl"` or language is Arabic:

#### Vertical Mode
- **Position**: Right side of screen
- **Fixed Position**: `right: 0, left: auto`
- **Border**: Left border (instead of right)
- **Content Margin**: `margin-right: 320px, margin-left: 0`
- **Track Position**: Right side (16px from right)
- **Step Layout**: Text ← Icon (right to left, reversed)
- **Text Alignment**: Right-aligned

#### Horizontal Mode
- **Layout**: Right to left
- **Text Alignment**: Right
- **Hover**: Slides left

## CSS Implementation

### Vertical Layout - RTL
```scss
[dir="rtl"] {
  .progress-section.vertical-layout {
    left: auto;           // Remove left positioning
    right: 0;             // Position on right
    border-right: none;   // Remove right border
    border-left: 1px solid var(--border-color); // Add left border

    .stepper-container.vertical {
      .stepper-track {
        left: auto;       // Remove left positioning
        right: 16px;      // Position track on right
      }

      .step-item {
        flex-direction: row-reverse; // Reverse icon and text
        
        .step-content {
          text-align: right; // Right-align text
        }
      }
    }
  }

  .main-content.with-vertical-stepper {
    margin-left: 0;       // Remove left margin
    margin-right: 320px;  // Add right margin
  }
}
```

## Automatic Language Detection

The stepper position is controlled by the `dir` attribute on the HTML element:

```typescript
// In app.component.ts
setLanguage(lang: 'en' | 'ar') {
  this.currentLang = lang;
  this.translate.use(lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('language', lang);
}
```

## Visual Examples

### English (LTR)
```
┌─────────────────────────────────────────┐
│ Header                                  │
├──────────┬──────────────────────────────┤
│ Stepper  │                              │
│ (Left)   │  Main Content                │
│          │                              │
│ ✓ Step 1 │  Form Fields                 │
│ → Step 2 │                              │
│ ○ Step 3 │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Arabic (RTL)
```
┌─────────────────────────────────────────┐
│                                  Header │
├──────────────────────────────┬──────────┤
│                              │ Stepper  │
│                Main Content  │ (Right)  │
│                              │          │
│                 Form Fields  │ ✓ خطوة 1 │
│                              │ → خطوة 2 │
│                              │ ○ خطوة 3 │
│                              │          │
└──────────────────────────────┴──────────┘
```

## Responsive Behavior

### Desktop (> 1024px)
- **LTR**: Stepper on left, content on right
- **RTL**: Stepper on right, content on left

### Tablet/Mobile (< 1024px)
- Both LTR and RTL: Stepper becomes horizontal (top)
- No side positioning
- Margins removed
- Full-width content

## Testing

### Test LTR (English)
1. Click language toggle to switch to English
2. Verify stepper is on the left
3. Verify content has left margin
4. Verify text is left-aligned

### Test RTL (Arabic)
1. Click language toggle to switch to Arabic
2. Verify stepper is on the right
3. Verify content has right margin
4. Verify text is right-aligned
5. Verify step items are reversed (text before icon)

### Test Responsive
1. Resize browser to < 1024px
2. Verify stepper becomes horizontal
3. Verify margins are removed
4. Test both languages

## Browser Support

✅ All modern browsers support `dir="rtl"`
✅ CSS automatically mirrors layout
✅ No JavaScript needed for positioning
✅ Works with CSS Grid and Flexbox

## Customization

### Change Sidebar Width
```scss
.progress-section.vertical-layout {
  width: YOUR_WIDTH; // Default: 320px
}

.main-content.with-vertical-stepper {
  margin-left: YOUR_WIDTH; // LTR
}

[dir="rtl"] .main-content.with-vertical-stepper {
  margin-right: YOUR_WIDTH; // RTL
}
```

### Adjust Track Position
```scss
.stepper-track {
  left: YOUR_POSITION; // LTR
}

[dir="rtl"] .stepper-track {
  right: YOUR_POSITION; // RTL
}
```

## Best Practices

1. ✅ Always test both LTR and RTL
2. ✅ Use `dir` attribute for automatic mirroring
3. ✅ Avoid hardcoded left/right values
4. ✅ Use logical properties when possible
5. ✅ Test on actual Arabic content
6. ✅ Verify text alignment
7. ✅ Check icon positions
8. ✅ Test responsive breakpoints

## Common Issues

### Issue: Stepper on wrong side
**Solution**: Check `dir` attribute on `<html>` element

### Issue: Content overlapping stepper
**Solution**: Verify margin is applied to `.main-content.with-vertical-stepper`

### Issue: Text not aligned correctly
**Solution**: Check `.step-content` text-align property

### Issue: Icons in wrong position
**Solution**: Verify `flex-direction: row-reverse` for RTL

## Accessibility

- Screen readers respect `dir` attribute
- Keyboard navigation works in both directions
- Focus order follows visual order
- ARIA labels work correctly

## Performance

- No JavaScript calculations needed
- Pure CSS solution
- Hardware accelerated
- Smooth transitions
- No layout shifts
