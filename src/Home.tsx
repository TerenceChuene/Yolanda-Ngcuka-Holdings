import Landing from './pages/Landing'
import About from './pages/About'
import Services from './pages/Services'
import Team from './pages/Team'
import Projects from './pages/Projects'
import Notices from './components/Notices'
import Contact from './pages/Contact'

function Home() {
  return (
    <>
      <Landing />
      <About />
      <Services />
      <Team />
      <Projects />
      <Notices />
      <Contact />
    </>
  )
}

export default Home
