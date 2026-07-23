import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './pages/About'
import Services from './pages/Services'
import Team from './pages/Team'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import Home from './Home'
import { AuthProvider } from './context/AuthContext'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import NotFound from './pages/NotFound'
import Seo from './seo/Seo'
import RevealObserver from './components/RevealObserver'

const PUBLIC_PATHS = new Set([
  '/',
  '/about',
  '/about-page',
  '/services',
  '/services-page',
  '/team',
  '/projects',
  '/contact',
])

/** Scroll to top on route changes; leave hash links to Navbar section scrolling. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function AppShell() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const showChrome = !isAdmin && PUBLIC_PATHS.has(location.pathname)

  return (
    <>
      <Seo />
      <ScrollToTop />
      <RevealObserver />
      {showChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about-page" element={<AboutPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services-page" element={<ServicesPage />} />
        <Route path="/team" element={<Team />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showChrome && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
