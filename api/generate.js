// Vercel Serverless: POST /api/generate
const SUNOR_BASE = 'https://sunor.cc/api/v1';
const SUNOR_KEY = process.env.SUNOR_API_KEY || '';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, lyrics, instrumental, tags, title } = req.body;
    const input = { make_instrumental: !!instrumental };

    if (lyrics && !instrumental) {
      input.prompt = lyrics;
      if (tags) input.tags = tags;
      if (title) input.title = title;
    } else {
      input.gpt_description_prompt = prompt || 'upbeat electronic music';
    }

    const resp = await fetch(`${SUNOR_BASE}/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': SUNOR_KEY },
      body: JSON.stringify({ model: 'suno', task_type: 'music', input }),
    });

    const data = await resp.json();
    if (data.code === 202 || data.code === 200) {
      res.json({
        task_id: data.data.task_id,
        status: data.data.status,
        credits_charged: data.data.credits_charged,
      });
    } else {
      res.status(400).json({ error: data.message || data.msg || ('API error: code ' + data.code) });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
