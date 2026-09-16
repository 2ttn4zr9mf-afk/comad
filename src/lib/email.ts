import { Resend } from "resend";

function paymentEmailHtml(nombre: string) {
  const bizum = process.env.BIZUM_NUMERO || "600000000";
  const paypalLink = process.env.PAYPAL_LINK || "https://paypal.me/tu-usuario";

  return `
  <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
    <h2>¡Gracias por tu inscripción, ${nombre}!</h2>
    <p>Hemos recibido tus datos correctamente. Para completar tu inscripción, puedes pagar por cualquiera de estos dos métodos:</p>

    <div style="background:#f3f4f6; border-radius:8px; padding:16px; margin:16px 0;">
      <h3 style="margin-top:0;">1. Bizum</h3>
      <p>Envía tu Bizum al número: <strong style="font-size:18px;">${bizum}</strong></p>
    </div>

    <div style="background:#f3f4f6; border-radius:8px; padding:16px; margin:16px 0;">
      <h3 style="margin-top:0;">2. PayPal</h3>
      <p>Puedes pagar directamente a través de este enlace:</p>
      <a href="${paypalLink}" style="display:inline-block; background:#2563eb; color:#fff; padding:10px 18px; border-radius:6px; text-decoration:none;">Pagar con PayPal</a>
    </div>

    <p style="margin-top:24px; font-size:14px; color:#6b7280;">Si tienes cualquier duda, responde a este correo.</p>
  </div>
  `;
}

export async function sendPaymentEmail(to: string, nombre: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY no configurada, no se envía email.");
    return { skipped: true };
  }

  const resend = new Resend(apiKey);

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Inscripciones <onboarding@resend.dev>",
    to,
    subject: "Inscripción recibida - Métodos de pago",
    html: paymentEmailHtml(nombre),
  });
}
