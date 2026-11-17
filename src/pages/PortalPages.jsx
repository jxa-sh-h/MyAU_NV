import { academicSections, nonAcademicSections, pages } from "../data/mockData.js";
import { Dashboard, ClearancePage } from "./PortalDashboardPages.jsx";
import { AcademicPage } from "./PortalAcademicPages.jsx";
import { EnrollmentPage, PersonalContent } from "./EnrollmentPages.jsx";
import { DocumentsContent, FacultyEvaluation, LibraryContent } from "./PortalResourcePages.jsx";
import { PaymentPage } from "./PaymentPage.jsx";
import { PageIntro } from "./PortalPageShared.jsx";

export default function PortalPage({ pageId }) {
  if (pageId === "dashboard") return <Dashboard />;
  if (pageId === "student-clearance") return <ClearancePage />;
  if (["enrollment", "subjects-enrolled", "fees-paid-during-enrollment", "submit-admission-requirement", "student-account", "ledger", "periodic-dues"].includes(pageId)) return <EnrollmentPage pageId={pageId} />;
  if (["academic-performance", "non-acad-performance", ...academicSections.map(({ id }) => id), ...nonAcademicSections.map(({ id }) => id)].includes(pageId)) return <AcademicPage pageId={pageId} />;
  if (["personal-information", "view-personal-info", "edit-personal-info", "print-personal-info", "change-password"].includes(pageId)) return <PersonalContent pageId={pageId} />;
  if (pageId === "documents") return <DocumentsContent />;
  if (pageId === "library") return <LibraryContent />;
  if (pageId === "faculty-evaluation") return <FacultyEvaluation />;
  if (pageId === "online-payment") return <PaymentPage />;
  return <PageIntro page={pages[pageId]} />;
}
