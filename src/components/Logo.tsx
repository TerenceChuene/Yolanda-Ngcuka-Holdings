import { Link } from 'react-router-dom'
import logo from '../assets/optimized/logo.webp'
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
        width={326}
        height={200}
        decoding="async"
        fetchPriority={variant === 'navbar' ? 'high' : 'low'}
      />
    </Link>
  )
}
