/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    maxWorkers: 1,
    maxConcurrency: 1,
    minWorkers: 1,
    logHeapUsage: true,

    // ...
  },
});

import { config } from "dotenv";

config({
  path: "../../.env",
});
