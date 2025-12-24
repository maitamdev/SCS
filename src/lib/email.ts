// Email service using Resend API
// For production, you'll need to set up a backend API to send emails securely
// This is a client-side helper that calls your backend API

const API_URL = import.meta.env.VITE_API_URL || '';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

interface BookingEmailData {
  userEmail: string;
  userName: string;
  stationName: string;
  stationAddress: string;
  chargerName: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  totalAmount: number;
  bookingCode: string;
}

interface WelcomeEmailData {
  userEmail: string;
  userName: string;
}

// Email templates
export const emailTemplates = {
  welcome: (data: WelcomeEmailData) => ({
    subject: '🎉 Chào mừng bạn đến với SCS GO!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SCS GO</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Smart EV Charging</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Xin chào ${data.userName}! 👋</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Cảm ơn bạn đã đăng ký tài khoản SCS GO. Chúng tôi rất vui được đồng hành cùng bạn trên hành trình sạc xe điện thông minh!
            </p>
            
            <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #166534; margin: 0 0 15px 0;">🚀 Bắt đầu ngay:</h3>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Tìm trạm sạc gần bạn với AI gợi ý thông minh</li>
                <li>Đặt chỗ trước để không phải chờ đợi</li>
                <li>Theo dõi lịch sử sạc và chi phí</li>
                <li>Nhận thông báo khi có khuyến mãi</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://scs-go.vercel.app/explore" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Khám phá trạm sạc
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email support@scsgo.vn
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 30px; text-align: center;">
            <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
              © 2024 SCS GO. All rights reserved.
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              Bạn nhận được email này vì đã đăng ký tài khoản tại SCS GO.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  bookingConfirmation: (data: BookingEmailData) => ({
    subject: `✅ Xác nhận đặt chỗ #${data.bookingCode} - ${data.stationName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SCS GO</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Xác nhận đặt chỗ</p>
          </div>
          
          <!-- Success Badge -->
          <div style="text-align: center; padding: 30px 20px 0 20px;">
            <div style="display: inline-block; background-color: #dcfce7; border-radius: 50%; padding: 20px;">
              <span style="font-size: 40px;">✅</span>
            </div>
            <h2 style="color: #166534; margin: 20px 0 10px 0;">Đặt chỗ thành công!</h2>
            <p style="color: #4b5563; margin: 0;">Mã đặt chỗ: <strong style="color: #10b981;">#${data.bookingCode}</strong></p>
          </div>
          
          <!-- Booking Details -->
          <div style="padding: 30px;">
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">📍 Thông tin trạm sạc</h3>
              <p style="color: #1f2937; margin: 0 0 5px 0; font-weight: 600;">${data.stationName}</p>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">${data.stationAddress}</p>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
              <div style="flex: 1; background-color: #f0fdf4; border-radius: 12px; padding: 15px; text-align: center;">
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 12px;">Ngày</p>
                <p style="color: #1f2937; margin: 0; font-weight: 600;">${data.bookingDate}</p>
              </div>
              <div style="flex: 1; background-color: #f0fdf4; border-radius: 12px; padding: 15px; text-align: center;">
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 12px;">Giờ</p>
                <p style="color: #1f2937; margin: 0; font-weight: 600;">${data.bookingTime}</p>
              </div>
              <div style="flex: 1; background-color: #f0fdf4; border-radius: 12px; padding: 15px; text-align: center;">
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 12px;">Thời lượng</p>
                <p style="color: #1f2937; margin: 0; font-weight: 600;">${data.duration} phút</p>
              </div>
            </div>
            
            <div style="background-color: #fef3c7; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⚡ <strong>Cổng sạc:</strong> ${data.chargerName}
              </p>
            </div>
            
            <div style="border-top: 2px dashed #e5e7eb; padding-top: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6b7280;">Tổng thanh toán:</span>
                <span style="color: #10b981; font-size: 24px; font-weight: 700;">${data.totalAmount.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
          
          <!-- QR Code placeholder -->
          <div style="text-align: center; padding: 0 30px 30px 30px;">
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Quét mã QR tại trạm để check-in</p>
              <div style="background-color: #ffffff; display: inline-block; padding: 15px; border-radius: 8px;">
                <div style="width: 120px; height: 120px; background-color: #e5e7eb; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #9ca3af; font-size: 12px;">QR Code</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Important Notes -->
          <div style="padding: 0 30px 30px 30px;">
            <div style="background-color: #fef2f2; border-radius: 12px; padding: 15px;">
              <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 14px;">⚠️ Lưu ý quan trọng:</h4>
              <ul style="color: #7f1d1d; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
                <li>Vui lòng đến trạm trước giờ hẹn 5-10 phút</li>
                <li>Nếu không check-in trong 15 phút, đặt chỗ sẽ tự động hủy</li>
                <li>Hủy miễn phí trước 30 phút</li>
              </ul>
            </div>
          </div>
          
          <!-- CTA -->
          <div style="text-align: center; padding: 0 30px 30px 30px;">
            <a href="https://scs-go.vercel.app/dashboard/bookings" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
              Xem chi tiết đặt chỗ
            </a>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 30px; text-align: center;">
            <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
              © 2024 SCS GO. All rights reserved.
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              Cần hỗ trợ? Liên hệ support@scsgo.vn hoặc hotline 1900-xxxx
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  bookingCancelled: (data: BookingEmailData) => ({
    subject: `❌ Đặt chỗ #${data.bookingCode} đã bị hủy`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SCS GO</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thông báo hủy đặt chỗ</p>
          </div>
          
          <div style="text-align: center; padding: 30px 20px;">
            <div style="display: inline-block; background-color: #fee2e2; border-radius: 50%; padding: 20px;">
              <span style="font-size: 40px;">❌</span>
            </div>
            <h2 style="color: #991b1b; margin: 20px 0 10px 0;">Đặt chỗ đã bị hủy</h2>
            <p style="color: #4b5563; margin: 0;">Mã đặt chỗ: <strong>#${data.bookingCode}</strong></p>
          </div>
          
          <div style="padding: 0 30px 30px 30px;">
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
              <p style="color: #1f2937; margin: 0 0 5px 0;"><strong>${data.stationName}</strong></p>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">${data.bookingDate} - ${data.bookingTime}</p>
            </div>
            
            <p style="color: #4b5563; margin: 20px 0; line-height: 1.6;">
              Nếu bạn đã thanh toán, số tiền sẽ được hoàn lại trong vòng 3-5 ngày làm việc.
            </p>
            
            <div style="text-align: center;">
              <a href="https://scs-go.vercel.app/explore" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Đặt chỗ mới
              </a>
            </div>
          </div>
          
          <div style="background-color: #1f2937; padding: 30px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">© 2024 SCS GO. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  loginNotification: (data: { userName: string; loginTime: string; device: string; location: string }) => ({
    subject: '🔐 Đăng nhập mới vào tài khoản SCS GO',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SCS GO</h1>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Xin chào ${data.userName},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Chúng tôi phát hiện một lần đăng nhập mới vào tài khoản của bạn:
            </p>
            
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>🕐 Thời gian:</strong> ${data.loginTime}</p>
              <p style="margin: 0 0 10px 0;"><strong>📱 Thiết bị:</strong> ${data.device}</p>
              <p style="margin: 0;"><strong>📍 Vị trí:</strong> ${data.location}</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Nếu đây là bạn, bạn có thể bỏ qua email này. Nếu không phải, vui lòng đổi mật khẩu ngay lập tức.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://scs-go.vercel.app/dashboard/settings" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Đổi mật khẩu
              </a>
            </div>
          </div>
          
          <div style="background-color: #1f2937; padding: 30px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">© 2024 SCS GO. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function (calls backend API)
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  // In development, just log the email
  if (!API_URL) {
    console.log('📧 Email would be sent:', {
      to: data.to,
      subject: data.subject,
    });
    return { success: true };
  }

  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Helper functions
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const template = emailTemplates.welcome(data);
  return sendEmail({
    to: data.userEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const template = emailTemplates.bookingConfirmation(data);
  return sendEmail({
    to: data.userEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendBookingCancelledEmail(data: BookingEmailData) {
  const template = emailTemplates.bookingCancelled(data);
  return sendEmail({
    to: data.userEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendLoginNotificationEmail(
  userEmail: string,
  data: { userName: string; loginTime: string; device: string; location: string }
) {
  const template = emailTemplates.loginNotification(data);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
  });
}
