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
    confidence: Math.random().toFixed(2),
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
    .mutation(() => {
      return classifyImage();
    }),
});

// Express app
const app = express();

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(3003, () => {
  console.log("tRPC server running at http://localhost:3003/trpc");
});

// Export type (not used in JS, but required internally)
module.exports = { appRouter };
