// Vercel Serverless: GET /api/health
module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'ok', hasKey: !!process.env.SUNOR_API_KEY });
}
