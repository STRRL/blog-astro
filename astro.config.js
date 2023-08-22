import embeds from '@astro-community/astro-embed-integration';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { remarkImage } from './src/libs/remark-image-pz';

// https://astro.build/config
export default defineConfig({

	site: 'https://strrl.dev',
	integrations: [tailwind(), embeds(), mdx(), sitemap()],
	markdown: {
		remarkPlugins: [
			remarkImage
		]
	},
});
