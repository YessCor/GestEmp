const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

if (!process.env.BREVO_API_KEY) console.warn("⚠️ BREVO_API_KEY no está configurada en el .env")
if (!process.env.BREVO_SENDER_EMAIL) console.warn("⚠️ BREVO_SENDER_EMAIL no está configurada en el .env")

const SENDER = {
  email: process.env.BREVO_SENDER_EMAIL || "",
  name: process.env.BREVO_SENDER_NAME ?? "GestEmp",
}

async function sendEmail({ to, subject, htmlContent }: { to: { email: string; name: string }[]; subject: string; htmlContent: string }) {
  console.log(`[Brevo] Intentando enviar email a: ${to[0].email} con asunto: "${subject}"`)
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: SENDER,
        to,
        subject,
        htmlContent,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[Brevo Error Detallado]:", JSON.stringify(errorData, null, 2))
      throw new Error(errorData.message || "Error al enviar el email")
    }

    console.log("[Brevo] Email enviado exitosamente ✅")
    return { success: true }
  } catch (err) {
    console.error("[Brevo Error]:", err)
    return { error: err instanceof Error ? err.message : "Error desconocido" }
  }
}

// ────────────────────────────────────────────────────────────
// Email: Solicitud recibida (para el usuario que se registró)
// ────────────────────────────────────────────────────────────
export async function sendRequestReceivedEmail(to: string, fullName: string) {
  return sendEmail({
    to: [{ email: to, name: fullName }],
    subject: "Tu solicitud de registro en GestEmp fue recibida",
    htmlContent: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:36px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">GestEmp</h1>
                <p style="margin:8px 0 0;color:#a0aec0;font-size:13px;">Sistema de Gestión Empresarial</p>
              </td></tr>
              <!-- Body -->
              <tr><td style="padding:40px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <div style="width:64px;height:64px;background:#fef3c7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;line-height:64px;">
                    <span style="font-size:28px;">⏳</span>
                  </div>
                  <h2 style="margin:0;color:#1a1a2e;font-size:22px;font-weight:700;">Solicitud Recibida</h2>
                </div>
                <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 20px;">Hola <strong>${fullName}</strong>,</p>
                <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 20px;">
                  Hemos recibido tu solicitud para registrar tu empresa en <strong>GestEmp</strong>. 
                  Nuestro equipo de administración la revisará en las próximas <strong>24 horas hábiles</strong>.
                </p>
                <div style="background:#f8fafc;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;margin:24px 0;">
                  <p style="margin:0;color:#92400e;font-size:14px;font-weight:600;">¿Qué sigue?</p>
                  <p style="margin:8px 0 0;color:#78350f;font-size:14px;line-height:1.6;">
                    Si tu solicitud es aprobada, recibirás otro correo con un enlace para configurar tu contraseña y acceder a tu cuenta.
                  </p>
                </div>
              </td></tr>
              <!-- Footer -->
              <tr><td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#a0aec0;font-size:12px;">© 2024 GestEmp — Sistema de Gestión Empresarial</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  })
}

// ────────────────────────────────────────────────────────────
// Email: Solicitud aprobada (para el usuario)
// ────────────────────────────────────────────────────────────
export async function sendRequestApprovedEmail(
  to: string,
  fullName: string,
  companyName: string,
  loginUrl: string
) {
  return sendEmail({
    to: [{ email: to, name: fullName }],
    subject: "🎉 Tu cuenta en GestEmp ha sido aprobada",
    htmlContent: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:36px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">GestEmp</h1>
                <p style="margin:8px 0 0;color:#a0aec0;font-size:13px;">Sistema de Gestión Empresarial</p>
              </td></tr>
              <!-- Body -->
              <tr><td style="padding:40px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <div style="width:64px;height:64px;background:#d1fae5;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;line-height:64px;">
                    <span style="font-size:28px;">✅</span>
                  </div>
                  <h2 style="margin:0;color:#1a1a2e;font-size:22px;font-weight:700;">¡Solicitud Aprobada!</h2>
                </div>
                <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 20px;">Hola <strong>${fullName}</strong>,</p>
                <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 20px;">
                  Nos complace informarte que tu solicitud para registrar <strong>${companyName}</strong> en GestEmp ha sido 
                  <strong style="color:#059669;">aprobada</strong>.
                </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#1a1a2e,#2d3748);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;">
                  Establecer Contraseña →
                </a>
              </div>
              </td></tr>
              <!-- Footer -->
              <tr><td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#a0aec0;font-size:12px;">© 2024 GestEmp — Sistema de Gestión Empresarial</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  })
}

// ────────────────────────────────────────────────────────────
// Email: Solicitud rechazada (para el usuario)
// ────────────────────────────────────────────────────────────
export async function sendRequestRejectedEmail(
  to: string,
  fullName: string,
  reason?: string
) {
  return sendEmail({
    to: [{ email: to, name: fullName }],
    subject: "Actualización sobre tu solicitud en GestEmp",
    htmlContent: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:36px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">GestEmp</h1>
              </td></tr>
              <tr><td style="padding:40px;">
                <h2 style="margin:0;color:#1a1a2e;font-size:22px;font-weight:700;text-align:center;">Solicitud No Aprobada</h2>
                <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:20px 0;">Hola <strong>${fullName}</strong>,</p>
                <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 20px;">
                  Lamentamos informarte que tu solicitud de registro en GestEmp no fue aprobada en esta ocasión.
                </p>
                ${
                  reason
                    ? `<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;margin:24px 0;">
                        <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;">Motivo:</p>
                        <p style="margin:8px 0 0;color:#b91c1c;font-size:14px;">${reason}</p>
                      </div>`
                    : ""
                }
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  })
}

// ────────────────────────────────────────────────────────────
// Email: Notificación al superadmin de nueva solicitud
// ────────────────────────────────────────────────────────────
export async function sendNewRequestNotificationEmail(
  adminEmail: string,
  requesterName: string,
  requesterEmail: string,
  companyName: string,
  companyRuc: string,
  dashboardUrl: string
) {
  return sendEmail({
    to: [{ email: adminEmail, name: "Superadmin GestEmp" }],
    subject: `🔔 Nueva solicitud de registro: ${companyName}`,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr><td align="center">
            <table width="560" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <tr style="background:#1a1a2e;color:#ffffff;text-align:center;padding:30px;">
                <td><h1 style="margin:20px;">Nueva Solicitud</h1></td>
              </tr>
              <tr style="padding:30px;">
                <td style="padding:30px;">
                  <p><strong>Solicitante:</strong> ${requesterName}</p>
                  <p><strong>Email:</strong> ${requesterEmail}</p>
                  <p><strong>Empresa:</strong> ${companyName}</p>
                  <p><strong>RUC:</strong> ${companyRuc}</p>
                  <div style="text-align:center;margin-top:30px;">
                    <a href="${dashboardUrl}" style="background:#1a1a2e;color:#ffffff;padding:12px 25px;text-decoration:none;border-radius:6px;">Revisar Solicitud</a>
                  </div>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  })
}
