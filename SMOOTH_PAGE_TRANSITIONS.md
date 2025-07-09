# Page Transition System - BerkasApp

## Overview

Sistem transisi halaman yang diimplementasikan untuk memberikan pengalaman navigasi yang smooth dan modern antara halaman Welcome, Login, dan Dashboard.

## Features

- **Smooth Page Transitions**: Animasi masuk dan keluar halaman yang halus
- **Loading States**: Overlay loading dengan spinner dan pesan status
- **Form Transitions**: Animasi khusus untuk form submission
- **Responsive Design**: Transisi yang tetap optimal di semua ukuran layar
- **Performance Optimized**: Menggunakan CSS animations dengan hardware acceleration

## Implementation

### 1. Page Transition Hook (`usePageTransition.ts`)

#### Features:

- Custom hook untuk mengelola transisi antar halaman
- Support multiple animation types (slide, fade, zoom)
- Configurable timing dan animation duration
- Loading state management

#### Usage:

```tsx
const { navigateWithTransition, getTransitionClasses, isExiting } =
  usePageTransition({
    enterAnimation: 'pageFadeIn',
    exitAnimation: 'pageSlideOut',
    enterDuration: 500,
    exitDuration: 300,
  });
```

### 2. Form Transition Hook (`useFormTransition.ts`)

#### Features:

- Specialized hook untuk form submissions
- Visual feedback selama proses submit
- Automatic redirect dengan transisi

#### Usage:

```tsx
const { submitWithTransition, isSubmitting } = useFormTransition();

const handleSubmit = e => {
  e.preventDefault();
  submitWithTransition(() => {
    // Form submission logic
  });
};
```

### 3. Loading Overlay Component

#### Features:

- Backdrop blur effect
- Animated spinner dengan CSS animations
- Customizable messages
- Fade in/out transitions

## Animation Types

### 1. Page Slide In (`pageSlideIn`)

- Masuk dari kanan dengan scale effect
- Duration: 400ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### 2. Page Slide Out (`pageSlideOut`)

- Keluar ke kiri dengan scale effect
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### 3. Page Fade In (`pageFadeIn`)

- Fade dengan subtle scale
- Duration: 500ms
- Easing: ease-out

### 4. Page Fade Out (`pageFadeOut`)

- Fade dengan brightness effect
- Duration: 300ms
- Easing: ease-in

### 5. Page Zoom In (`pageZoomIn`)

- Zoom dengan rotation effect
- Duration: 600ms
- Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

### 6. Page Zoom Out (`pageZoomOut`)

- Zoom out dengan rotation
- Duration: 400ms
- Easing: cubic-bezier(0.55, 0.06, 0.68, 0.19)

## Navigation Flow

### Welcome → Login

1. User klik tombol "Masuk"
2. Loading overlay muncul
3. Page exit dengan `pageSlideOut` animation
4. Navigate ke login page
5. Login page masuk dengan `pageSlideIn` animation

### Login → Welcome (Back Button)

1. User klik "Kembali ke Beranda"
2. Loading overlay muncul
3. Page exit dengan `pageFadeOut` animation
4. Navigate ke welcome page
5. Welcome page masuk dengan `pageFadeIn` animation

### Login → Dashboard (Successful Login)

1. User submit form login
2. Form animasi `formSubmit`
3. Loading overlay dengan pesan "Masuk ke dashboard..."
4. Redirect ke dashboard setelah login sukses
5. Dashboard masuk dengan transisi default

## CSS Classes

### Transition Utilities

```css
.animate-pageSlideIn     /* Page slide in from right */
.animate-pageSlideOut    /* Page slide out to left */
.animate-pageFadeIn      /* Page fade in with scale */
.animate-pageFadeOut     /* Page fade out with brightness */
.animate-pageZoomIn      /* Page zoom in with rotation */
.animate-pageZoomOut     /* Page zoom out with rotation */
.animate-formSubmit      /* Form submission animation */
.animate-spinFade        /* Loading spinner animation */
.animate-buttonPress     /* Button click feedback */
.animate-linkGlow        /* Link hover glow effect */
```

### Component Classes

```css
.page-container          /* Main container untuk transisi */
.loading-overlay         /* Overlay untuk loading state */
.loading-spinner         /* Animated spinner */
.btn-transition          /* Button dengan enhanced transitions */
.link-transition         /* Link dengan glow effect */
```

## Performance Considerations

### Hardware Acceleration

- Menggunakan `transform` dan `opacity` untuk smooth animations
- CSS `will-change` property untuk optimize rendering
- GPU acceleration untuk complex animations

### Reduced Motion Support

- Respect `prefers-reduced-motion` media query
- Disable animations untuk users dengan motion sensitivity

### Mobile Optimization

- Lighter animations untuk mobile devices
- Conditional particle effects
- Optimized timing untuk slower devices

## Browser Support

- Modern browsers dengan CSS3 support
- Fallback untuk older browsers
- Progressive enhancement approach

## Customization

### Adding New Animations

1. Define keyframes di `app.css`
2. Add utility class
3. Update `PageTransitionOptions` interface
4. Implement dalam hook

### Timing Customization

```tsx
const customTransition = usePageTransition({
  enterDuration: 800, // Slower entrance
  exitDuration: 200, // Faster exit
  enterAnimation: 'pageZoomIn',
  exitAnimation: 'pageFadeOut',
});
```

## Testing

- Test semua transition paths
- Verify loading states
- Check responsive behavior
- Test reduced motion scenarios

## Future Enhancements

1. Shared element transitions
2. Custom easing functions
3. Gesture-based navigation
4. Advanced loading states
5. Transition direction detection
