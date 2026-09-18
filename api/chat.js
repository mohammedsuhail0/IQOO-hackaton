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
    const primaryModel = model || 'nvidia/nemotron-3-ultra-550b-a55b';
    const fallbackModel = 'deepseek-ai/deepseek-v4-flash-0731';

    let data = null;
    let status = 200;

    // Try primary model with 250 max tokens for low latency
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: primaryModel,
          messages: messages || [],
          temperature: 0.7,
          max_tokens: 250
        })
      });

      status = response.status;
      data = await response.json();
    } catch (fetchErr) {
      console.warn('Primary model request failed, trying fallback:', fetchErr);
    }

    // If primary failed or returned error, try fallback model
    if (!data?.choices?.[0]?.message?.content && primaryModel !== fallbackModel) {
      try {
        const fbResponse = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: fallbackModel,
            messages: messages || [],
            temperature: 0.7,
            max_tokens: 200
          })
        });
        if (fbResponse.ok) {
          data = await fbResponse.json();
          status = fbResponse.status;
        }
      } catch (fbErr) {
        console.warn('Fallback model also failed:', fbErr);
      }
    }

    // Clean up content (strip <think> tags, meta-reasoning, outer quotes)
    if (data?.choices?.[0]?.message) {
      let content = data.choices[0].message.content || '';
      content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      content = content.replace(/Here's a thinking process:[\s\S]*?\n\n/gi, '').trim();
      if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith('“') && content.endsWith('”'))) {
        content = content.slice(1, -1).trim();
      }
      data.choices[0].message.content = content;
    }

    return res.status(status).json(data);
  } catch (err) {
    console.error('Nemotron proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
