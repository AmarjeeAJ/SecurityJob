import { useEffect } from 'react';

/**
 * Marks the current page as noindex/nofollow while it is mounted.
 *
 * robots.txt asks crawlers not to fetch /owner/*, but a URL that is linked
 * from somewhere else can still end up in search results without ever being
 * crawled. This meta tag is the part that actually keeps the owner area out
 * of the index. Removed on unmount so the public pages stay indexable.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

export default useNoIndex;
