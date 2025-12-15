const fs = require("fs");
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { response } = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// -------------------- Configuration --------------------
const REQUESTS = 1000; 
const IMAGE_PATH = path.join("./", "test.png");

// gRPC proto and clients
const PROTO_PATH = path.join("./", "image_classifier.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const ImageClassifier = grpcObject.imageclassifier.ImageClassifier;

// -------------------- Helper Functions --------------------
async function benchmarkREST() {
  const start = Date.now();
  for (let i = 0; i < REQUESTS; i++) {
  const response= await fetch("http://localhost:3001/uploadImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: fs.readFileSync(IMAGE_PATH).toString("base64") }),
    });
  }

  const end = Date.now();
  console.log("REST total time (ms):", end - start);
  console.log("REST avg latency (ms):", (end - start) / REQUESTS);
}

async function benchmarkTRPC() {
  const start = Date.now();
  for (let i = 0; i < REQUESTS; i++) {
    await fetch("http://localhost:3003/trpc/uploadImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: { imageBase64: fs.readFileSync(IMAGE_PATH).toString("base64") } }),
    });
  }
  const end = Date.now();
  console.log("tRPC total time (ms):", end - start);
  console.log("tRPC avg latency (ms):", (end - start) / REQUESTS);
}

function benchmarkGRPCDirect() {
  return new Promise((resolve, reject) => {
    const client = new ImageClassifier("localhost:50051", grpc.credentials.createInsecure());
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const start = Date.now();

    let completed = 0;
    for (let i = 0; i < REQUESTS; i++) {
      client.UploadImage({ imageData: imageBuffer }, (err, res) => {
        if (err) reject(err);
        completed++;
        if (completed === REQUESTS) {
          const end = Date.now();
          console.log("Direct gRPC total time (ms):", end - start);
          console.log("Direct gRPC avg latency (ms):", (end - start) / REQUESTS);
          resolve();
        }
      });
    }
  });
}

function benchmarkGRPCViaA() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const imageBase64 = fs.readFileSync(IMAGE_PATH).toString("base64");

    let completed = 0;
    for (let i = 0; i < REQUESTS; i++) {
      fetch("http://localhost:4000/uploadImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      })
        .then(() => {
          completed++;
          if (completed === REQUESTS) {
            const end = Date.now();
            console.log("gRPC via Microservice A total time (ms):", end - start);
            console.log("gRPC via Microservice A avg latency (ms):", (end - start) / REQUESTS);
            resolve();
          }
        })
        .catch((err) => reject(err));
    }
  });
}

async function run() {
  console.log("==== Benchmarking Distributed AI Image Classifier ====\n");

  console.log("🔴 REST Benchmark");
  await benchmarkREST();
  console.log("\n🟢 tRPC Benchmark");
  await benchmarkTRPC();
  console.log("\n🔵 Direct gRPC Benchmark");
  await benchmarkGRPCDirect();
  console.log("\n🟣 gRPC via Microservice A Benchmark");
  await benchmarkGRPCViaA();

  console.log("\n==== Benchmark Complete ====");
}

run().catch(console.error);
