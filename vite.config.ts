import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  // We remove the specific 'preview' block here to allow the 
  // package.json CLI arguments to strictly control the port/host binding.
  server: {
    host: true, // Listen on all addresses
  }
});
