// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://flightschoolfriend.com',
  integrations: [
    sitemap({
      filter: (page) =>
        // Draft — under review; remove after instructor sign-off (see REVIEW.md)
        !page.includes('/tools/radio-call-builder/') &&
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
