const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer();

app.use(cors());

function classifyImageDummy(imageBuffer) {
  return {
    label: "cat",
    confidence: Number(Math.random().toFixed(2)),
  };
}

app.post("/uploadImage", upload.single("image"), (req, res) => {
  const start = Date.now();

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const result = classifyImageDummy(req.file.buffer);

  const end = Date.now();
  console.log("REST Processing Time (ms):", end - start);

  res.json(result);
});

app.listen(3001, () => {
  console.log("REST Server running on http://localhost:3001");
});
