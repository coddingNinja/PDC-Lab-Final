const fs = require('fs');
async function run() {
  try {
    const start = Date.now();
    const imageBuffer = fs.readFileSync("test.png");
    const imageBase64 = imageBuffer.toString("base64");
    const response = await fetch("http://localhost:3003/trpc/uploadImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64,
      }),
    });
    const data = await response.json();
    const end = Date.now();

    const payloadSize = Buffer.byteLength(JSON.stringify(data));

    console.log("tRPC Response:", data.result);
    console.log("Latency (ms):", end - start);
    console.log("Payload Size (bytes):", payloadSize);
  } catch (err) {
    console.error("Client error:", err);
  }
}

run();
