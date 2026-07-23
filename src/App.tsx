import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Home'
import { AuthProvider } from './context/AuthContext'
import Seo from './seo/Seo'
import RevealObserver from './components/RevealObserver'

const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Team = lazy(() => import('./pages/Team'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const NoticePage = lazy(() => import('./pages/NoticePage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

const PUBLIC_PATHS = new Set([
  '/',
  '/about',
  '/about-page',
  '/services',
  '/services-page',
  '/team',
  '/projects',
  '/notices',
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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-page" element={<AboutPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services-page" element={<ServicesPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/notices" element={<NoticePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
