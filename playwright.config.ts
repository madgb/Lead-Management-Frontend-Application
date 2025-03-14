import { defineConfig } from "@playwright/test";

export default defineConfig({
    use: {
        baseURL: "http://localhost:3000",
        headless: true,
    },
    webServer: {
        command: "yarn dev",
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
});
