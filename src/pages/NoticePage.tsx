import Notices from '../components/Notices'
import Waves from '../components/Waves'
import '../components/Notices.css'

export default function NoticePage() {
  return (
    <main className="notices notices--page" id="notices" data-nav-tone="light">
      <section className="notices__band" aria-labelledby="notices-banner">
        <Waves side="right" />
        <div className="notices__band-inner">
          <header className="notices__banner" data-reveal>
            <div className="notices__banner-intro">
              <p className="notices__eyebrow">Notices & Updates</p>
              <h1 className="notices__banner-title" id="notices-banner">
                Official public notices & documents
              </h1>
            </div>
            <p className="notices__banner-lede">
              Browse active public notices, regulatory documents, and
              company updates published by Yolanda Ngcuka Holdings.
            </p>
          </header>
        </div>
      </section>

      <Notices variant="page" />
    </main>
  )
}
