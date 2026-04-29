export default function handler(req, res) {
  const apiKey = process.env.MAPS_JAVASCRIPT_API;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Maps API key is not configured on the server' });
  }

  return res.status(200).json({ key: apiKey });
}
