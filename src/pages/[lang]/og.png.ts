import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const GLYPH_ADVANCE = 0.6;

const color = {
	background: '#0b0d0b',
	card: '#121512',
	border: '#38403a',
	square: '#5a645d',
	accent: '#46e07c',
	text: '#eef2ee',
	muted: '#8a948c',
};

type Locale = 'en' | 'pt-br';

interface CardContent {
	title: string[];
	titleSize: number;
	subtitle: string[];
	roles: string[];
}

const content: Record<Locale, CardContent> = {
	en: {
		title: ['I turn technology', 'into competitive', 'advantage.'],
		titleSize: 54,
		subtitle: [
			'I build scalable products that accelerate operations,',
			'reduce risk, and prepare businesses',
			'to grow with AI.',
		],
		roles: ['Developer', 'System Architect', 'DevOps & CI/CD'],
	},
	'pt-br': {
		title: ['Transformo tecnologia', 'em vantagem', 'competitiva.'],
		titleSize: 48,
		subtitle: [
			'Crio produtos digitais escaláveis que aceleram',
			'operações, reduzem riscos e preparam negócios',
			'para crescer com IA.',
		],
		roles: ['Desenvolvedor', 'Arquiteto de Sistemas', 'DevOps & CI/CD'],
	},
};

export const getStaticPaths: GetStaticPaths = () =>
	(Object.keys(content) as Locale[]).map((lang) => ({
		params: { lang },
		props: { lang },
	}));

const fontDirectory = join(process.cwd(), 'src', 'assets', 'fonts');
const fonts = {
	regular: join(fontDirectory, 'JetBrainsMono-Regular.ttf'),
	bold: join(fontDirectory, 'JetBrainsMono-Bold.ttf'),
};

function escapeMarkup(value: string): string {
	return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function span(value: string, foreground: string): string {
	return `<span foreground="${foreground}">${escapeMarkup(value)}</span>`;
}

async function renderText(
	markup: string,
	size: number,
	weight: keyof typeof fonts,
	left: number,
	top: number,
	lineSpacing = 0,
): Promise<sharp.OverlayOptions> {
	const input = await sharp({
		text: {
			text: markup,
			font: `JetBrains Mono ${weight === 'bold' ? 'Bold ' : ''}${size}`,
			fontfile: fonts[weight],
			rgba: true,
			spacing: lineSpacing,
		},
	})
		.png()
		.toBuffer();

	return { input, left, top };
}

async function renderCard(lang: Locale): Promise<Buffer> {
	const card = content[lang];
	const portraitPath = join(process.cwd(), 'public', 'assets', 'portrait.jpg');
	const portrait = await sharp(readFileSync(portraitPath))
		.resize(240, 424, { fit: 'cover', position: 'centre' })
		.jpeg({ quality: 92 })
		.toBuffer();

	const textLeft = 84;
	const titleTop = 178;
	const titleLineHeight = Math.round(card.titleSize * 1.25);
	const lastTitleLine = card.title[card.title.length - 1];
	const cursorX =
		textLeft + Math.round(lastTitleLine.length * card.titleSize * GLYPH_ADVANCE) + 10;
	const cursorY = titleTop + titleLineHeight * (card.title.length - 1) + 6;
	const subtitleTop = titleTop + titleLineHeight * card.title.length + 28;
	const rolesTop = subtitleTop + 3 * 33 + 30;
	const siteName = 'leandromqrs.github.io';
	const siteNameLeft = 1136 - Math.round(siteName.length * 16 * GLYPH_ADVANCE);

	const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
		<rect width="${WIDTH}" height="${HEIGHT}" fill="${color.background}"/>
		<rect x="40.5" y="40.5" width="1119" height="549" fill="${color.card}" stroke="${color.border}"/>
		<rect x="41" y="41" width="1118" height="48" fill="${color.background}"/>
		<path d="M40 89.5h1120" stroke="${color.border}"/>
		<rect x="64" y="58" width="14" height="14" fill="${color.accent}"/>
		<rect x="86.500" y="58.500" width="13" height="13" fill="none" stroke="${color.square}"/>
		<rect x="108.500" y="58.500" width="13" height="13" fill="none" stroke="${color.square}"/>
		<rect x="${cursorX}" y="${cursorY}" width="${Math.round(card.titleSize * GLYPH_ADVANCE)}" height="${Math.round(card.titleSize * 0.95)}" fill="${color.accent}"/>
		<rect x="871.500" y="121.500" width="241" height="425" fill="none" stroke="${color.border}"/>
		<image href="data:image/jpeg;base64,${portrait.toString('base64')}" x="872" y="122" width="240" height="424"/>
		<rect x="872" y="122" width="240" height="424" fill="none" stroke="${color.accent}" stroke-opacity=".35"/>
	</svg>`);

	const subtitle = card.subtitle.join('\n');
	const roles = card.roles.map((role) => `[${role}]`).join(' ');

	const layers = await Promise.all([
		renderText(span('~/leandromqrs', color.muted), 16, 'regular', 140, 55),
		renderText(span(siteName, color.muted), 16, 'regular', siteNameLeft, 55),
		renderText(`${span('$', color.accent)} ${span('whoami', color.muted)}`, 24, 'regular', textLeft, 118),
		renderText(
			card.title.map((line) => span(line, color.text)).join('\n'),
			card.titleSize,
			'bold',
			textLeft,
			titleTop,
		),
		renderText(span(subtitle, color.muted), 22, 'regular', textLeft, subtitleTop, 8),
		renderText(span(roles, color.accent), 18, 'regular', textLeft, rolesTop),
	]);

	return sharp(svg).composite(layers).png({ compressionLevel: 9 }).toBuffer();
}

export const GET: APIRoute = async ({ props }) => {
	const card = await renderCard(props.lang as Locale);

	return new Response(new Uint8Array(card), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
