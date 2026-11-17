# MYAU Student Portal

A responsive student portal for Angeles University Foundation.

## Technology

- HTML5, CSS3, and JavaScript (ES6+)
- React functional components and hooks
- Vite development server and production build
- React Router for the four standalone pages and hash-based portal sections
- Bootstrap CSS with the MYAU design system

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Build and preview the static site with:

```sh
npm run build
npm run preview
```

The root URL opens the sign-in screen. It validates the configured account and opens the student portal.

## Page structure

The portal sections all use `index.html` and are selected using its URL hash. The root login screen is a React route and does not add another HTML page. The standalone HTML pages are `pages/library.html`, `pages/faculty-evaluation.html`, and `pages/online-payment.html`. The former `pages/ebsco-database.html` entry point redirects to the combined Library page. Keep this structure unchanged unless a page or section change is explicitly requested.
