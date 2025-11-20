// /api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    // Call flux-pro API
    const apiURL = "https://flux-pro.vercel.app/generate?q=" + encodeURIComponent(prompt);
    const imageURL = await fetch(apiURL).then(r => r.text());

    // Return the image URL directly
    res.status(200).json({
      success: true,
      image: imageURL,
      prompt
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.toString() });
  }
}