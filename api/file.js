import { readFile } from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const { name } = req.query;

  const filePath = path.join("/tmp", name);

  try {
    const file = await readFile(filePath);
    res.setHeader("Content-Type", "image/png");
    res.send(file);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
}