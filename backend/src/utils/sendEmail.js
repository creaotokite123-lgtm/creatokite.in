const { Resend } = require('resend');

const getResendClient = () => {
  const key = (process.env.RESEND_API_KEY || '').trim();
  if (key) {
    return new Resend(key);
  }
  return null;
};

const CLIENT = (process.env.CLIENT_URL || 'https://www.creatokite.in').replace(/\/+$/, '');

const send = async (to, subject, html) => {
  const resendClient = getResendClient();
  const fromResend   = (process.env.RESEND_FROM_EMAIL || '').trim() || 'CreatoKite <onboarding@resend.dev>';
  
  if (resendClient) {
    try {
      const response = await resendClient.emails.send({
        from: fromResend,
        to,
        subject,
        html,
      });
      if (response.error) {
        console.error('❌ [Resend Error]:', response.error.message || response.error);
        return false;
      }
      console.log(`✅ [Resend Email SENT] ${subject} → ${to} (ID: ${response.data?.id || response.id})`);
      return true;
    } catch (e) {
      console.error('❌ [Resend Exception Error]:', e.message);
      return false;
    }
  }

  // Fallback: Log in local dev mode when RESEND_API_KEY is not provided
  console.log(`\n==================================================`);
  console.log(`⚠️ [EMAIL LOG - LOCAL DEV MODE]`);
  console.log(`Subject: ${subject}`);
  console.log(`To: ${to}`);
  console.log(`To enable live emails, set RESEND_API_KEY in backend/.env`);
  console.log(`==================================================\n`);
  return false;
};

