export const welcomeTemplate = (userName, appUrl = 'https://app.kalvium.community') => `
  <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111;">
    <h2>Welcome to Kalvium, ${userName}!</h2>
    <p>We’re thrilled to have you onboard 🎉</p>
    <p>Start exploring your dashboard at <a href="${appUrl}">${appUrl}</a>.</p>
    <hr/>
    <small>This is an automated email. Please do not reply.</small>
  </div>
`;

export const passwordResetTemplate = (resetLink) => `
  <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111;">
    <h3>Password reset</h3>
    <p>Click the link below to reset your password:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <small>If you did not request this, please ignore this email.</small>
  </div>
`;
