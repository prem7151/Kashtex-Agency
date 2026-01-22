import { Resend } from 'resend';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const client = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Kashtex <onboarding@resend.dev>';
    
    const safeName = escapeHtml(contact.name);
    const safeEmail = escapeHtml(contact.email);
    const safeSubject = escapeHtml(contact.subject);
    const safeMessage = escapeHtml(contact.message);
    
    await client.emails.send({
      from: fromEmail,
      to: ['kashtex1@gmail.com'],
      subject: `New Contact: ${contact.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${safeMessage}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This message was sent from the Kashtex website contact form.</p>
      `,
    });
    
    return true;
  } catch (error) {
    console.error("Failed to send contact notification:", error);
    return false;
  }
}

export async function sendAppointmentNotification(appointment: {
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  details?: string | null;
}) {
  try {
    const client = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Kashtex <onboarding@resend.dev>';
    
    const safeName = escapeHtml(appointment.name);
    const safeEmail = escapeHtml(appointment.email);
    const safeService = escapeHtml(appointment.service);
    const safeDate = escapeHtml(appointment.date);
    const safeTime = escapeHtml(appointment.time);
    const safeDetails = appointment.details ? escapeHtml(appointment.details) : null;
    
    await client.emails.send({
      from: fromEmail,
      to: ['kashtex1@gmail.com'],
      subject: `New Appointment: ${appointment.name} - ${appointment.service}`,
      html: `
        <h2>New Appointment Booked</h2>
        <p><strong>Client:</strong> ${safeName} (${safeEmail})</p>
        <p><strong>Service:</strong> ${safeService}</p>
        <p><strong>Date:</strong> ${safeDate}</p>
        <p><strong>Time:</strong> ${safeTime}</p>
        ${safeDetails ? `<h3>Additional Details:</h3><p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${safeDetails}</p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">This appointment was booked through the Kashtex website.</p>
      `,
    });
    
    return true;
  } catch (error) {
    console.error("Failed to send appointment notification:", error);
    return false;
  }
}
