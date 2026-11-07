# MYAU UI Foundation

## Project identity

- **Name:** MYAU (Modern Student Portal)
- **Institution:** Angeles University Foundation (AUF)
- **Purpose:** A frontend concept for student academics, enrollment, clearance, student accounts, and university services.
- Use fictional records and label all activity as a demonstration. The portal is not affiliated with or connected to AUF's production systems.

## Application layout

- **Header:** Persistent AUF-inspired blue brand bar with MYAU identity, announcements, profile shortcut, and responsive navigation controls.
- **Sidebar:** Teal-accented navigation with module groups, active states, and a compact fictional student summary.
- **Main content:** Shared page heading, reusable panels, summaries, accessible tables, feedback, and a clear demo disclaimer.
- **Modules:** Dashboard, Academic Records, Class Schedule, Enrollment, Clearance, Student Profile, Payments, Library, Faculty Evaluation, and Settings.

## Design system

The existing AUF-inspired palette and spacing tokens are retained in `css/styles.css`. React component-specific responsive, interaction, and dark-theme styles live in `src/styles.css`. Bootstrap supplies a small set of base styles/utilities; project components use the shared MYAU tokens and patterns.

Shared patterns include page headings, panels, status badges, data tables, statistics cards, form controls, feedback messages, and accessible dialogs. Use clear text with status colors, visible keyboard focus, readable table layouts, and reduced-motion preferences.

## Technology and architecture

- HTML5 entry point, CSS, and ES modules
- React functional components and hooks
- Vite development server and production bundler
- React Router client-side routes
- Bootstrap base stylesheet and utility classes
- `localStorage` for fictional enrollment, clearance, profile, payment, library, evaluation, and preference data

```text
MYAU/
├── index.html
├── package.json
├── vite.config.js
├── css/
│   └── styles.css
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components/
│   ├── data/
│   ├── hooks/
│   └── pages/
├── docs/
│   ├── ui-foundation.md
│   └── capstone-technical-documentation.md
└── README.md
```

Keep route definitions in `src/App.jsx`, shared shell and navigation in `src/components/AppLayout.jsx`, mock records in `src/data/mockData.js`, and persistence behavior in `src/hooks/useLocalStorage.js`. Place each portal module in its own page component.

## Responsive standards

- Desktop: persistent collapsible sidebar and flexible content region.
- Tablet/mobile: navigation becomes an overlay drawer with a scrim and close action; layout and tables adapt to narrow viewports.
- Avoid horizontal page overflow. Wrap dense data tables in labeled, horizontally scrollable regions.
- Support keyboard navigation, labeled form controls, accessible dialog states, visible focus, and reduced motion.

## Implementation and verification

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Implement a module with shared components and fictional data.
4. Validate routes, controls, forms, persisted data, responsive behavior, and accessibility.
5. Run `npm run build` before static deployment.
6. Deploy the Vite `dist/` output to a static host configured to serve `index.html` for client-side routes.
