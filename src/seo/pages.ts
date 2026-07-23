import { DEFAULT_DESCRIPTION, SITE_NAME } from './config'

export type PageSeo = {
  title: string
  description: string
  path: string
  /** When true, search engines should not index the page. */
  noIndex?: boolean
}

export const pageSeo: Record<string, PageSeo> = {
  '/': {
    title: `${SITE_NAME} | Environmental Consulting for Mining`,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  },
  '/about': {
    title: `About Us | ${SITE_NAME}`,
    description:
      'Established in 2023 in Newcastle, KZN — a 100% black-woman-owned firm delivering environmental management and regulatory compliance for mining across South Africa.',
    path: '/about',
  },
  '/about-page': {
    title: `About Us | ${SITE_NAME}`,
    description:
      'Established in 2023 in Newcastle, KZN — a 100% black-woman-owned firm delivering environmental management and regulatory compliance for mining across South Africa.',
    path: '/about-page',
  },
  '/services': {
    title: `Services | ${SITE_NAME}`,
    description:
      'Environmental management, audits & compliance, monitoring programmes, and rehabilitation & closure planning for mining operations.',
    path: '/services',
  },
  '/services-page': {
    title: `Core Services | ${SITE_NAME}`,
    description:
      'Authorisation services, environmental audits and compliance, monitoring programmes, and rehabilitation and closure planning for mining projects.',
    path: '/services-page',
  },
  '/team': {
    title: `Our Team | ${SITE_NAME}`,
    description:
      'Meet the Yolanda Ngcuka Holdings team — environmental scientists and compliance specialists with deep mining-sector experience.',
    path: '/team',
  },
  '/projects': {
    title: `Projects | ${SITE_NAME}`,
    description:
      'Selected environmental consulting projects across feedlot and mining operations in Gauteng, KwaZulu-Natal, and the Northern Cape.',
    path: '/projects',
  },
  '/contact': {
    title: `Contact | ${SITE_NAME}`,
    description:
      'Contact Yolanda Ngcuka Holdings for environmental consulting and mining compliance support. Based in Newcastle, South Africa.',
    path: '/contact',
  },
  '/admin': {
    title: `Admin | ${SITE_NAME}`,
    description: 'Notice management portal.',
    path: '/admin',
    noIndex: true,
  },
  '/admin/login': {
    title: `Admin Login | ${SITE_NAME}`,
    description: 'Secure admin sign-in.',
    path: '/admin/login',
    noIndex: true,
  },
}

const notFoundSeo: PageSeo = {
  title: `Page Not Found | ${SITE_NAME}`,
  description: 'The page you requested could not be found.',
  path: '/',
  noIndex: true,
}

export function resolvePageSeo(pathname: string): PageSeo {
  if (pathname.startsWith('/admin')) {
    return pageSeo[pathname] ?? pageSeo['/admin']
  }
  return pageSeo[pathname] ?? notFoundSeo
}
