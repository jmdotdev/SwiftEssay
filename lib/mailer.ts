export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com'
  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })

    return transporter.sendMail({ from, to, subject, text, html })
  } catch (err) {
    console.warn('sendMail: nodemailer not available or failed, falling back to console.log')
    console.log('EMAIL FALLBACK:', { to, subject, text, html })
    return Promise.resolve({ accepted: [to] })
  }
}

export default sendMail
