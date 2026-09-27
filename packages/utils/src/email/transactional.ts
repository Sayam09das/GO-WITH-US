/** Escape user-controlled strings for HTML email bodies. */
export function escapeHtmlForEmail(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type TransactionalEmailCta = {
  label: string;
  href: string;
};

export type TransactionalEmailContent = {
  siteName?: string;
  siteUrl: string;
  supportEmail?: string;
  preheader: string;
  headline: string;
  greetingName: string;
  paragraphs: string[];
  cta?: TransactionalEmailCta;
  /** Short line under the button (expiry, security, etc.). */
  footnote?: string;
  /** Optional highlighted detail (e.g. booking reference). */
  highlight?: string;
};

export type RenderedTransactionalEmail = {
  html: string;
  text: string;
};

const BRAND = {
  pageBg: "#FAFAFA",
  cardBg: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  accent: "#0D9488",
  accentHover: "#0F766E",
} as const;

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "");
}

export function renderTransactionalEmail(
  content: TransactionalEmailContent,
): RenderedTransactionalEmail {
  const siteName = content.siteName ?? "GO WITH US";
  const safeName = escapeHtmlForEmail(content.greetingName);
  const safeHeadline = escapeHtmlForEmail(content.headline);
  const safePreheader = escapeHtmlForEmail(content.preheader);
  const safeSiteUrl = escapeHtmlForEmail(content.siteUrl);
  const supportEmail = content.supportEmail ?? "hello@gowithus.com";
  const safeSupport = escapeHtmlForEmail(supportEmail);

  const bodyHtml = content.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:${BRAND.textSecondary};">${escapeHtmlForEmail(paragraph)}</p>`,
    )
    .join("");

  const highlightHtml = content.highlight
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;"><tr><td style="padding:16px 20px;background:${BRAND.pageBg};border:1px solid ${BRAND.border};border-radius:8px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:15px;line-height:22px;color:${BRAND.text};letter-spacing:0.02em;">${escapeHtmlForEmail(content.highlight)}</td></tr></table>`
    : "";

  const ctaHtml = content.cta
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;"><tr><td style="border-radius:8px;background:${BRAND.accent};"><a href="${escapeHtmlForEmail(content.cta.href)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;line-height:20px;color:#FFFFFF;text-decoration:none;border-radius:8px;">${escapeHtmlForEmail(content.cta.label)}</a></td></tr></table>`
    : "";

  const footnoteHtml = content.footnote
    ? `<p style="margin:0 0 8px;font-size:13px;line-height:20px;color:${BRAND.textMuted};">${escapeHtmlForEmail(content.footnote)}</p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${safeHeadline}</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-card { background-color: #FFFFFF !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.pageBg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND.pageBg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-card" style="max-width:560px;background-color:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;line-height:16px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.accent};">${escapeHtmlForEmail(siteName)}</p>
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:600;line-height:32px;color:${BRAND.text};">${safeHeadline}</h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:${BRAND.text};">Hi ${safeName},</p>
              ${bodyHtml}
              ${highlightHtml}
              ${ctaHtml}
              ${footnoteHtml}
              <p style="margin:0;font-size:13px;line-height:20px;color:${BRAND.textMuted};">If the button does not work, copy and paste this link into your browser:<br /><a href="${content.cta ? escapeHtmlForEmail(content.cta.href) : safeSiteUrl}" style="color:${BRAND.accent};word-break:break-all;">${content.cta ? escapeHtmlForEmail(content.cta.href) : safeSiteUrl}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 28px;border-top:1px solid ${BRAND.border};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p style="margin:0 0 8px;font-size:12px;line-height:18px;color:${BRAND.textMuted};">You received this email because of activity on your ${escapeHtmlForEmail(siteName)} account.</p>
              <p style="margin:0;font-size:12px;line-height:18px;color:${BRAND.textMuted};"><a href="${safeSiteUrl}" style="color:${BRAND.textSecondary};text-decoration:underline;">Visit ${escapeHtmlForEmail(siteName)}</a> · <a href="mailto:${safeSupport}" style="color:${BRAND.textSecondary};text-decoration:underline;">Contact support</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textParagraphs = content.paragraphs.map(stripHtml).join("\n\n");
  const textCta = content.cta ? `\n\n${content.cta.label}:\n${content.cta.href}\n` : "";
  const textHighlight = content.highlight ? `\n\n${content.highlight}\n` : "";
  const textFootnote = content.footnote ? `\n\n${content.footnote}` : "";

  const text = `${siteName}

${content.headline}

Hi ${content.greetingName},

${textParagraphs}${textHighlight}${textCta}${textFootnote}

---
${siteName}: ${content.siteUrl}
Support: ${supportEmail}`;

  return { html, text };
}
