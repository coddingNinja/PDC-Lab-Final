// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
// const fs = require("fs");
// const path = require("path");

// const PROTO_PATH = path.join(__dirname, "image_classifier.proto");
// const packageDef = protoLoader.loadSync(PROTO_PATH, {});
// const grpcObject = grpc.loadPackageDefinition(packageDef);
// const client = new grpcObject.imageclassifier.ImageClassifier(
//   "localhost:50051",
//   grpc.credentials.createInsecure()
// );

// const imagePath = path.join(__dirname, "test.png");
// const imageData = fs.readFileSync(imagePath);

// const start = Date.now();

// client.UploadImage({ imageData }, (err, response) => {
//   const end = Date.now();
//   if (err) console.error("Error:", err);
//   else {
//     const payloadSize = Buffer.byteLength(JSON.stringify(response));
//     console.log("gRPC Response:", response);
//     console.log("Latency (ms):", end - start);
//     console.log("Payload Size (bytes):", payloadSize);
//   }
// });
// client.js
// client.js
// client.js
const fs = require("fs");
const path = require("path");

async function run() {
  const imagePath = path.join(__dirname, "test.png");
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const start = Date.now();

  const response = await fetch("http://localhost:3001/uploadImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: imageData }),
  });

  const data = await response.json();
  const end = Date.now();

  const payloadSize = Buffer.byteLength(JSON.stringify(data));

  console.log("Response from Microservice A:", data);
  console.log("Latency (ms):", end - start);
  console.log("Payload Size (bytes):", payloadSize);
}

run().catch(console.error);
