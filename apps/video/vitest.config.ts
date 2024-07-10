/// <reference types="vitest" />
import { defineConfig } from "vite";
import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
}); // Load .env variables with

export default defineConfig({
  test: {
    // ... Specify options here.
  },
});
