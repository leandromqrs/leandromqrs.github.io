import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

type Locale = 'en' | 'pt-br';

interface CardContent {
	title: string[];
	subtitle: string[];
	roles: string[];
}

const content: Record<Locale, CardContent> = {
	en: {
		title: ['I turn technology', 'into competitive', 'advantage.'],
		subtitle: [
			'I build scalable products that accelerate operations,',
			'reduce risk, and prepare businesses',
			'to grow with AI.',
		],
		roles: ['Developer', 'System Architect', 'DevOps & CI/CD'],
	},
	'pt-br': {
		title: ['Transformo', 'tecnologia em', 'vantagem', 'competitiva.'],
		subtitle: [
			'Crio produtos digitais escaláveis',
			'que aceleram operações, reduzem riscos',
			'e preparam negócios para crescer com IA.',
		],
		roles: ['Desenvolvedor', 'Arquiteto de Sistemas', 'DevOps & CI/CD'],
	},
};

export const getStaticPaths: GetStaticPaths = () =>
	(Object.keys(content) as Locale[]).map((lang) => ({
		params: { lang },
		props: { lang },
	}));

function escapeXml(value: string): string {
	return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function roleIcon(index: number): string {
	if (index === 0) return '<path d="M11 3 3 11l8 8M21 3l8 8-8 8M18 1l-4 20"/>';
	if (index === 1) {
		return '<rect x="2" y="2" width="28" height="20" rx="3"/><path d="m7 8 4 4-4 4M16 16h8"/>';
	}
	return '<path d="M6 16c-2 4-6 5-6 5s1-4 5-6M25 3c-7 0-13 4-17 11l7 7c7-4 11-10 11-17zM17 19v6l-5 5-2-8M10 12H4l-4 5 8 2"/>';
}

async function renderCard(lang: Locale): Promise<Buffer> {
	const card = content[lang];
	const portraitPath = join(process.cwd(), 'public', 'assets', 'portrait.jpg');
	const portrait = await sharp(readFileSync(portraitPath))
		.resize(266, 474, { fit: 'cover', position: 'centre' })
		.jpeg({ quality: 92 })
		.toBuffer();

	const titleSize = lang === 'pt-br' ? 52 : 56;
	const titleLineHeight = lang === 'pt-br' ? 59 : 64;
	const titleY = lang === 'pt-br' ? 118 : 130;
	const subtitleY = lang === 'pt-br' ? 354 : 328;
	const pillY = lang === 'pt-br' ? 496 : 486;
	const title = card.title
		.map(
			(line, index) =>
				`<tspan x="72" dy="${index === 0 ? 0 : titleLineHeight}">${escapeXml(line)}</tspan>`,
		)
		.join('');
	const subtitle = card.subtitle
		.map((line, index) => `<tspan x="72" dy="${index === 0 ? 0 : 39}">${escapeXml(line)}</tspan>`)
		.join('');

	const widths = card.roles.map(() => 232);
	const pillGap = 12;
	const contentLeft = 72;
	const contentRight = 820;
	const totalPillWidth = widths.reduce((total, width) => total + width, 0) + pillGap * 2;
	if (totalPillWidth > contentRight - contentLeft) {
		throw new Error(`Social-card pills exceed the safe content area for ${lang}`);
	}

	let pillX = contentLeft;
	const pills = card.roles
		.map((role, index) => {
			const width = widths[index];
			const iconY = index === 2 ? 15.5 : 19;
			const pill = `<g transform="translate(${pillX} ${pillY})">
				<rect width="${width}" height="56" rx="28" fill="#4c7cd6"/>
				<g transform="translate(16 ${iconY}) scale(.82)" fill="none" stroke="#eef3ff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">${roleIcon(index)}</g>
				<text x="50" y="29" class="pill">${escapeXml(role)}</text>
			</g>`;
			pillX += width + pillGap;
			return pill;
		})
		.join('');

	const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
		<defs>
			<clipPath id="portrait"><rect x="886" y="78" width="266" height="474" rx="25"/></clipPath>
			<clipPath id="pillSafeArea"><rect x="64" y="478" width="764" height="82"/></clipPath>
			<linearGradient id="portraitShade" x1="0" y1="0" x2="0" y2="1"><stop offset="72%" stop-color="#090b11" stop-opacity="0"/><stop offset="100%" stop-color="#090b11" stop-opacity=".2"/></linearGradient>
			<filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000" flood-opacity=".28"/></filter>
			<style>
				.title { font-family: Inter, 'Fira Sans', sans-serif; font-size: ${titleSize}px; font-weight: 700; letter-spacing: -1.6px; fill: #f8f9ff; }
				.subtitle { font-family: Inter, 'Fira Sans', sans-serif; font-size: 29px; font-weight: 450; fill: #cbd3e7; }
				.pill { font-family: Inter, 'Fira Sans', sans-serif; font-size: 18px; font-weight: 550; dominant-baseline: middle; fill: #f8f9ff; }
			</style>
		</defs>
		<rect width="1200" height="630" fill="#090b11"/>
		<path d="M0 1h1200M0 629h1200" stroke="#1b2131"/>
		<circle cx="818" cy="118" r="185" fill="#4c7cd6" opacity=".055"/>
		<circle cx="1055" cy="530" r="240" fill="#4c7cd6" opacity=".035"/>
		<text x="72" y="${titleY}" class="title">${title}</text>
		<text x="72" y="${subtitleY}" class="subtitle">${subtitle}</text>
		<g clip-path="url(#pillSafeArea)">${pills}</g>
		<g filter="url(#shadow)">
			<rect x="884" y="76" width="270" height="478" rx="27" fill="#141925" stroke="#34415f" stroke-width="2"/>
			<image href="data:image/jpeg;base64,${portrait.toString('base64')}" x="886" y="78" width="266" height="474" clip-path="url(#portrait)"/>
			<rect x="886" y="78" width="266" height="474" rx="25" fill="url(#portraitShade)"/>
		</g>
	</svg>`);

	return sharp(svg).png({ compressionLevel: 9 }).toBuffer();
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
