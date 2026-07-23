import aboutTeam from '../assets/about.jpeg'
import aboutOverview from '../assets/about-overview.jpeg'
import aboutOwnership from '../assets/about-ownership.jpeg'
import founderAvatar from '../assets/1.1.jpeg'
import Waves from '../components/Waves'
import './About.css'

export default function AboutPage() {
  return (
    <main className="about about--page" id="about" data-nav-tone="light">
      <section className="about__band">
        <Waves side="right" />
        <div className="about__section">
          <div className="about__media" data-reveal="left">
            <div className="about__image-wrap">
              <img
                className="about__image"
                src={aboutTeam}
                alt="Team collaborating around a table in a modern workspace"
              />
            </div>

            <aside
              className="about__quote"
              data-reveal
            >
              <div className="about__quote-head">
                <img
                  className="about__avatar"
                  src={founderAvatar}
                  alt=""
                  width={48}
                  height={48}
                />
                <p className="about__attribution">
                  <span className="about__name">Yolanda Ngcuka</span>
                  <span className="about__role">, Managing Director.</span>
                </p>
              </div>
              <p className="about__quote-text">
                <span className="about__marks" aria-hidden="true">
                  ”
                </span>
                "We are committed to providing the highest quality environmental services to our clients, ensuring that they are compliant with all relevant regulations and standards."
              </p>
            </aside>
          </div>

          <div
            className="about__copy"
            data-reveal="right"
          >
            <p className="about__eyebrow">About Company</p>
            <h1 className="about__title">
              Environmental Excellence, Rooted in Integrity
            </h1>
            <div className="about__body">
              <p>
                Established in 2023, Yolanda Ngcuka Holdings (Pty) Ltd is a 100%
                black-woman-owned environmental consulting firm specialising in
                environmental management and regulatory compliance for the mining
                sector.
              </p>
              <p>
                We support projects across the full mining lifecycle—from
                exploration and feasibility through to operations,
                rehabilitation, and closure. Our team combines deep technical
                expertise with an unwavering commitment to sustainable
                development and legal compliance.
              </p>
              <p>
                Headquartered in Newcastle, KwaZulu-Natal, we serve mining
                operations across South Africa, providing the scientific rigour
                and regulatory knowledge that responsible mining demands.
              </p>
            </div>
          </div>
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
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
