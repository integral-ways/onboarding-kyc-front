# Modern Header Design Guide

## Overview
The KYC application features a modern, responsive, and attractive header design with glassmorphism effects and smooth animations.

## Design Features

### 🎨 Visual Design
- **Gradient Background**: Purple gradient (135deg) from #4f46e5 → #6366f1 → #7c3aed
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Elevation**: Subtle shadow for depth (0 4px 20px rgba)
- **Sticky Position**: Header stays at top while scrolling

### 🏢 Brand Section
- **Logo Icon**: 
  - 56x56px rounded square (16px border radius)
  - Shield-check icon
  - Glassmorphism background
  - Subtle border and shadow
  
- **Brand Text**:
  - Title: "KYC Registration" (1.5rem, bold)
  - Subtitle: "Secure Digital Onboarding" (0.875rem)
  - Hover effect: Slides right (5px)

### 🎯 Action Buttons
Three main actions with consistent styling:

1. **Language Toggle**
   - Icon: Translate (bi-translate)
   - Text: Shows opposite language (EN shows "العربية", AR shows "English")
   
2. **Theme Toggle**
   - Icon: Moon (light mode) / Sun (dark mode)
   - Text: "Dark" / "Light"
   
3. **Logout**
   - Icon: Box arrow right
   - Red-tinted background
   - Text: "Logout" (translated)

**Button Features**:
- Glassmorphism background (rgba(255, 255, 255, 0.15))
- Backdrop blur effect
- Rounded corners (12px)
- Hover: Lifts up 2px with shadow
- Active: Returns to original position

### 📱 Responsive Design

#### Desktop (> 992px)
- Full layout with text labels
- All buttons visible
- Brand section with full text

#### Tablet (768px - 992px)
- Icon-only buttons (text hidden)
- Buttons become square (48x48px)
- Maintains horizontal layout

#### Mobile (< 768px)
- Hamburger menu toggle appears
- Desktop actions hidden
- Mobile menu slides down
- Full-width action buttons
- Compact brand section

### 🎭 Mobile Menu
- Slides down animation (max-height transition)
- Full-width buttons with icons and text
- Same glassmorphism styling
- Closes after action selection

## Color Scheme

### Primary Gradient
```scss
background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
```

### Glassmorphism
```scss
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Logout Button
```scss
background: rgba(239, 68, 68, 0.15);
border-color: rgba(239, 68, 68, 0.3);
```

## Animations

### Hover Effects
- **Brand Logo**: `translateX(5px)` (RTL: `-5px`)
- **Action Buttons**: `translateY(-2px)` + shadow
- **Background**: Opacity increase to 0.25

### Active States
- Returns to original position
- Maintains visual feedback

### Mobile Menu
- Smooth slide down: `max-height: 0` → `300px`
- 0.3s ease transition

## Accessibility

### ARIA Labels
- All buttons have `aria-label` attributes
- Mobile menu toggle labeled
- Icon-only buttons properly labeled

### Keyboard Navigation
- All interactive elements focusable
- Proper tab order
- Visual focus indicators

### Screen Readers
- Semantic HTML structure
- Descriptive button text
- Icon alternatives provided

## RTL Support

### Adjustments for Arabic
- Brand logo hover: Slides left instead of right
- Mobile menu: Text aligned right
- Icon positions maintained
- Proper spacing for Arabic text

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Backdrop Filter**: Hardware accelerated
- **Transitions**: GPU-optimized (transform, opacity)
- **Sticky Position**: Native CSS, no JS
- **Minimal Repaints**: Efficient animations

## Customization

### Change Brand Colors
Update gradient in `.modern-header`:
```scss
background: linear-gradient(135deg, YOUR_COLOR_1, YOUR_COLOR_2, YOUR_COLOR_3);
```

### Adjust Glassmorphism
Modify opacity and blur:
```scss
background: rgba(255, 255, 255, YOUR_OPACITY);
backdrop-filter: blur(YOUR_BLUR_PX);
```

### Change Button Sizes
Update padding and dimensions:
```scss
.action-btn {
  padding: YOUR_PADDING;
  border-radius: YOUR_RADIUS;
}
```

## Best Practices

1. ✅ Keep gradient subtle for readability
2. ✅ Maintain sufficient contrast (WCAG AA)
3. ✅ Test on multiple devices
4. ✅ Ensure touch targets ≥ 48x48px
5. ✅ Provide visual feedback for all interactions
6. ✅ Support both LTR and RTL layouts
7. ✅ Optimize for performance
8. ✅ Include proper accessibility attributes
