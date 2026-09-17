import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_KEYWORDS = [
  'CreatoKite',
  'Creato Kite',
  'CreatoKite UGC',
  'UGC agency India',
  'UGC creator platform',
  'creator community platform',
  'brand creator collaboration platform',
  'influencer marketing platform India',
  'UGC campaigns for brands',
  'brand and creator collaboration',
].join(', ');

const DEFAULT_DESCRIPTION =
  'CreatoKite connects brands and creator communities for high-impact UGC campaigns, creator discovery, and performance collaboration across India.';

const DEFAULT_TITLE = 'CreatoKite | UGC Agency, Brand & Creator Community Platform';
const SITE_URL = 'https://www.creatokite.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/creatokite_logo_official.png`;

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
  noindex = false,
}) {
  const pageTitle = title.includes('CreatoKite') ? title : `${title} | CreatoKite`;
  
  // Format canonical URL ensuring clean path
  let canonicalUrl = `${SITE_URL}/`;
  if (canonical) {
    const cleanPath = canonical.startsWith('/') ? canonical : `/${canonical}`;
    canonicalUrl = cleanPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${cleanPath}`;
  }

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="CreatoKite" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="CreatoKite - UGC Agency, Brand & Creator Community Platform" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="CreatoKite" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="CreatoKite - UGC Agency, Brand & Creator Community Platform" />
      <meta name="twitter:url" content={canonicalUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

