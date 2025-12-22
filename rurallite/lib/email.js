import sendgrid from "@sendgrid/mail";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const providers = {
  SENDGRID: "sendgrid",
  SES: "ses",
};

function detectProvider() {
  const envProvider = (process.env.EMAIL_PROVIDER || "").toLowerCase();
  if (envProvider === providers.SENDGRID) return providers.SENDGRID;
  if (envProvider === providers.SES) return providers.SES;
  if (process.env.SENDGRID_API_KEY) return providers.SENDGRID;
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return providers.SES;
  return null;
}

let sesClient;
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  sesClient = new SESClient({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to || !subject || !html) {
    throw new Error("Missing required fields: to, subject, html");
  }

  const provider = detectProvider();
  if (!provider) throw new Error("No email provider configured (set SENDGRID_API_KEY or AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY)");

  if (provider === providers.SENDGRID) {
    if (!process.env.SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not set");
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: process.env.SENDGRID_SENDER || process.env.SES_EMAIL_SENDER,
      subject,
      html,
      text,
    };

    const response = await sendgrid.send(msg);
    // response is an array; headers live on response[0].headers
    const headers = response?.[0]?.headers || null;
    console.info("Email sent via SendGrid", { to, subject, headers });
    return { provider: providers.SENDGRID, headers };
  }

  if (provider === providers.SES) {
    if (!sesClient) throw new Error("SES is not configured properly (missing credentials)");
    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: html }, Text: text ? { Charset: "UTF-8", Data: text } : undefined },
        Subject: { Charset: "UTF-8", Data: subject },
      },
      Source: process.env.SES_EMAIL_SENDER,
    };

    const res = await sesClient.send(new SendEmailCommand(params));
    console.info("Email sent via SES", { to, subject, messageId: res?.MessageId });
    return { provider: providers.SES, messageId: res?.MessageId };
  }

  throw new Error("Unsupported email provider");
}
