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
    const key = apiKey || process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY;

    if (!key) {
      return res.status(401).json({ 
        error: 'No NVIDIA API key provided. Please configure an API key in Settings or environment.' 
      });
    }

    const targetUrl = endpoint || 'https://integrate.api.nvidia.com/v1/chat/completions';
    const targetModel = model || 'nvidia/nemotron-4-340b-instruct';

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messages || [],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Nemotron proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
