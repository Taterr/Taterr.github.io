import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Account site: username.github.io. For a project site, use '/repository-name/'.
  base: '/',
});
