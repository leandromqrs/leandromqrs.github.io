<div align="center">
  <img src="public/favicon.svg" alt="" width="72" />

  # Leandro Rodrigues · Portfolio

  Personal website, project write-ups, technical articles and résumés.

  [Visit the website](https://leandromqrs.dev) · [English](https://leandromqrs.dev/en/) · [Português](https://leandromqrs.dev/pt-br/)
</div>

Built with [Astro](https://astro.build/) and TypeScript, the site is generated as static HTML and deployed to GitHub Pages. The interface and blog are available in English and Brazilian Portuguese; detailed Work pages currently share an English version.

## Getting started

Use Node.js 24 and npm, matching the deployment workflow.

```bash
git clone https://github.com/leandromqrs/leandromqrs.github.io.git
cd leandromqrs.github.io
npm ci
npm run dev
```

Open the local address printed by Astro. To build and preview the production site:

```bash
npm run build
npm run preview
```

The build compiles the translation messages and writes the static site to `dist/`.

## Content

- **Blog:** add matching Markdown files under `src/content/blog/en/` and `src/content/blog/pt-br/`, using the same filename for both languages. Frontmatter requires `title`, `description` and `publishDate`; `tag`, `img` and `img_alt` are optional.
- **Work:** add a Markdown file to `src/content/work/`. Frontmatter requires `title`, `company`, `description`, `publishDate`, `tags` and `img`; `img_alt` is optional. Work pages are served under `/work/`.
- **Images:** store public assets in `public/assets/blog/` or `public/assets/work/` and reference them from the site root, for example `/assets/blog/example.png`. Provide descriptive alt text when adding an image.
- **Profile and interface:** experience and profile data live in `src/data/profile.ts`; interface translations live in `messages/en.json` and `messages/pt-br.json`.

Content schemas are defined in `src/content.config.ts`. Markdown code fences support syntax highlighting and language labels. Mermaid fences are rendered in the browser using Mermaid from a CDN.

> [!NOTE]
> Review screenshots for personal information, credentials and client data before adding them to the public site. Mermaid diagrams need access to the CDN to render.

### Résumés

Edit `resume/resume.en.md` and `resume/resume.pt-br.md`, then regenerate the PDFs with:

```bash
npm run resume
```

The command writes the PDFs to `public/assets/`, where the site links to them. The résumé stylesheet and fonts are in `resume/`.

## Project structure

```text
src/pages/           Astro routes, including localized pages and Work details
src/components/      UI and article components
src/content/         Blog posts and Work entries
src/data/            Profile and experience data
src/styles/          Shared styles and theme variables
messages/            English and Brazilian Portuguese interface messages
public/              Static assets, images and generated résumé PDFs
resume/              Résumé sources, styles and fonts
project.inlang/      Translation project configuration
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site with Node.js 24 and deploys it to GitHub Pages. The workflow can also be started manually from GitHub Actions. The production domain is configured in `public/CNAME` and `astro.config.mjs`.
