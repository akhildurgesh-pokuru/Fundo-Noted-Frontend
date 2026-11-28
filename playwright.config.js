
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  timeout: 30000,

  expect: {
    timeout: 10000
  },

  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },

  webServer: {
    command:
      "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",

    url: "http://127.0.0.1:5173",

    reuseExistingServer: true,

    timeout: 60000
  },

  reporter: [
    ["list"],
    ["html", { open: "never" }]
  ]
});
