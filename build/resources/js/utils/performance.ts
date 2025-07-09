/* eslint-disable prettier/prettier */
// Service Worker Registration
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('Service Worker registered successfully:', registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New version available, show update notification
                showUpdateNotification();
              }
            });
          }
        });

        // Listen for controlling service worker changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        // Send message to service worker for cache refresh
        if (registration.active) {
          registration.active.postMessage({
            type: 'CACHE_ASSETS',
            assets: [
              '/build/assets/app.css',
              '/build/assets/app.js',
              '/build/manifest.json',
            ],
          });
        }
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    });
  }
}

function showUpdateNotification() {
  // Create a simple update notification
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1f2937;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 300px;
    ">
      <div style="font-weight: 600; margin-bottom: 8px;">Update Available</div>
      <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">
        A new version of the app is available
      </div>
      <button onclick="window.location.reload()" style="
        background: #3b82f6;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      ">Update Now</button>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: transparent;
        color: #9ca3af;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 8px;
      ">Later</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto remove after 30 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.parentElement.removeChild(notification);
    }
  }, 30000);
}

// Preload critical CSS
export function preloadCriticalCSS() {
  const criticalCSS = ['/build/assets/app.css'];

  criticalCSS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      // Convert preload to stylesheet
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
}

// Initialize performance optimizations
export function initPerformanceOptimizations() {
  // Register service worker
  registerServiceWorker();

  // Preload critical CSS
  preloadCriticalCSS();

  // Enable GPU acceleration for smooth animations
  const style = document.createElement('style');
  style.textContent = `
    .parallax-bg-element,
    .tech-card,
    .timeline-item,
    .scroll-reveal {
      will-change: transform;
      transform: translateZ(0);
    }
    
    /* Reduce animations on low-performance devices */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    /* Performance optimization for animations */
    .animate-spin-slow {
      animation-duration: 6s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-name: spin-slow;
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    
    /* Optimize timeline animations */
    .timeline-item {
      contain: layout style paint;
    }
    
    /* Use hardware acceleration for smooth scrolling */
    .parallax-container {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
  `;
  document.head.appendChild(style);

  // Optimize images with lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      (img as HTMLImageElement).src = (img as HTMLImageElement).dataset.src!;
      img.removeAttribute('data-src');
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    // Implement simple intersection observer lazy loading
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }
}
