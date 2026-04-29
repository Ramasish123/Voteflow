export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server' });
  }

  try {
    const { message, context } = req.body;
    
    const systemPrompt = `You are a civic election assistant helping users understand the voting process step-by-step. Be simple, clear, and actionable. Keep answers brief. Use this user state context: ${context}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 150,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return res.status(500).json({ error: 'Failed to communicate with AI service' });
  }
}
