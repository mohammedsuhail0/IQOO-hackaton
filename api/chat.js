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
    const { model, messages, apiKey } = req.body || {};
    
    // Use environment variables or client-provided key
    const groqKey = apiKey || process.env.GROQ_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    let data = null;
    let status = 200;

    // 1. Try Groq Primary Model (qwen/qwen3.8-27b - Ultra-fast ~300ms)
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: model || 'qwen/qwen3.8-27b',
          messages: messages || [],
          temperature: 0.7,
          max_tokens: 180
        })
      });

      if (groqResponse.ok) {
        data = await groqResponse.json();
        status = groqResponse.status;
      }
    } catch (groqErr) {
      console.warn('Groq primary failed, trying secondary:', groqErr);
    }

    // 2. Try Groq Secondary Model (groq/compound)
    if (!data?.choices?.[0]?.message?.content) {
      try {
        const groqSecondary = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: 'groq/compound',
            messages: messages || [],
            temperature: 0.7,
            max_tokens: 180
          })
        });

        if (groqSecondary.ok) {
          data = await groqSecondary.json();
          status = groqSecondary.status;
        }
      } catch (secErr) {
        console.warn('Groq secondary failed:', secErr);
      }
    }

    // 3. Fallback to NVIDIA API if Groq fails
    if (!data?.choices?.[0]?.message?.content) {
      try {
        const nvResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nvidiaKey}`
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
            messages: messages || [],
            temperature: 0.7,
            max_tokens: 180
          })
        });

        if (nvResponse.ok) {
          data = await nvResponse.json();
          status = nvResponse.status;
        }
      } catch (nvErr) {
        console.warn('NVIDIA fallback failed:', nvErr);
      }
    }

    // Clean up content (strip <think> tags, roleplay asterisks *...*, outer quotes)
    if (data?.choices?.[0]?.message) {
      let content = data.choices[0].message.content || '';
      content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      content = content.replace(/Here's a thinking process:[\s\S]*?\n\n/gi, '').trim();
      
      // Strip asterisks roleplay actions (e.g. *clutches chest*, *eyes widen in fear*)
      content = content.replace(/\*[^*]+\*/g, '').trim();
      
      // Strip leading parenthetical actions (e.g. (winces in pain))
      content = content.replace(/^\([^)]+\)\s*/g, '').trim();

      // Normalize whitespace
      content = content.replace(/\n\s*\n+/g, '\n').replace(/[ \t]+/g, ' ').trim();

      // Strip outer quotation marks if wrapped in quotes
      if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith('“') && content.endsWith('”'))) {
        content = content.slice(1, -1).trim();
      }
      data.choices[0].message.content = content;
    }

    return res.status(status).json(data);
  } catch (err) {
    console.error('Chat API proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
