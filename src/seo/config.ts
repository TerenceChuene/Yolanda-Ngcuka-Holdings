/** Canonical site origin — set VITE_SITE_URL in production builds. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://yolandangcukaholdings.co.za'
).replace(/\/$/, '')

export const SITE_NAME = 'Yolanda Ngcuka Holdings'
export const SITE_LEGAL_NAME = 'Yolanda Ngcuka Holdings (Pty) Ltd'

export const DEFAULT_DESCRIPTION =
  'Yolanda Ngcuka Holdings is a 100% black-woman-owned environmental consulting firm specialising in mining regulatory compliance, audits, monitoring, and rehabilitation across South Africa.'

export const DEFAULT_KEYWORDS = [
  'environmental consulting',
  'mining compliance',
  'environmental management',
  'South Africa',
  'Newcastle KZN',
  'mining audits',
  'rehabilitation planning',
  'black woman owned',
  'Yolanda Ngcuka Holdings',
].join(', ')

export const CONTACT = {
  email: 'yolandangcukaholdings@gmail.com',
  phone: '+27673675219',
  phoneDisplay: '067 367 5219',
  locality: 'Newcastle',
  region: 'KwaZulu-Natal',
  country: 'ZA',
  countryName: 'South Africa',
} as const

export const OG_IMAGE_PATH = '/og-image.png'
export const LOGO_PATH = '/logo.png'
