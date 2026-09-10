# Founders Inflections

A weekly technology and SaaS reading file for prospective founders, with permanent issue pages, a chronological archive, original-source links, and downloadable Word editions.

## Website

Import this repository into Vercel. The checked-in configuration builds the static site with Node and publishes `dist`. No environment variables are needed for the website. Every successful production deployment includes all archived issues.

## Local development

Use Node 22.13 or newer. Run `npm run dev` for a local preview, `npm run build` for the production site, and `npm test` for archive checks. No package installation is required.

## Adding an issue

The source of truth is `content/YYYY-MM-DD.json`. Add its matching Word edition to `public/downloads/YYYY-MM-DD.docx`. Alternatively, use `node scripts/import-newsletter.mjs ISSUE.md ISSUE.docx "Editorial issue title"` to import a completed issue. Build and test before publishing. Preserve existing dates and files.

Editorial requirements are in [editorial.md](editorial.md), including one or two stories accessible to nontechnical readers and primary-source verification.

## Cloud publishing setup status

The website and build checks are ready. Weekly research and automatic issue generation are not yet enabled. They require an OpenAI API account and a repository Actions secret named `OPENAI_API_KEY`, followed by implementation and a successful end-to-end trial. Never place this key in site files or Git history.

The target schedule is Monday at 8 a.m. America/Indiana/Indianapolis. The existing local newsletter automation remains separate until the cloud workflow has been verified and the handover is complete.
