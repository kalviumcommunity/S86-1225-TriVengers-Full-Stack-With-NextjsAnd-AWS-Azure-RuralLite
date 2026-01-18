import { sendSuccess, sendError } from "@/lib/responseHandler";
import { sendEmail } from "@/lib/email";
import { welcomeTemplate } from "@/lib/emailTemplates";
export async function POST(req) {
  try {
    const body = await req.json();
    const { to, subject, html, type, data } = body || {};
    if (!to) return sendError("Missing 'to' field", "VALIDATION_ERROR", 400);
    let htmlContent = html;
    if (!htmlContent && type === "welcome") {
      htmlContent = welcomeTemplate(data?.userName || "");
    }
    if (!htmlContent)
      return sendError(
        "Missing 'html' content or unsupported 'type'",
        "VALIDATION_ERROR",
        400
      );
    const res = await sendEmail({
      to,
      subject: subject || "No subject",
      html: htmlContent,
    });
    return sendSuccess(
      {
        provider: res.provider || null,
        messageId: res.messageId || null,
        headers: res.headers || null,
      },
      "Email queued/sent",
      200
    );
  } catch (err) {
    console.error("Email send failed:", err);
    return sendError(
      err.message || "Failed to send email",
      "INTERNAL_ERROR",
      500,
      err.stack
    );
  }
}
