# Modern Stepper Design Guide

## Overview
The KYC application features a modern, animated stepper with progress tracking, status indicators, and smooth transitions.

## Design Features

### 🎯 Progress Header

#### Progress Title
- Icon: List-check (bi-list-check)
- Text: "Progress" (translated)
- Size: 1.25rem, bold
- Color: Primary color for icon

#### Progress Stats Card
- **Glassmorphism card** with shadow
- Two statistics displayed:
  1. **Completed Steps**: Large number (1.75rem)
  2. **Total Steps**: Large number (1.75rem)
- Divider line between stats
- Uppercase labels (0.75rem)

#### Animated Progress Bar
- **Height**: 12px
- **Track**: Border color background
- **Fill**: Gradient (Purple → Blue → Green)
- **Shimmer Effect**: Animated shine overlay
- **Percentage Badge**: Shows completion %
- **Smooth Animation**: 0.6s cubic-bezier transition

### 🔄 Modern Stepper

#### Layout
- **Desktop**: Horizontal layout with 7 steps
- **Tablet**: Horizontal scrollable
- **Mobile**: Vertical stacked layout

#### Step Circle Design
- **Size**: 56x56px (64px with pulse)
- **Border**: 3px solid
- **Shadow**: Elevation effect
- **Icon/Number**: Centered, 1.25rem

#### Step States

##### 1. **Completed** ✅
- **Circle**: Green gradient (#10b981 → #34d399)
- **Icon**: Check mark (bi-check-lg)
- **Border**: Green (#10b981)
- **Shadow**: Green glow (0 8px 20px)
- **Label**: Green, bold
- **Status**: "Completed" with check icon
- **Connector**: Green gradient fade

##### 2. **Active** 🔵
- **Circle**: Purple gradient (#4f46e5 → #6366f1)
- **Number**: White text
- **Border**: Purple (#4f46e5)
- **Shadow**: Purple glow (0 12px 24px)
- **Scale**: 1.1x (enlarged)
- **Pulse**: Animated ring effect
- **Label**: Purple, bold
- **Status**: "In Progress" with arrow icon

##### 3. **Upcoming** ⚪
- **Circle**: Surface color
- **Number**: Gray text
- **Border**: Border color
- **Opacity**: 0.6 (60%)
- **Label**: Gray
- **Status**: "Upcoming" with circle icon

#### Step Content
- **Label**: Step name (translated)
  - Font: 0.875rem, semi-bold
  - Max width: 120px (desktop)
  - Centered alignment
  
- **Status Badge**: 
  - Rounded pill shape
  - Icon + text
  - Color-coded by state
  - Border and background tint

#### Connector Lines
- **Desktop**: Horizontal line between steps
- **Mobile**: Hidden (vertical layout)
- **Completed**: Green gradient
- **Others**: Gray

### 🎨 Visual Effects

#### Hover Effects
- **Desktop**: Lift up 4px
- **Mobile**: Slide right 4px (left for RTL)
- **Transition**: 0.3s ease

#### Pulse Animation
- Active step only
- Expands from 1x to 1.3x
- Fades from 0.2 to 0 opacity
- 2s infinite loop

#### Shimmer Effect
- Progress bar only
- White gradient overlay
- Slides left to right
- 2s infinite loop

#### Scale Animation
- Active step: 1.1x scale
- Smooth cubic-bezier transition
- Enhanced shadow on scale

### 📊 Progress Calculation

```typescript
completedSteps / totalSteps * 100
```

Displayed as:
- Percentage in progress bar
- Fraction in stats card (e.g., "3/7")

## Color Scheme

### Gradients

#### Progress Bar Fill
```scss
background: linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #10b981 100%);
```

#### Completed Step
```scss
background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
```

#### Active Step
```scss
background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
```

### Status Colors
- **Completed**: #10b981 (Green)
- **Active**: #4f46e5 (Purple)
- **Upcoming**: var(--text-secondary) (Gray)

## Responsive Breakpoints

### Desktop (> 1024px)
- Horizontal stepper
- All steps visible
- Full labels and status badges
- Connector lines visible

### Tablet (768px - 1024px)
- Horizontal scrollable
- Min width per step: 140px
- Horizontal scroll indicator
- All features maintained

### Mobile (< 768px)
- **Vertical layout**
- Steps stacked
- Horizontal alignment (row)
- Circle on left, content on right
- No connector lines
- Full-width labels
- Slide animation on hover

## Accessibility

### ARIA Attributes
- Step items are clickable
- Keyboard navigation supported
- Focus indicators visible
- Screen reader friendly labels

### Visual Indicators
- Color + icon (not color alone)
- Status text for each step
- Clear active state
- High contrast ratios

### Touch Targets
- Minimum 56x56px circles
- Adequate spacing between steps
- Mobile-optimized tap areas

## Animations

### Pulse Animation
```scss
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
}
```

### Shimmer Animation
```scss
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

### Transition Timing
- **Progress Bar**: 0.6s cubic-bezier(0.4, 0, 0.2, 1)
- **Step Circle**: 0.4s cubic-bezier(0.4, 0, 0.2, 1)
- **Hover Effects**: 0.3s ease
- **Pulse**: 2s infinite
- **Shimmer**: 2s infinite

## RTL Support

### Adjustments for Arabic
- Progress bar fills right to left
- Shimmer animates right to left
- Mobile hover: Slides left instead of right
- Text alignment: Right-aligned
- Icon positions maintained

## Performance Optimization

### GPU Acceleration
- Transform properties (not position)
- Opacity transitions
- Will-change hints where needed

### Efficient Animations
- CSS animations (not JavaScript)
- Hardware-accelerated properties
- Minimal repaints/reflows

### Lazy Loading
- Steps rendered only when visible
- Smooth scrolling performance
- Optimized for mobile devices

## Customization

### Change Step Colors
```scss
// Completed
background: linear-gradient(135deg, YOUR_COLOR_1, YOUR_COLOR_2);

// Active
background: linear-gradient(135deg, YOUR_COLOR_1, YOUR_COLOR_2);
```

### Adjust Step Size
```scss
.step-circle-inner {
  width: YOUR_SIZE;
  height: YOUR_SIZE;
}
```

### Modify Animation Speed
```scss
animation: pulse YOUR_DURATION infinite;
transition: all YOUR_DURATION ease;
```

## Best Practices

1. ✅ Keep step labels concise (2-3 words)
2. ✅ Maintain consistent spacing
3. ✅ Use color + icon for states
4. ✅ Test on multiple screen sizes
5. ✅ Ensure smooth animations
6. ✅ Support keyboard navigation
7. ✅ Provide clear visual feedback
8. ✅ Optimize for performance
9. ✅ Support both LTR and RTL
10. ✅ Include status indicators

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Testing Checklist

- [ ] All 7 steps display correctly
- [ ] Progress bar animates smoothly
- [ ] Active step has pulse animation
- [ ] Completed steps show checkmark
- [ ] Hover effects work on desktop
- [ ] Mobile layout is vertical
- [ ] RTL layout works correctly
- [ ] Keyboard navigation functional
- [ ] Touch targets are adequate
- [ ] Animations are smooth (60fps)
