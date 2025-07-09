import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export interface PageTransitionOptions {
  enterDuration?: number;
  exitDuration?: number;
  enterAnimation?: string;
  exitAnimation?: string;
}

export function usePageTransition(options: PageTransitionOptions = {}) {
  const {
    enterDuration = 300,
    exitDuration = 200,
    enterAnimation = 'pageSlideIn',
    exitAnimation = 'pageSlideOut',
  } = options;

  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    // Entry animation
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, enterDuration);

    return () => clearTimeout(enterTimer);
  }, [enterDuration]);

  const navigateWithTransition = (
    href: string,
    options: { onFinish?: () => void; [key: string]: unknown } = {}
  ) => {
    setIsExiting(true);

    setTimeout(() => {
      router.visit(href, {
        ...options,
        onFinish: () => {
          setIsExiting(false);
          if (options.onFinish) options.onFinish();
        },
      });
    }, exitDuration);
  };

  const getTransitionClasses = () => {
    if (isExiting) {
      return `animate-${exitAnimation}`;
    }
    if (isEntering) {
      return `animate-${enterAnimation}`;
    }
    return '';
  };

  return {
    isExiting,
    isEntering,
    navigateWithTransition,
    getTransitionClasses,
  };
}

export function useFormTransition() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitWithTransition = (
    submitFn: () => void,
    redirectPath?: string
  ) => {
    setIsSubmitting(true);

    // Add visual feedback during form submission
    const form = document.querySelector('form');
    if (form) {
      form.style.transform = 'scale(0.98)';
      form.style.opacity = '0.7';
    }

    setTimeout(() => {
      submitFn();
      if (redirectPath) {
        setTimeout(() => {
          router.visit(redirectPath);
        }, 500);
      }
    }, 200);
  };

  return {
    isSubmitting,
    submitWithTransition,
  };
}
