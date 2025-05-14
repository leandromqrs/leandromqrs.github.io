// @ts-check
import { defineConfig } from 'astro/config';
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    site: 'https://leandromqrs.dev',
    i18n: {
        locales: ['en', 'pt-br'],
        defaultLocale: 'en',
/*         routing: {
            prefixDefaultLocale: true
        } */
    },
    vite: {
		plugins: [
			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/paraglide",
			}),
		],
    },
});
