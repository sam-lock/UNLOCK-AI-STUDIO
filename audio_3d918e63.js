// Vercel Serverless: GET /api/audio?url=...
// Proxies audio streaming so users never see cdn1.suno.ai
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { url } = req.query;
    if (!url || !url.startsWith('https://cdn')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const resp = await fetch(url);
    if (!resp.ok) return res.status(502).json({ error: 'Failed to fetch audio' });

    const buf = Buffer.from(await resp.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buf.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Accept-Ranges', 'bytes');
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
