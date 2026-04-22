Border Crossing Dashboard (SD–TJ) — **operations-style border crossing dashboard** built with **Next.js (App Router) + TypeScript + Tailwind**.

## Getting Started

### Requirements

- **Node.js**: **18.17+** (recommended 20+)
- **npm**: any modern npm (project includes `package-lock.json`)

### Install + run

First, install dependencies:

```bash
npm install
```

Then run the dev server (configured for **port 3007**):

```bash
npm run dev
```

Open `http://localhost:3007`.

### Build + start (production-like)

```bash
npm run build
npm run start
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Environment variables

This project currently runs on **mock data** and does not require env vars. For future integrations, see:

- `.env.example`
- `lib/integrations/sourceAdapters.notes.ts`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
