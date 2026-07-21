import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  CONTACT,
  DEFAULT_KEYWORDS,
  LOGO_PATH,
  OG_IMAGE_PATH,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_URL,
} from './config'
import { resolvePageSeo } from './pages'

function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    image: absoluteUrl(OG_IMAGE_PATH),
    description:
      '100% black-woman-owned environmental consulting firm specialising in mining regulatory compliance and sustainable environmental management.',
    email: CONTACT.email,
    telephone: CONTACT.phone,
    foundingDate: '2023',
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.locality,
      addressRegion: CONTACT.region,
      addressCountry: CONTACT.country,
    },
    areaServed: {
      '@type': 'Country',
      name: CONTACT.countryName,
    },
    sameAs: [],
    knowsAbout: [
      'Environmental management',
      'Mining regulatory compliance',
      'Environmental audits',
      'Environmental monitoring',
      'Mine rehabilitation and closure',
    ],
  }
}

export default function Seo() {
  const { pathname } = useLocation()
  const page = resolvePageSeo(pathname)
  const canonical = absoluteUrl(page.path === '/' ? '/' : page.path)
  const ogImage = absoluteUrl(OG_IMAGE_PATH)
  const robots = page.noIndex ? 'noindex, nofollow' : 'index, follow'

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="keywords" content={DEFAULT_KEYWORDS} />
      <meta name="author" content={SITE_LEGAL_NAME} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — environmental consulting`} />
      <meta property="og:locale" content="en_ZA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="theme-color" content="#2a4d38" />
      <meta name="geo.region" content="ZA-KZN" />
      <meta name="geo.placename" content="Newcastle" />

      {!page.noIndex && (
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd())}
        </script>
      )}
    </Helmet>
  )
}
