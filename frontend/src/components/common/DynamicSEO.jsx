import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://www.creatokite.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/creatokite_logo_official.png`;

const PUBLIC_ROUTE_SEO = {
  '/': {
    title: 'CreatoKite | UGC Agency, Brand & Creator Community Platform',
    description: 'CreatoKite connects brands and creator communities for high-impact UGC campaigns, creator discovery, and performance collaboration across India.',
    keywords: 'CreatoKite, Creato Kite, CreatoKite UGC, UGC agency India, UGC creator platform, creator community platform, brand creator collaboration platform, influencer marketing platform India, UGC campaigns for brands, hire UGC creators India',
    canonical: `${SITE_URL}/`,
    noindex: false,
    breadcrumb: 'Home',
  },
  '/login': {
    title: 'Login to CreatoKite | Brand & Creator Portal',
    description: 'Sign in to your CreatoKite account to manage UGC campaigns, review creator submissions, track real-time analytics, and access collaboration rooms.',
    keywords: 'CreatoKite Login, Creator Sign In, Brand Portal Login, UGC Campaign Login',
    canonical: `${SITE_URL}/login`,
    noindex: false,
    breadcrumb: 'Login',
  },
  '/register': {
    title: 'Join CreatoKite | UGC Creator & Brand Platform Registration',
    description: 'Create your account on CreatoKite. Join top UGC creators, launch brand campaigns, and scale video content production seamlessly.',
    keywords: 'Join CreatoKite, UGC Creator Signup, Brand Registration, Influencer Onboarding, Creator Monetization India',
    canonical: `${SITE_URL}/register`,
    noindex: false,
    breadcrumb: 'Register',
  },
  '/opportunities': {
    title: 'Creator Opportunities & UGC Brand Gigs | CreatoKite',
    description: 'Browse active UGC creator opportunities, brand deals, sponsored challenges, and high-payout video campaigns on CreatoKite.',
    keywords: 'UGC Deals, Creator Opportunities, Sponsored Video Gigs, Brand Collaborations, CreatoKite Jobs, Paid Creator Campaigns',
    canonical: `${SITE_URL}/opportunities`,
    noindex: false,
    breadcrumb: 'Opportunities',
  },
  '/privacy': {
    title: 'Privacy Policy | CreatoKite - Creator & Brand Data Protection',
    description: 'Learn how CreatoKite protects creator analytics, brand campaign briefs, payment transactions, and user privacy in compliance with the DPDP Act 2023 & GDPR.',
    keywords: 'CreatoKite Privacy Policy, CreatoKite Data Protection, Creator Privacy India, UGC Platform Security, Brand Data Safety CreatoKite',
    canonical: `${SITE_URL}/privacy`,
    noindex: false,
    breadcrumb: 'Privacy Policy',
  },
  '/security': {
    title: 'Security Architecture & Trust Information | CreatoKite',
    description: 'Explore CreatoKite enterprise security safeguards: TLS 1.3 encryption, AES-256 database protection, verified payout safety, and OAuth social sandboxing.',
    keywords: 'CreatoKite Security, CreatoKite Verified Payouts, Creator Platform Encryption, Safe UGC Platform India, Brand Campaign Security',
    canonical: `${SITE_URL}/security`,
    noindex: false,
    breadcrumb: 'Security',
  },
  '/terms': {
    title: 'Terms of Service & Creator-Brand Agreement | CreatoKite',
    description: 'Review CreatoKite official terms of service governing UGC video campaigns, creator authenticity, milestone payments, and advertising usage rights.',
    keywords: 'CreatoKite Terms of Service, Creator Brand Agreement, UGC Content Usage Rights, CreatoKite Collaboration Guidelines',
    canonical: `${SITE_URL}/terms`,
    noindex: false,
    breadcrumb: 'Terms of Service',
  },
  '/blog': {
    title: 'CreatoKite Blog | UGC Marketing, Creator Growth & Platform Insights',
    description: 'Discover how CreatoKite empowers brands with authentic UGC creator matching, AI performance analytics, and creator economy insights in India.',
    keywords: 'CreatoKite Blog, UGC Marketing India, Creator Economy CreatoKite, Influencer Marketing Guides, Brand Creator Collabs',
    canonical: `${SITE_URL}/blog`,
    noindex: false,
    breadcrumb: 'Blog',
  },
};

export default function DynamicSEO() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const isPrivate = currentPath.startsWith('/admin') ||
      currentPath.startsWith('/team') ||
      currentPath.startsWith('/creator') ||
      currentPath.startsWith('/brand') ||
      currentPath.startsWith('/superadmin') ||
      currentPath === '/login-success';

    const seo = PUBLIC_ROUTE_SEO[currentPath] || {
      title: isPrivate ? 'Dashboard | CreatoKite' : 'CreatoKite | UGC Agency & Creator Community Platform',
      description: isPrivate
        ? 'CreatoKite private authenticated workspace and dashboard.'
        : 'CreatoKite connects brands and creator communities for high-impact UGC campaigns and creator discovery.',
      keywords: 'CreatoKite, UGC Platform, Creator Community, Brand Campaigns, UGC Agency India',
      canonical: isPrivate ? null : `${SITE_URL}${currentPath}`,
      noindex: isPrivate,
      breadcrumb: isPrivate ? 'Dashboard' : 'Portal',
    };

    // 1. Update Document Title
    document.title = seo.title;

    // 2. Helper to set or create meta tags
    const setMetaTag = (selector, attribute, value, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Meta Description, Keywords & Robots
    setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', seo.keywords);
    setMetaTag(
      'meta[name="robots"]',
      'name',
      'robots',
      seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 4. Update OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', DEFAULT_OG_IMAGE);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'CreatoKite');
    if (seo.canonical) {
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', seo.canonical);
    }

    // 5. Update Twitter Card Tags
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_OG_IMAGE);

    // 6. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (seo.canonical) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', seo.canonical);
    } else if (canonical && seo.noindex) {
      canonical.remove();
    }

    // 7. Inject Route BreadcrumbList Structured Data for Non-Home public pages
    const breadcrumbScriptId = 'dynamic-breadcrumb-jsonld';
    let breadcrumbEl = document.getElementById(breadcrumbScriptId);

    if (!seo.noindex && currentPath !== '/' && seo.canonical) {
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': seo.breadcrumb || 'Page',
            'item': seo.canonical,
          },
        ],
      };

      if (!breadcrumbEl) {
        breadcrumbEl = document.createElement('script');
        breadcrumbEl.id = breadcrumbScriptId;
        breadcrumbEl.type = 'application/ld+json';
        document.head.appendChild(breadcrumbEl);
      }
      breadcrumbEl.textContent = JSON.stringify(breadcrumbData);
    } else if (breadcrumbEl) {
      breadcrumbEl.remove();
    }
  }, [location.pathname]);

  return null;
}

