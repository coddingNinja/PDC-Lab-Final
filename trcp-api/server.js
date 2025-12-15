// server.js
const express = require("express");
const { initTRPC } = require("@trpc/server");
const { createExpressMiddleware } = require("@trpc/server/adapters/express");
const { z } = require("zod");

// Initialize tRPC
const t = initTRPC.create();

// Fake AI classifier
function classifyImage() {
  const labels = ["cat", "dog", "car", "person"];
  return {
    label: labels[Math.floor(Math.random() * labels.length)],
    confidence: parseFloat(Math.random().toFixed(2)),
  };
}

// Router
const appRouter = t.router({
  uploadImage: t.procedure
    .input(
      z.object({
        imageBase64: z.string(),
      })
    )
    .mutation(({ input }) => {
      // Here you can use input.imageBase64 for actual AI inference
      const result = classifyImage();
      return { result };
    }),
});

const app = express();

// JSON middleware (needed for fetch JSON requests)
app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(3003, () => {
  console.log("tRPC server running at http://localhost:3003/trpc");
});

module.exports = { appRouter };
