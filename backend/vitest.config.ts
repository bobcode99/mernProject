import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        threads: false,
        testTimeout: 60_000,
        hookTimeout: 60_000,
    },
});
