import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Libraries change far less often than the app, so they get chunks of their own
 * that browsers keep cached across deploys.
 */
const VENDOR_CHUNKS = [
    { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
    { name: 'vendor-mui', test: /node_modules[\\/](@mui|@emotion|@popperjs|stylis)[\\/]/ },
    { name: 'vendor-router', test: /node_modules[\\/](react-router|@tanstack)[\\/]/ },
];

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: true,
        rolldownOptions: {
            output: {
                codeSplitting: { groups: VENDOR_CHUNKS },
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        css: false,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
            reporter: ['text-summary', 'text'],
            thresholds: { lines: 80, statements: 80 },
        },
    },
});
