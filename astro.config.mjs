// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sint-org.com',
  redirects: {
    '/chronicle': 'https://sint-org.academia.edu/KoheiOkawa',
  },
});
