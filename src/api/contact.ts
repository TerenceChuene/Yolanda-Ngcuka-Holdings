import emailjs from '@emailjs/browser'

export type ContactPayload = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

/** Inbox that receives contact form submissions (set as To Email in the EmailJS template). */
export const CONTACT_TO_EMAIL = 'madimetjaterencechuene@gmail.com'

function assertEmailJsConfig(): void {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      'Contact form is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.',
    )
  }
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  assertEmailJsConfig()

  const name = payload.name.trim()
  const email = payload.email.trim()
  const phone = (payload.phone ?? '').trim()
  const subject = payload.subject.trim()
  const message = payload.message.trim()

  if (!name || !email || !subject || !message) {
    throw new Error('Please fill in all required fields.')
  }

  try {
    await emailjs.send(
      SERVICE_ID!,
      TEMPLATE_ID!,
      {
        from_name: name,
        from_email: email,
        phone: phone || 'Not provided',
        subject,
        message,
        reply_to: email,
        to_email: CONTACT_TO_EMAIL,
      },
      { publicKey: PUBLIC_KEY! },
    )
  } catch (err) {
    const text =
      err && typeof err === 'object' && 'text' in err
        ? String((err as { text: unknown }).text)
        : null
    throw new Error(
      text || 'Failed to send your message. Please try again.',
    )
  }
}
