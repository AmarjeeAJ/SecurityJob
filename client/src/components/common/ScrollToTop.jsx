import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures the window scroll position always resets to the top (0, 0)
 * whenever a candidate navigates between pages or clicks 'Apply Now'.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Instantly scroll window to top on page change
    window.scrollTo(0, 0);
    // Also support document body/documentElement reset
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search]);

  return null;
}
