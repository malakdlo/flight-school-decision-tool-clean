// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output keeps V1 simple and deployable on Cloudflare Pages.
// Add a Cloudflare Worker/adapter later only if the product needs SSR, auth, or server-side personalization.
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
