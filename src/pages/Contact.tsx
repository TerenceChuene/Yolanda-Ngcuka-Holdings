import { useState, type FormEvent } from 'react'
import './Contact.css'

const subjects = [
  'Mine Authorisation Services',
  'Environmental Audits & Compliance',
  'Environmental Monitoring',
  'Rehabilitation & Closure Planning',
  'General Enquiry',
]

const plane = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M2 8.2L14 2.5 10.2 14l-2.1-4.2L2 8.2z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
)

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="contact" id="contact">
     
     
      <section className="contact__section">
      <header className="services__header">
      <div className="services__intro">
            <p className="services__eyebrow">Our Services</p>
            <h1 className="services__title">
              We Provide The Best Service For Consulting
            </h1>
          </div>
          </header>
        <div className="contact-card">
          
          <div className="contact-card__info">
            <div className="contact-card__office">
              <h2 className="contact-card__office-title">Our Office</h2>
              <ul className="contact-card__details">
                <li>
                  <span className="contact-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="2.4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="contact-card__label">Location</p>
                    <p className="contact-card__value">South Africa</p>
                  </div>
                </li>
                <li>
                  <span className="contact-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3.5"
                        y="5.5"
                        width="17"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M4 7l8 6 8-6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="contact-card__label">Email</p>
                    <a
                      className="contact-card__value contact-card__link"
                      href="mailto:yolandangcukaholdings@gmail.com"
                    >
                      yolandangcukaholdings@gmail.com
                    </a>
                  </div>
                </li>
                <li>
                  <span className="contact-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.5 4.5h3l1.2 3.2-1.8 1.2a11 11 0 0 0 5.2 5.2l1.2-1.8 3.2 1.2v3a1.5 1.5 0 0 1-1.6 1.5A14.5 14.5 0 0 1 4.5 6.1a1.5 1.5 0 0 1 1.5-1.6h1.5z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="contact-card__label">Phone</p>
                    <a
                      className="contact-card__value contact-card__link"
                      href="tel:+27673675219"
                    >
                      067 367 5219
                    </a>
                  </div>
                </li>
              </ul>

              <div className="contact-card__hours">
                <h3>Business Hours</h3>
                <div className="contact-card__hours-row">
                  <span>Monday – Friday</span>
                  <strong>08:00 – 17:00</strong>
                </div>
                <div className="contact-card__hours-row">
                  <span>Saturday – Sunday</span>
                  <em>Closed</em>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-card__form" onSubmit={handleSubmit}>
            <label className="contact-field">
              <span>
                Full Name <em>*</em>
              </span>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                required
              />
            </label>

            <label className="contact-field">
              <span>
                Email Address <em>*</em>
              </span>
              <input
                type="email"
                name="email"
                placeholder="you@company.co.za"
                required
              />
            </label>

            <label className="contact-field">
              <span>Phone Number</span>
              <input
                type="tel"
                name="phone"
                placeholder="067 000 0000"
              />
            </label>

            <label className="contact-field">
              <span>
                Subject <em>*</em>
              </span>
              <select name="subject" required defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="contact-field">
              <span>
                Message <em>*</em>
              </span>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us about your project or enquiry..."
                required
              />
            </label>

            <div className="contact-card__form-footer">
              <p className="contact-card__required">* Required fields</p>
              <button type="submit" className="contact-card__submit">
                Send Message
                {plane}
              </button>
            </div>

            {submitted ? (
              <p className="contact-card__success" role="status">
                Thanks — your message is ready to send. We&apos;ll respond within
                24 hours.
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  )
}
