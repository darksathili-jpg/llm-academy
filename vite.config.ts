import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ base: '/llm-academy/', plugins: [react()], test: { include: ['tests/unit/**/*.test.ts'] } });

