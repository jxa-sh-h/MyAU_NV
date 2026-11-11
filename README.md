# MYAU Student Portal

A responsive frontend concept for a student portal at Angeles University Foundation. All student details and records are fictional. The app does not connect to AUF systems or process official enrollment, document submissions, evaluations, or payments.

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

The root URL opens the demo login screen. Submitting the form continues to the portal without credential checks.

## Page structure

The portal sections all use `index.html` and are selected using its URL hash. The root login screen is a React route and does not add another HTML page. The only other HTML pages are `pages/library.html`, `pages/ebsco-database.html`, `pages/faculty-evaluation.html`, and `pages/online-payment.html`. Keep this structure unchanged unless a page or section change is explicitly requested.

Mock submission metadata and evaluation previews are stored in the browser's local storage. No uploaded file contents or payment information are stored.
