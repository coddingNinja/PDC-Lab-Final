const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const fs = require("fs");
const path = require("path");

// Load protobuf
const PROTO_PATH = path.join(__dirname, "image_classifier.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const imageClassifier = grpcObject.imageclassifier;

// Fake AI classifier
function classifyImage() {
  const labels = ["cat", "dog", "car", "person"];
  return {
    label: labels[Math.floor(Math.random() * labels.length)],
    confidence: parseFloat(Math.random().toFixed(2)),
  };
}

// Implement UploadImage RPC
function uploadImage(call, callback) {
  const result = classifyImage();
  callback(null, result);
}

// Create server
const server = new grpc.Server();
server.addService(imageClassifier.ImageClassifier.service, {
  UploadImage: uploadImage,
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("gRPC server running on port", port);
    server.start(); 
  }
);

