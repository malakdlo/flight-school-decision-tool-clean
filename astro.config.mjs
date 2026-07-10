// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://flightschoolfriend.com',
  // Dev-only: honor an externally assigned port (e.g. preview tooling); defaults to 4321.
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/flight-school-decision-tool/results/') &&
        !page.includes('/guides/flight-schools-tulsa/') &&
        !page.includes('/guides/discovery-flight-tulsa/') &&
        !page.includes('/guides/ppl-cost-oklahoma/') &&
        !page.includes('/thank-you/download/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
