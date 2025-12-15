// client.js
// tRPC Client using Node.js built-in fetch (Node 18+)

async function run() {
  const start = Date.now();

  const response = await fetch("http://localhost:3003/trpc/uploadImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        image: "dummy-image-data",
      },
    }),
  });

  const data = await response.json();
  const end = Date.now();

  const payloadSize = Buffer.byteLength(JSON.stringify(data));

  console.log("tRPC Response:", data.result);
  console.log("Latency (ms):", end - start);
  console.log("Payload Size (bytes):", payloadSize);
}

run().catch((err) => {
  console.error("Client error:", err);
});
