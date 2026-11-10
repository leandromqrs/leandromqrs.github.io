// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { paraglideVitePlugin } from "@inlang/paraglide-js";

// https://astro.build/config
export default defineConfig({
    site: 'https://leandromqrs.dev',
    compressHTML: true,
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/404') && /^https:\/\/[^/]+\/(en|pt-br|work)(\/|$)/.test(page),
            i18n: { defaultLocale: 'en', locales: { en: 'en', 'pt-br': 'pt-BR' } },
        }),
    ],
    vite: {
		plugins: [
			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/paraglide",
			}),
		],
    },
});
