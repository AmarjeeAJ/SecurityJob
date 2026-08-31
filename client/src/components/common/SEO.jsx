import { useEffect } from 'react';

export default function SEO({
  title = "SecurityJob.in — India's Security Recruitment Platform",
  description = "India's focused recruitment platform for security jobs. Discover and apply for Security Guard, Supervisor, CCTV Operator, Armed Guard, Bouncer, and Facility roles across India.",
  keywords = "Security Jobs, Security Guard Jobs, Security Supervisor, Lady Guard, Bouncer, Armed Guard, CCTV Operator, Jaipur, Delhi NCR, India",
  canonicalUrl = "https://securityjob.in/",
  structuredData = null,
}) {
  useEffect(() => {
    // Update Document Title
    document.title = title.includes('SecurityJob') ? title : `${title} | SecurityJob.in`;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    // Structured JSON-LD Data Injection
    let scriptTag = document.getElementById('jsonld-schema');
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'jsonld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, canonicalUrl, structuredData]);

  return null;
}
