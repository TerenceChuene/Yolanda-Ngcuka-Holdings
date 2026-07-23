import aboutOverview from '../assets/optimized/about-overview.webp'
import aboutOwnership from '../assets/optimized/about-ownership.webp'
import Waves from '../components/Waves'
import './About.css'

export default function AboutPage() {
  return (
    <main className="about about--page" id="about" data-nav-tone="light">
      <section className="about__band" aria-labelledby="about-banner">
        <Waves side="right" />
        <div className="about__band-inner">
          <header className="about__banner" data-reveal>
            <div className="about__banner-intro">
              <p className="about__eyebrow">About Us</p>
              <h1 className="about__banner-title" id="about-banner">
                Environmental consulting for responsible mining
              </h1>
            </div>
            <p className="about__banner-lede">
              Yolanda Ngcuka Holdings delivers practical
              environmental management and regulatory compliance from
              authorisation through rehabilitation and closure.
            </p>
          </header>
        </div>
      </section>

      <section className="about__overview" aria-labelledby="business-overview">
        <Waves />
        <div className="about__overview-inner">
          <div className="about__feature-media" data-reveal="left">
            <div className="about__feature-image-wrap">
              <img
                className="about__feature-image"
                src={aboutOverview}
                alt="Environmental consultant inspecting a water structure on site"
                width={506}
                height={900}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div
            className="about__feature-copy"
            data-reveal="right"
          >
            <p className="about__eyebrow">Who We Are</p>
            <h2 className="about__title" id="business-overview">
              Business Overview
            </h2>
            <div className="about__body">
              <p>
                Established in 2023, Yolanda Ngcuka Holdings (Pty) Ltd is a South
                African environmental consulting company specialising in
                environmental management and regulatory compliance services for
                the mining and related sectors. The company supports projects
                across environmental sector, from exploration and development
                through to rehabilitation and closure, ensuring alignment with
                applicable environmental legislatives and sustainable
                development.
              </p>
              <p>
                Yolanda Ngcuka Holdings (Pty) Ltd provides end-to-end
                environmental solutions, including the preparation and submission
                of Environmental Authorisation applications, WULA Application,
                environmental audits, compliance monitoring, and the development
                of rehabilitation and closure plans. The company applies a
                practical, risk-based approach to assist clients in meeting
                statutory requirements while supporting efficient and responsible
                project implementation.
              </p>
              <p>
                With extensive experience and a strong understanding of
                regulatory processes and stakeholder engagement, Yolanda Ngcuka
                Holdings (Pty) Ltd has established a reputation for technical
                competence, integrity, and reliability. The company is committed
                to promoting responsible mining practices, minimising
                environmental impacts, and supporting long-term environmental
                sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about__values" aria-label="Vision and Mission">
        <Waves side="right" />
        <div className="about__values-inner">
          <article className="about__value" data-reveal>
            <p className="about__eyebrow">Our Purpose</p>
            <h2 className="about__title about__title--sm">Vision</h2>
            <div className="about__body">
              <p>
                To be a trusted and leading environmental consulting firm,
                recognised for excellence in mine authorisation, environmental
                compliance, monitoring, and rehabilitation planning, while
                promoting responsible and sustainable mining practices across
                South Africa.
              </p>
            </div>
          </article>

          <article
            className="about__value"
            data-reveal
          >
            <p className="about__eyebrow">Our Commitment</p>
            <h2 className="about__title about__title--sm">Mission</h2>
            <div className="about__body">
              <p>
                To deliver credible, compliant, and practical environmental
                solutions that support mining and development projects throughout
                their lifecycle, by ensuring regulatory compliance, minimising
                environmental impacts, and contributing to long-term
                environmental sustainability and rehabilitation.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        className="about__overview about__overview--reverse"
        aria-labelledby="ownership"
      >
        <Waves />
        <div className="about__overview-inner">
          <div
            className="about__feature-copy"
            data-reveal="left"
          >
            <p className="about__eyebrow">Our Structure</p>
            <h2 className="about__title" id="ownership">
              Ownership
            </h2>
            <div className="about__body">
              <p>
                The company is proud to have 100%-woman ownership and 100% black
                owned. Yolanda Ngcuka Holdings comprises of a team of young
                professionals who are highly goal driven, results motivated, and
                skilled in different areas of the business. Although the owner is
                from previously disadvantaged background, believes that nothing
                will stop her to become a leader in the industry while setting
                social and financial emancipation to other young South Africans
                through empowerment and practicing good business etiquette.
              </p>
            </div>
          </div>
          <div
            className="about__feature-media"
            data-reveal="right"
          >
            <div className="about__feature-image-wrap">
              <img
                className="about__feature-image"
                src={aboutOwnership}
                alt="Environmental professional conducting field monitoring on site"
                width={675}
                height={900}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
