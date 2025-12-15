const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "image_classifier.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const imageClassifier = grpcObject.imageclassifier;

function classifyImage() {
  const labels = ["cat", "dog", "car", "person"];
  return {
    label: labels[Math.floor(Math.random() * labels.length)],
    confidence: parseFloat(Math.random().toFixed(2)),
  };
}

function uploadImage(call, callback) {
  const result = classifyImage();
  callback(null, result);
}

const server = new grpc.Server();
server.addService(imageClassifier.ImageClassifier.service, {
  UploadImage: uploadImage,
});

const PORT = "0.0.0.0:50051";
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) return console.error(err);
  console.log(`Microservice B running at ${PORT}`);
  server.start();
});
