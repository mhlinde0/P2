import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Use jsdom to enable `localStorage` and other browser APIs
  },
});