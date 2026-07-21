import { Link } from 'react-router-dom'
import Logo from './Logo'
import Waves from './Waves'
import './Footer.css'

const quickLinks = [
  { label: 'About Us', to: '/#about' },
  { label: 'Our Services', to: '/#services' },
  { label: 'Expert Team', to: '/#team' },
  { label: 'Project Portfolio', to: '/#projects' },
  { label: 'Contact Us', to: '/#contact' },
]

const services = [
  'Environmental Management Services',
  'Environmental Audits',
  'Environmental Monitoring',
  'Rehabilitation Planning',
]

export default function Footer() {
  return (
    <footer className="footer">
      <Waves />
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__brand-head">
              <Logo variant="footer" />
            </div>
            <p className="footer__desc">
              Yolanda Ngcuka Holdings (Pty) Ltd — A 100% black-woman-owned
              environmental consulting firm specialising in mining regulatory
              compliance and sustainable environmental management.
            </p>
            <p className="footer__est">
              <span className="footer__dot" aria-hidden="true" />
              Est. 2023 · Newcastle, SA
            </p>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Quick Links</h2>
            <ul className="footer__list">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Services</h2>
            <ul className="footer__list">
              {services.map((service) => (
                <li key={service}>
                  <Link to="/#services">{service}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Contact Us</h2>
            <ul className="footer__contact">
              <li>
                <a href="mailto:yolandangcukaholdings@gmail.com">
                  yolandangcukaholdings@gmail.com
                </a>
              </li>
              <li>
                <a className="footer__phone" href="tel:+27673675219">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.5 4.5h3l1.2 3.2-1.8 1.2a11 11 0 0 0 5.2 5.2l1.2-1.8 3.2 1.2v3a1.5 1.5 0 0 1-1.6 1.5A14.5 14.5 0 0 1 4.5 6.1a1.5 1.5 0 0 1 1.5-1.6h1.5z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                  067 367 5219
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Yolanda Ngcuka Holdings (Pty) Ltd. All rights reserved.</p>
          <p>Registered Environmental Consulting Firm - South Africa</p>
        </div>
      </div>
    </footer>
  )
}
