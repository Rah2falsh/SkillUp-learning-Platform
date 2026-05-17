// ✅ src/emailService.js
// استخدام Resend لإرسال البريد الإلكتروني

export async function sendVerificationCode(to_email, to_name, code) {
    const apiKey = "re_gcPed9RW_L5ozQgSfN5La9tQWMccSqf1Y"; // ✅ المفتاح الخاص بك من Resend
  
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "SkillUp <onboarding@resend.dev>", // يفضل تغييره لاحقًا لإيميل شركتك
          to: [to_email],
          subject: "Your SkillUp Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; padding:20px;">
              <h2 style="color:#325443;">Hello ${to_name},</h2>
              <p>Your verification code is:</p>
              <h1 style="font-size:32px; letter-spacing:4px; color:#325443;">${code}</h1>
              <p>Enter this code in the platform to continue.</p>
              <br>
              <p style="color:#888;">If you didn't request this, please ignore.</p>
            </div>
          `,
        }),
      });
  
      if (response.ok) {
        console.log("Email sent successfully");
        return { success: true };
      } else {
        console.error("Resend error:", await response.json());
        return { success: false };
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false };
    }
  }