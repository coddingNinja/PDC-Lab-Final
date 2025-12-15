// microserviceA.js
const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "image_classifier.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const imageClassifierPackage = grpcObject.imageclassifier;

// gRPC client to Microservice B
const grpcClient = new imageClassifierPackage.ImageClassifier(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const app = express();
app.use(express.json());

app.post("/uploadImage", (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const imageBuffer = Buffer.from(imageBase64, "base64");

  grpcClient.UploadImage({ imageData: imageBuffer }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
});

app.listen(3001, () => {
  console.log("Microservice A running at http://localhost:3001");
});
