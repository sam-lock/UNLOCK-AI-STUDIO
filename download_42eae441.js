// Vercel Serverless: GET /api/download?url=...&name=...
// Proxies audio download to avoid iOS Safari redirecting to cdn1.suno.ai
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { url, name } = req.query;
    if (!url || !url.startsWith('https://cdn')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const resp = await fetch(url);
    if (!resp.ok) return res.status(502).json({ error: 'Failed to fetch audio' });

    const buf = Buffer.from(await resp.arrayBuffer());
    const fname = (name || 'soundcard-track') + '.mp3';

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
    res.setHeader('Content-Length', buf.length);
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
