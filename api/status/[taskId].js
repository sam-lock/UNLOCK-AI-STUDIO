// Vercel Serverless: GET /api/status/:taskId
const SUNOR_BASE = 'https://sunor.cc/api/v1';
const SUNOR_KEY = process.env.SUNOR_API_KEY || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { taskId } = req.query;
    const resp = await fetch(`${SUNOR_BASE}/task/${taskId}`, {
      headers: { 'Content-Type': 'application/json', 'x-api-key': SUNOR_KEY },
    });
    const data = await resp.json();

    if (!data.data) return res.status(404).json({ error: 'Task not found' });

    const task = data.data;
    const result = {
      task_id: task.task_id,
      status: task.status,
      songs: [],
    };

    if (task.status === 'success' && task.output && task.output.result) {
      result.songs = task.output.result.map(s => ({
        id: s.id,
        title: s.title,
        audio_url: s.audio_url,
        image_url: s.image_url,
        video_url: s.video_url,
        duration: s.metadata?.duration || 0,
        tags: s.metadata?.tags || '',
      }));
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
