const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function sendImage() {
  const form = new FormData();
  form.append("image", fs.createReadStream("test.png"));

  const start = Date.now();

  const response = await axios.post(
    "http://localhost:3001/uploadImage",
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    }
  );

  const end = Date.now();

  const payloadSize = Buffer.byteLength(JSON.stringify(response.data));

  console.log("REST Response:", response.data);
  console.log("Latency (ms):", end - start);
  console.log("Payload Size (bytes):", payloadSize);
}

sendImage();
