# MYAU UI Foundation

## Project identity

- **Name:** MYAU
- **Institution:** Angeles University Foundation (AUF)
- **Purpose:** A student portal for academic information, enrollment, clearance, student accounts, and university services.
- Preserve familiar academic terms, page names, navigation hierarchy, and essential student workflows. Use appropriate AUF identity assets only when they are available and permitted; do not imply this demonstration is an official AUF service.
- Use fictional student records and mock data. Clearly identify enrollment actions, document submissions, and payment-related information as simulations; they do not contact university systems or process payments.

## Application layout

- **Header:** Persistent blue university-branded header with AUF identity and MYAU name. Keep branding legible and provide a menu control on narrow screens.
- **Sidebar:** Teal-accented navigation with expandable groups, clear active and keyboard-focus states, and fictional student identification. Keep labels and hierarchy familiar:
  - Dashboard
  - Student Clearance
  - Enrollment: Subjects Enrolled, Online Advising, Fees Paid During Enrollment, Submit Admission Requirement
  - Student Account: Ledger, Periodic Dues
  - Academic Performance: Check List, Awards/Achievements, Field Work Profile/OJT, Grading Per Exam Period
- **Main content:** Spacious, readable page heading, concise supporting information, and well-organized sections. Use the same shell and content spacing across pages.
- **Dashboard:** Begin with a restrained promotional banner or carousel, then organize clearance notices, AUF email guidance, MyCLASS/Canvas LMS information, and academic interventions into scannable sections.
- **Student Clearance:** Present student and academic-term information, followed by three distinct tables for current balance/status, library circulation details, and other pending clearance requirements.
- Use responsive, semantic tables for schedules, fees, and account records. Present Check List as a numbered, term-by-term course matrix with readable completion labels; on small screens, keep dense tables within labeled horizontal-scroll regions rather than overflowing the page.

## Design system

- Use a compact token set in CSS custom properties for the bright AUF-inspired blue header, teal navigation, pale blue sidebar, restrained gold accents, neutral surfaces, text, status colors, spacing, typography, borders, radii, and focus rings. Verify contrast for text and interactive controls.
- Choose a readable system-font stack; establish consistent heading, body, caption, and numeric styles. Align financial totals and dates for quick scanning.
- Reuse a small set of patterns: cards, buttons, badges, form fields, dialogs, notices, and tables. Prefer clear borders and restrained shadows over decorative gradients or oversized cards.
- Communicate requirement and transaction states with text and color; do not rely on color alone. Make deadlines, balances, and action outcomes visually distinct.
- Provide visible keyboard focus, semantic labels, accessible names for icon-only controls, sensible heading order, and reduced-motion-aware transitions. Interactions should have clear hover, focus, disabled, and error states.

## Technology and structure

Use semantic HTML5, CSS3, and JavaScript (ES6+) with React functional components and hooks. Vite provides the development server and production build; React Router handles the four standalone page URLs and the portal's hash-based sections. Bootstrap is included as the CSS component framework alongside the project's AUF-inspired design tokens and custom styles. Use Git and GitHub for version control. Keep mock content separate from presentation, persist only demonstration data in browser local storage, and do not connect to a real backend or payment service.

Proposed structure (introduce files as needed rather than building every page up front):

```text
MYAU/
├── index.html
├── pages/
│   ├── library.html
│   ├── ebsco-database.html
│   ├── faculty-evaluation.html
│   └── online-payment.html
├── css/
│   └── styles.css
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── Icon.jsx
│   │   └── UI.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   └── PortalPages.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── docs/
│   └── ui-foundation.md
└── tests/
```

Dashboard, Student Clearance, Enrollment and its children, Student Account and its children, Academic Performance and its child sections, Non-Acad Performance and its child sections, Discipline Monitoring, and Personal Information and its child sections are hash-routed sections in `index.html`. Only Library, EBSCO Database, Faculty Evaluation, and Online Payment have separate HTML files. This page/section structure is fixed unless explicitly changed. Shared navigation, student information, layout, and styles are reused; navigation metadata and fictional sample records live in `src/data/mockData.js`.

## Reusable component strategy

Build the shared header, responsive navigation, page heading, card/notice, status badge, button, form control, feedback, and searchable/sortable table patterns as React components. Components should accept their content and state rather than embed page-specific mock records. Centralize navigation labels and page metadata so desktop and mobile menus stay consistent. Validate forms inline and make simulated submissions explicit. Use hooks for navigation state, loading/feedback, and browser-local mock data.

## Responsive standards

- Use a mobile-first layout with content that reflows cleanly at phone, tablet, and desktop widths; avoid fixed page widths.
- At narrow widths, replace the sidebar with a keyboard-operable navigation drawer. Support open/close controls, Escape dismissal, and returning focus to the trigger.
- Keep touch targets comfortably usable, prevent horizontal page overflow, and constrain long content without clipping.
- Make dense tables usable in a labeled horizontal-scroll region on small screens; keep headings and row labels understandable and preserve readable cell spacing.
- Check representative small, medium, and wide viewports, keyboard-only navigation, and zoomed text during testing.

## Recommended implementation sequence

1. Install dependencies and run the Vite development server; maintain the fixed page/section structure.
2. Keep design tokens, typography, accessibility rules, and the responsive application shell consistent.
3. Use shared React components and hooks for navigation, forms, tables, feedback, and browser-local demo data.
4. Verify each navigation destination, form validation, sorting/search, loading and empty states, and mobile interactions.
5. Run the production Vite build and test the generated standalone HTML pages and portal hash routes.
6. Deploy the static frontend to a suitable host and verify its generated assets and routes.

## Functional standards

- Every control must perform its labeled action or be omitted; provide accessible status feedback for demo actions.
- Use local storage only for fictional client-side submissions and allow users to remove or clear saved demo records.
- Never persist uploaded file contents, request payment credentials, or imply official enrollment, document, payment, or faculty-evaluation operations.
- Show loading feedback during simulated asynchronous actions and useful empty states where a list can be empty.
