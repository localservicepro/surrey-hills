// Vercel serverless function: receives the /contact/ quote form (POST, form-encoded),
// emails it via Resend when RESEND_API_KEY is set, and redirects to /thank-you/.
// Env vars (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY   – Resend API key
//   QUOTE_TO_EMAIL   – where quote requests go (default: info@surreyhillsgardensupplies.com.au)
//   QUOTE_FROM_EMAIL – verified sender in Resend, e.g. "SHGS Website <quotes@surreyhillsgardensupplies.com.au>"
// Without RESEND_API_KEY the submission is logged to the function log and still redirects, so the form never errors for a customer.
// On Netlify this file is unused: Netlify Forms captures the same form (data-netlify attribute).
const FIELDS = ['name', 'email', 'phone', 'suburb', 'products', 'quantity', 'fulfilment', 'notes'];

function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 50000) req.destroy(); });
    req.on('end', () => {
      const ct = (req.headers['content-type'] || '').toLowerCase();
      if (ct.includes('application/json')) { try { return resolve(JSON.parse(raw)); } catch (e) { return resolve({}); } }
      resolve(Object.fromEntries(new URLSearchParams(raw)));
    });
  });
}
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Allow', 'POST'); return res.end('Method Not Allowed'); }
  const body = await parseBody(req);
  if (body.company) { res.statusCode = 303; res.setHeader('Location', '/thank-you/'); return res.end(); } // honeypot
  const data = Object.fromEntries(FIELDS.map((k) => [k, String(body[k] || '').trim().slice(0, 2000)]));
  if (!data.name || !data.phone || !data.products) { res.statusCode = 303; res.setHeader('Location', '/contact/?error=missing#quote'); return res.end(); }

  const to = process.env.QUOTE_TO_EMAIL || 'info@surreyhillsgardensupplies.com.au';
  const from = process.env.QUOTE_FROM_EMAIL || 'SHGS Website <onboarding@resend.dev>';
  const subject = `Quote request: ${data.products} — ${data.suburb || 'no suburb'} (${data.name})`;
  const rows = FIELDS.map((k) => `<tr><th align="left" style="padding:4px 8px">${k}</th><td style="padding:4px 8px">${esc(data[k]).replace(/\n/g, '<br>')}</td></tr>`).join('');
  const html = `<h2>New quote request from the website</h2><table>${rows}</table><p>Submitted ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })} (Melbourne time)</p>`;

  if (process.env.RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [to], reply_to: data.email || undefined, subject, html })
      });
      if (!r.ok) console.error('Resend error', r.status, await r.text());
    } catch (e) { console.error('Resend request failed', e); }
  } else {
    console.log('QUOTE REQUEST (no RESEND_API_KEY set):', JSON.stringify(data));
  }
  res.statusCode = 303; res.setHeader('Location', '/thank-you/'); res.end();
};
