import nodemailer from 'nodemailer'

// Configuração do transportador de email
// Pode usar Gmail, SendGrid, Resend, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para outros portos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export type EmailTemplate = 'confirmation' | 'reminder' | 'cancellation'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: from || process.env.EMAIL_FROM || '"AGENDAKI" <noreply@agendaki.com>',
      to,
      subject,
      html,
    })

    console.log('Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}

// Template de confirmação de agendamento
export function getConfirmationEmailHtml(data: {
  customerName: string
  businessName: string
  serviceName: string
  professionalName: string
  date: string
  time: string
  businessPhone: string
  businessAddress?: string
  cancellationLink?: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Agendamento Confirmado</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Agendamento Confirmado!</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Olá <strong>${data.customerName}</strong>,
                  </p>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Seu agendamento foi confirmado com sucesso! Aqui estão os detalhes:
                  </p>
                  
                  <!-- Appointment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 10px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">🏢 <strong>Local:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.businessName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">✂️ <strong>Serviço:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.serviceName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">👤 <strong>Profissional:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.professionalName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">📅 <strong>Data:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.date}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">🕐 <strong>Horário:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.time}</td>
                          </tr>
                          ${data.businessAddress ? `
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">📍 <strong>Endereço:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.businessAddress}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">📞 <strong>Contato:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.businessPhone}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Important Note -->
                  <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <p style="color: #856404; margin: 0; font-size: 14px;">
                      ⚠️ <strong>Importante:</strong> Por favor, chegue com 10 minutos de antecedência.
                    </p>
                  </div>
                  
                  ${data.cancellationLink ? `
                  <!-- Cancellation -->
                  <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                    Precisa cancelar? 
                    <a href="${data.cancellationLink}" style="color: #dc3545; text-decoration: underline;">Clique aqui</a>
                  </p>
                  ` : ''}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    Este é um email automático, por favor não responda.<br>
                    Em caso de dúvidas, entre em contato com ${data.businessName}.
                  </p>
                  <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                    Powered by <strong>AGENDAKI</strong>
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Template de lembrete (24h antes)
export function getReminderEmailHtml(data: {
  customerName: string
  businessName: string
  serviceName: string
  professionalName: string
  date: string
  time: string
  businessPhone: string
  hoursUntil: string | number
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lembrete de Agendamento</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">⏰ Lembrete de Agendamento</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Olá <strong>${data.customerName}</strong>,
                  </p>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Este é um lembrete do seu agendamento que acontecerá <strong>${data.hoursUntil}</strong>:
                  </p>
                  
                  <!-- Appointment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 10px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">🏢 <strong>Local:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.businessName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">✂️ <strong>Serviço:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.serviceName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">👤 <strong>Profissional:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.professionalName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">📅 <strong>Data:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.date}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">🕐 <strong>Horário:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.time}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">📞 <strong>Contato:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.businessPhone}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Important Note -->
                  <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <p style="color: #0c5460; margin: 0; font-size: 14px;">
                      💡 <strong>Dica:</strong> Chegue com 10 minutos de antecedência para evitar atrasos.
                    </p>
                  </div>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0; text-align: center;">
                    Nos vemos em breve! 👋
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    Este é um email automático, por favor não responda.<br>
                    Em caso de dúvidas, entre em contato com ${data.businessName}.
                  </p>
                  <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                    Powered by <strong>AGENDAKI</strong>
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Template de cancelamento
export function getCancellationEmailHtml(data: {
  customerName: string
  businessName: string
  serviceName: string
  date: string
  time: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Agendamento Cancelado</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">❌ Agendamento Cancelado</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Olá <strong>${data.customerName}</strong>,
                  </p>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Seu agendamento foi <strong>cancelado</strong>:
                  </p>
                  
                  <!-- Appointment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 10px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">🏢 <strong>Local:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.businessName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">✂️ <strong>Serviço:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.serviceName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">📅 <strong>Data:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.date}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0;">🕐 <strong>Horário:</strong></td>
                            <td style="color: #333; font-size: 14px; text-align: right; padding: 8px 0;">${data.time}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                    Se precisar agendar novamente, entre em contato com <strong>${data.businessName}</strong>.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    Este é um email automático, por favor não responda.
                  </p>
                  <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                    Powered by <strong>AGENDAKI</strong>
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