/* ── Modern Premium Email Base Template ─────────────────────────────── */
const base = (content, title, badge = 'CREATOKITE SECURITY') => {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@1,500;1,600;1,700&family=Inter:wght@400;600;700;800;900&display=swap" />
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: auto !important; border-radius: 0 !important; }
      .email-content { padding: 24px 20px !important; }
      .otp-digit { width: 38px !important; height: 48px !important; font-size: 22px !important; margin: 0 3px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0D13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B0D13; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="email-container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #121622; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);">
          
          <!-- Top Brand Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #E55B2B 0%, #FF7043 50%, #F5A623 100%); padding: 30px 24px 24px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <!-- CreatoKite Official Brand Wordmark Badge -->
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 10px;">
                      <tr>
                        <td align="center" style="background: rgba(18, 22, 34, 0.75); padding: 8px 26px; border-radius: 9999px; border: 1px solid rgba(255, 255, 255, 0.28); box-shadow: 0 6px 18px rgba(0,0,0,0.25);">
                          <span style="color: #FFFFFF; font-size: 24px; font-weight: 900; letter-spacing: -0.04em; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; vertical-align: middle;">Creato</span><span style="color: #FF7043; font-size: 27px; font-weight: 700; font-style: italic; font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; vertical-align: middle; margin-left: 1px;">Kite</span>
                        </td>
                      </tr>
                    </table>
                    <div style="color: rgba(255, 255, 255, 0.95); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
                      The AI Creator Collaboration Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inner Body Content -->
          <tr>
            <td class="email-content" style="padding: 36px 32px 30px; background-color: #121622;">
              ${badge ? `
              <div style="display: inline-block; background: rgba(229, 91, 43, 0.12); border: 1px solid rgba(229, 91, 43, 0.3); border-radius: 6px; padding: 4px 10px; margin-bottom: 18px;">
                <span style="color: #FF7043; font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">${badge}</span>
              </div>` : ''}
              ${content}
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="background-color: #0D1018; padding: 22px 32px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="color: #717B94; font-size: 11.5px; line-height: 1.6; margin: 0 0 10px;">
                © ${currentYear} <strong>CreatoKite</strong> · All rights reserved.<br>
                Connecting verified creators and high-growth brands with AI precision.
              </p>
              <div style="font-size: 11px; margin-top: 6px;">
                <a href="${CLIENT}" style="color: #FF7043; text-decoration: none; font-weight: 600; margin: 0 8px;">Visit Platform</a>
                <span style="color: #374151;">•</span>
                <a href="${CLIENT}/privacy" style="color: #8B95A5; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                <span style="color: #374151;">•</span>
                <a href="${CLIENT}/security" style="color: #8B95A5; text-decoration: none; margin: 0 8px;">Security</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const h2 = t => `<h2 style="color: #FFFFFF; margin: 0 0 12px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25;">${t}</h2>`;
const p  = t => `<p style="color: #9AA4B8; font-size: 14px; line-height: 1.65; margin: 0 0 16px;">${t}</p>`;
const btn = (url, label) => `
<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 26px 0 18px;">
  <tr>
    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #E55B2B 0%, #FF7043 100%); box-shadow: 0 8px 20px rgba(229, 91, 43, 0.35);">
      <a href="${url}" target="_blank" style="font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; padding: 14px 28px; display: inline-block; border-radius: 12px; letter-spacing: 0.02em;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;

const pill = (label, color='#E55B2B') => `<span style="background:${color}18;color:${color};border:1px solid ${color}40;border-radius:99px;padding:4px 12px;font-size:12px;font-weight:700;">${label}</span>`;

/* ── Code Display Builder ─────────────────────────────────────────── */
const renderOtpDisplay = (otpCode) => {
  const digits = String(otpCode || '').split('');
  return `
  <!-- OTP Code High-Contrast Cards -->
  <div style="background: #181E2B; border: 1px solid rgba(229, 91, 43, 0.35); border-radius: 16px; padding: 24px 18px; text-align: center; margin: 24px 0 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.3), 0 10px 25px rgba(229, 91, 43, 0.12);">
    <div style="color: #8B95A5; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px;">
      One-Time Verification Code
    </div>
    
    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
      <tr>
        ${digits.map(d => `
          <td style="padding: 0 4px;">
            <div class="otp-digit" style="width: 44px; height: 56px; line-height: 56px; background: #0E121A; border: 1.5px solid rgba(229, 91, 43, 0.45); border-radius: 10px; font-size: 26px; font-weight: 900; color: #FF7043; font-family: 'SF Mono', Monaco, Consolas, monospace; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
              ${d}
            </div>
          </td>
        `).join('')}
      </tr>
    </table>

    <div style="margin-top: 16px; font-size: 12px; color: #8B95A5; text-align: center;">
      <span>⏱ Code expires in <strong style="color: #E2E8F0;">10 minutes</strong></span>
    </div>
  </div>

  <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; text-align: left;">
    <p style="margin: 0; font-size: 12px; color: #7E899D; line-height: 1.5;">
      🔒 <strong>Security Tip:</strong> CreatoKite employees will never ask for your verification code. Never share this code with anyone.
    </p>
  </div>`;
};

/* ── Email functions ─────────────────────────────── */
exports.sendVerificationMail = (to, name, token) => send(
  to,
  'Confirm Your Email Address — CreatoKite',
  base(
    `${h2(`Verify Your Email Address`)}
     ${p(`Hi ${name || 'there'}, thank you for joining CreatoKite!`)}
     ${p('Please click the button below to confirm your email address and activate full access to your campaign workspace.')}
     ${btn(`${CLIENT}/verify-email?token=${token}`, 'Verify Email Address →')}
     ${p('If the button above does not work, copy and paste the following link into your web browser:')}
     <div style="background: #0E121A; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px;">
       <p style="color: #FF7043; font-size: 11.5px; word-break: break-all; margin: 0; font-family: monospace;">${CLIENT}/verify-email?token=${token}</p>
     </div>
     ${p('This link will expire in 24 hours. If you did not create a CreatoKite account, please safely ignore this message.')}`,
    'Verify Email',
    'EMAIL VERIFICATION'
  )
);

exports.sendLoginMail = (to) => send(
  to,
  '🔐 Login Alert — CreatoKite',
  base(
    `${h2('New Login Detected')}
     ${p('A new login to your CreatoKite account was detected. If this was you, no action is needed.')}
     ${btn(CLIENT, 'Go to Dashboard →')}`,
    'Login Alert',
    'SECURITY NOTIFICATION'
  )
);

exports.sendWelcomeMail = (to, name, role) => send(
  to,
  `🎉 Welcome to CreatoKite, ${name}!`,
  base(
    `${h2(`Welcome to CreatoKite, ${name}! 🎉`)}
     ${p(`You've successfully joined as a <strong style="color: #FF7043; text-transform: capitalize;">${role}</strong>. Your account workspace is now active and ready.`)}
     ${btn(`${CLIENT}/${role}/dashboard`, 'Launch Workspace →')}`,
    'Welcome',
    'WELCOME TO CREATOKITE'
  )
);

exports.sendCreatorApprovedMail = (to, name) => send(
  to,
  '✅ Your Creator Profile is Approved! — CreatoKite',
  base(
    `${h2('You\'re Approved! 🎉')}
     ${p(`Hi ${name}, your creator profile has been reviewed and approved by our team. You can now receive curated campaign assignments from leading brands.`)}
     ${btn(`${CLIENT}/creator/dashboard`, 'Open Creator Dashboard →')}`,
    'Approved',
    'PROFILE STATUS: VERIFIED'
  )
);

exports.sendCreatorRejectedMail = (to, name, reason = '') => send(
  to,
  'Creator Profile — Action Required — CreatoKite',
  base(
    `${h2('Profile Needs Update')}
     ${p(`Hi ${name}, your creator profile requires a few updates before we can complete verification.`)}
     ${reason ? `<div style="background: rgba(229, 91, 43, 0.08); border-left: 3px solid #FF7043; padding: 12px 16px; border-radius: 6px; margin: 16px 0;"><p style="color: #E2E8F0; font-size: 13px; margin: 0;"><strong>Feedback:</strong> ${reason}</p></div>` : ''}
     ${btn(`${CLIENT}/creator/profile`, 'Update Profile Now →')}`,
    'Action Required',
    'ACTION REQUIRED'
  )
);

exports.sendResetPasswordMail = (to, otpCode) => send(
  to,
  '🔐 Password Reset Code — CreatoKite',
  base(
    `${h2('Password Reset Request')}
     ${p('You requested to reset the password for your CreatoKite account. Use the one-time security code below to proceed.')}
     ${renderOtpDisplay(otpCode)}
     ${p('If you did not request a password reset, please contact support or update your password immediately.')}`,
    'Password Reset',
    'PASSWORD RESET CODE'
  )
);

exports.sendSignupOtpMail = (to, otpCode) => send(
  to,
  'Verification Code — CreatoKite Sign Up',
  base(
    `${h2('Verify Your Email Address')}
     ${p('Welcome to <strong>CreatoKite</strong>! Please enter the 6-digit verification code below to verify your email address and complete your registration.')}
     ${renderOtpDisplay(otpCode)}`,
    'Verify Email',
    'SIGNUP VERIFICATION'
  )
);

exports.sendCampaignAssignedMail = (to, name, campaignTitle, deadline) => send(
  to,
  `🎯 New Campaign Assigned: ${campaignTitle}`,
  base(
    `${h2('New Campaign Assignment! 🎯')}
     <div style="background: #181E2B; border: 1px solid rgba(229, 91, 43, 0.3); border-radius: 12px; padding: 18px; margin: 16px 0;">
       <div style="color: #FF7043; font-size: 16px; font-weight: 800; margin-bottom: 6px;">${campaignTitle}</div>
       <div style="color: #8B95A5; font-size: 12px;">Deadline: <strong style="color: #E2E8F0;">${new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
     </div>
     ${p(`Hi ${name}, you've been matched and assigned to a new brand campaign brief. Please review deliverables and accept or decline.`)}
     ${btn(`${CLIENT}/creator/assigned`, 'Review Campaign Brief →')}`,
    'Campaign Assigned',
    'CAMPAIGN MATCH'
  )
);

exports.sendCampaignAcceptedMail = (to, adminName, creatorName, campaignTitle) => send(
  to,
  `Creator Accepted: ${campaignTitle}`,
  base(
    `${h2('Creator Accepted Campaign')}
     ${p(`<strong style="color: #FF7043;">${creatorName}</strong> has accepted the campaign brief for <strong style="color: #FFFFFF;">${campaignTitle}</strong>.`)}
     ${btn(`${CLIENT}/admin/campaigns`, 'View Campaign Room →')}`,
    'Creator Accepted',
    'CAMPAIGN ACCEPTED'
  )
);

exports.sendSubmissionMail = (to, creatorName, campaignTitle) => send(
  to,
  `📤 New Deliverable Submission: ${campaignTitle}`,
  base(
    `${h2('Submission Received 📤')}
     ${p(`${creatorName} has submitted draft deliverables for <strong style="color: #FFFFFF;">${campaignTitle}</strong>. Please review and provide feedback or approval.`)}
     ${btn(`${CLIENT}/admin/campaigns`, 'Review Submission →')}`,
    'New Submission',
    'DELIVERABLE SUBMISSION'
  )
);

exports.sendSubmissionApprovedMail = (to, name, campaignTitle) => send(
  to,
  `✅ Submission Approved: ${campaignTitle}`,
  base(
    `${h2('Submission Approved! 🎉')}
     ${p(`Hi ${name}, your content deliverables for <strong style="color: #FFFFFF;">${campaignTitle}</strong> have been approved!`)}
     ${btn(`${CLIENT}/creator/assigned`, 'View Payout & Details →')}`,
    'Approved',
    'DELIVERABLE APPROVED'
  )
);

exports.sendSubmissionRejectedMail = (to, name, campaignTitle, reason = '') => send(
  to,
  `Changes Requested: ${campaignTitle}`,
  base(
    `${h2('Revision Requested')}
     ${p(`Hi ${name}, your submission for <strong style="color: #FFFFFF;">${campaignTitle}</strong> needs a few tweaks before final approval.`)}
     ${reason ? `<div style="background: rgba(229, 91, 43, 0.08); border-left: 3px solid #FF7043; padding: 12px 16px; border-radius: 6px; margin: 16px 0;"><p style="color: #E2E8F0; font-size: 13px; margin: 0;"><strong>Feedback:</strong> ${reason}</p></div>` : ''}
     ${btn(`${CLIENT}/creator/assigned`, 'Revise Deliverable →')}`,
    'Revision Needed',
    'REVISION REQUESTED'
  )
);

exports.sendTaskAssignedMail = (to, name, taskTitle) => send(
  to,
  `📋 Task Assigned: ${taskTitle}`,
  base(
    `${h2('New Task Assigned 📋')}
     ${p(`Hi ${name}, a new operational task has been assigned to you: <strong style="color: #FF7043;">${taskTitle}</strong>`)}
     ${btn(`${CLIENT}/team/tasks`, 'Open Task Manager →')}`,
    'Task Assigned',
    'TEAM TASK'
  )
);

exports.sendRoleChangeMail = (to, name, newRole) => send(
  to,
  '🔑 Your Role Has Been Updated — CreatoKite',
  base(
    `${h2('Role Updated')}
     ${p(`Hi ${name}, your account role on CreatoKite has been updated to:`)}
     <div style="margin: 14px 0;">${pill(newRole, '#E55B2B')}</div>
     ${p('Your workspace permissions and navigation have been refreshed.')}
     ${btn(`${CLIENT}`, 'Open Platform →')}`,
    'Role Updated',
    'ROLE UPDATE'
  )
);

exports.sendFollowUpReminderMail = (to, name, subject, notes = '') => send(
  to,
  `⏰ Follow-Up Reminder: ${subject}`,
  base(
    `${h2('Follow-Up Reminder ⏰')}
     ${p(`Hi ${name}, you have a CRM follow-up scheduled for <strong style="color: #FF7043;">${subject}</strong>.`)}
     ${notes ? p(`<strong>Notes:</strong> ${notes}`) : ''}
     ${btn(`${CLIENT}/admin/crm/creators`, 'View CRM Profile →')}`,
    'Follow-Up Reminder',
    'CRM REMINDER'
  )
);

exports.sendBroadcastMail = (to, title, body) => send(
  to,
  `[CreatoKite] ${title}`,
  base(`${h2(title)}${p(body)}${btn(CLIENT, 'Open Platform →')}`, title, 'ANNOUNCEMENT')
);

exports.sendPendingNotificationsMail = (to, name, unreadCount) => send(
  to,
  `⚠️ You Have ${unreadCount} Pending Notifications — CreatoKite`,
  base(
    `${h2('Pending Notifications ⚠️')}
     ${p(`Hi ${name}, you have <strong>${unreadCount} unread notifications</strong> waiting for your review on CreatoKite.`)}
     ${btn(`${CLIENT}/creator/dashboard`, 'Review Notifications →')}`,
    'Pending Notifications',
    'NOTIFICATION DIGEST'
  )
);
