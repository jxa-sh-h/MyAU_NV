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

## Source organization

- `src/App.jsx` defines the login, hash-based portal, and standalone routes. `src/data/routes.js` shares route resolution between the router and sidebar.
- `src/pages/PortalPages.jsx` dispatches portal sections to feature modules: dashboard, academic, enrollment, resources, and payment.
- `src/pages/PortalPageShared.jsx` contains shared portal data and page helpers; reusable UI primitives live in `src/components/`.
- `src/hooks/useActiveStudentAccount.js` resolves the current demo account and profile. `useLocalStorage` and `useSessionStorage` share their persistence implementation through `useStorageState`.
- Fictional records and navigation metadata remain in `src/data/`.

## Page structure

The portal sections all use `index.html` and are selected using its URL hash. The root login screen is a React route and does not add another HTML page. The standalone HTML pages are `pages/documents.html`, `pages/library.html`, `pages/faculty-evaluation.html`, and `pages/online-payment.html`. The former `pages/ebsco-database.html` entry point redirects to the combined Library page. Keep this structure unchanged unless a page or section change is explicitly requested.
