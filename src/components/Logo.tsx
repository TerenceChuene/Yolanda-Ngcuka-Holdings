import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Logo.css'

type LogoProps = {
  variant?: 'navbar' | 'footer'
}

export default function Logo({ variant = 'navbar' }: LogoProps) {
  return (
    <Link
      to="/"
      className={`brand-logo brand-logo--${variant}`}
      aria-label="Yolanda Ngcuka Holdings home"
      onClick={() => {
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }}
    >
      <img
        src={logo}
        alt="Yolanda Ngcuka Holdings"
        className="brand-logo__img"
      />
    </Link>
  )
}
