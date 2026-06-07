'use strict';

require('dotenv').config();

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Validate required secrets at startup ────────────────
const REQUIRED = ['GEMINI_API_KEY', 'GOOGLE_MAPS_API_KEY'];
for (const key of REQUIRED) {
  if (!process.env[key] || process.env[key].startsWith('YOUR_')) {
    console.error(`[oracle] Missing required env var: ${key}`);
    process.exit(1);
  }
}

const GEMINI_API_KEY     = process.env.GEMINI_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEMINI_MODEL       = 'gemini-flash-lite-latest';

app.use(express.json());

// ─── /api/config — non-secret client config ──────────────
// Spotify Client ID and Google Client ID are intentionally client in
// browser-based OAuth / PKCE flows, so it is safe to expose them here.
app.get('/api/config', (_req, res) => {
  res.json({
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID || '',
    googleClientId:  process.env.GOOGLE_CLIENT_ID  || '',
  });
});

// ─── /api/analyze — Gemini proxy ─────────────────────────
// The Gemini key never leaves the server.
app.post('/api/analyze', async (req, res) => {
  const { tracks } = req.body;

  if (!Array.isArray(tracks) || tracks.length === 0) {
    return res.status(400).json({ error: 'tracks array is required' });
  }

  const trackList = tracks
    .map(t => `${t.trackName} — ${(t.artists || []).join(', ')}`)
    .join('\n');

  const prompt =
`You are a music oracle. Given recently played songs, rank the top 3 Greek gods by how well the music vibes match.

Gods and their music:
- dionysus: House
- athena: Instrumental
- ares: Rock
- demeter: Folk
- zeus: Orchestral

Recently played:
${trackList}

Output ONLY valid JSON, no explanation:
{"top3":["god1","god2","god3"]}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents:       [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 64 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[oracle] Gemini error:', geminiRes.status, errText);
      return res.status(502).json({ error: `Gemini upstream error: ${geminiRes.status}` });
    }

    const data = await geminiRes.json();
    const raw  = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
    const json = JSON.parse(raw.replace(/^```json|^```|```$/g, '').trim());
    res.json(json);
  } catch (err) {
    console.error('[oracle] Gemini proxy error:', err);
    res.status(500).json({ error: 'Divination failed' });
  }
});

// ─── Serve index.html with Maps key injected ─────────────
// The Maps key is substituted into a placeholder in index.html at request
// time, so it never appears in source control.
const fs   = require('fs');
const HTML = fs.readFileSync(path.join(__dirname, 'client', 'index.html'), 'utf8');

app.get('/', (_req, res) => {
  const page = HTML.replace('__GOOGLE_MAPS_API_KEY__', GOOGLE_MAPS_API_KEY);
  res.setHeader('Content-Type', 'text/html');
  res.send(page);
});

// ─── Static assets ────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'client')));

// ─── Fallback: serve index.html for any unknown route ────
app.get('*', (_req, res) => {
  const page = HTML.replace('__GOOGLE_MAPS_API_KEY__', GOOGLE_MAPS_API_KEY);
  res.setHeader('Content-Type', 'text/html');
  res.send(page);
});

app.listen(PORT, () => {
  console.log(`[oracle] Server running at http://localhost:${PORT}`);
});
