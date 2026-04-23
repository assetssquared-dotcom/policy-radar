// 뉴스 수동 업데이트 트리거
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const secret = req.headers['x-admin-secret'];
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const cronUrl = `${protocol}://${host}/api/cron/update-news`;

  try {
    const response = await fetch(cronUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const data = await response.json();
    return res.status(200).json({ triggered: true, result: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
