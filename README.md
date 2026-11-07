# MYAU — Modern Student Portal

MYAU is a responsive frontend capstone concept for Angeles University Foundation (AUF). It demonstrates student portal workflows using fictional data; it is not an official AUF service and does not connect to university systems.

## Features

- Responsive dashboard, collapsible sidebar, and routed student modules.
- Academic record search and sorting; class schedule filtering.
- Simulated enrollment, clearance submissions, profile editing, and payment previews.
- Library loan renewal previews and faculty evaluation records.
- Light/dark appearance and browser-local demo preferences.
- Form validation, accessible dialogs, success feedback, empty states, and mobile layouts.

## Technology

HTML5, CSS3, JavaScript ES modules, React, Vite, React Router, Bootstrap, and browser `localStorage`.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Create and preview a production build:

```sh
npm run build
npm run preview
```

Vite writes the static application to `dist/`. Configure a static host to rewrite module routes to `index.html` (for example, a Netlify `_redirects` rule of `/* /index.html 200`).

## Project structure

- `src/App.jsx` — client routes.
- `src/components/` — shared portal shell and reusable UI.
- `src/pages/` — dashboard and module pages.
- `src/data/mockData.js` — fictional student and module data.
- `src/hooks/useLocalStorage.js` — persistence for demonstration state.
- `css/styles.css`, `src/styles.css` — shared MYAU design system and React-specific responsive styles.
- `docs/` — UI foundation and capstone technical documentation.

## Submission material

- Technical report: [`docs/capstone-technical-documentation.md`](docs/capstone-technical-documentation.md)
- Browser-presentable slide deck: [`docs/capstone-presentation.html`](docs/capstone-presentation.html)
- Dashboard screenshots: [`docs/screenshots/`](docs/screenshots/)

## Demo data and privacy

The sample student identity and all academic, financial, and library records are fictional. Interactions are local simulations only. Do not enter real personal information, credentials, or payment details.
