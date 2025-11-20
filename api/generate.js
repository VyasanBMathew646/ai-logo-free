// Vercel Serverless Function
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "USE POST" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Call flux-pro API
    const apiURL = "https://flux-pro.vercel.app/generate?q=" + encodeURIComponent(prompt);
    const imageURL = await fetch(apiURL).then(r => r.text());

    // Download the image
    const imageBuffer = await fetch(imageURL).then(r => r.arrayBuffer());
    const buffer = Buffer.from(imageBuffer);

    // Save to Vercel storage (inside .vercel/output)
    const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 9999)}.png`;
    const savePath = path.join("/tmp", fileName);

    await writeFile(savePath, buffer);

    // Return to frontend
    res.status(200).json({
      success: true,
      image: `/api/file?name=${fileName}`,
      prompt,
      ip
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.toString() });
  }
}