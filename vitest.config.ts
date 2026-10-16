import { defineConfig } from 'vitest/config';

export default defineConfig({
    server: {
        allowedHosts: [".app.github.dev"],
    },
});