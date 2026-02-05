// Minimal Node/Express proxy example. Keep your OPENAI_API_KEY in environment variables.
// This file is optional; the frontend demo works without it.

const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) console.warn('OPENAI_API_KEY not set.');

app.post('/api/chat', async (req, res) => {
  if (!OPENAI_KEY) return res.status(500).json({ error: 'Server missing OPENAI_API_KEY' });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${sk-qrst5678qrst5678qrst5678qrst5678qrst5678 }`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role:'user', content: message }],
        max_tokens: 400
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Request failed' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
