export default async function handler(req, res) {
  // CORS configuration for seamless client calls
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, messages, apiKey, endpoint } = req.body || {};
    
    // Use user-provided key, environment key, or the authenticated Nemotron Ultra key
    const key = apiKey || process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY || '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';

    const targetUrl = endpoint || 'https://integrate.api.nvidia.com/v1/chat/completions';
    const targetModel = model || 'nvidia/nemotron-3-ultra-550b-a55b';

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messages || [],
        temperature: 0.7,
        max_tokens: 450
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Nemotron proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
