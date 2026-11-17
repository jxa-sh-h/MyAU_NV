import { academicSections, checkListTerms, circulationDetails, currentBalance, disciplineStatus, enrolledTerm, gradingRecords, ledgerEntries, notices, nonAcademicSections, otherPendingClearances, pages, periodicDues, subjects } from "../data/mockData.js";
import { useStudentProfile } from "../contexts/StudentProfileContext.jsx";
import { DataTable, PageHeading, Panel, SectionCards } from "../components/UI.jsx";

export function PageIntro({ page, children }) {
  return <PageHeading page={page}>{children}</PageHeading>;
}

export function usePortalData() {
  const { profile, subjects: activeSubjects, data = {} } = useStudentProfile();
  return {
    profile,
    subjects: activeSubjects ?? subjects,
    currentBalance: data.currentBalance ?? currentBalance,
    notices: data.notices ?? notices,
    circulationDetails: data.circulationDetails ?? circulationDetails,
    disciplineStatus: data.disciplineStatus ?? disciplineStatus,
    otherPendingClearances: data.otherPendingClearances ?? otherPendingClearances,
    gradingRecords: data.gradingRecords ?? gradingRecords,
    checkListTerms: data.checkListTerms ?? checkListTerms,
    enrolledTerm: data.enrolledTerm ?? enrolledTerm,
    ledgerEntries: data.ledgerEntries ?? ledgerEntries,
    ledgerTerms: data.ledgerTerms,
    periodicDues: data.periodicDues ?? periodicDues,
    academicSections: data.academicSections ?? academicSections,
    nonAcademicSections: data.nonAcademicSections ?? nonAcademicSections,
    fee: data.fee,
    submittedRequirements: data.submittedRequirements,
  };
}

export function Overview({ page, ids }) {
  return (
    <>
      <PageIntro page={page} />
      <SectionCards links={ids.map((id) => ({ id, title: pages[id].title, description: pages[id].description }))} />
    </>
  );
}

export function SimpleDataPage({ page, title, headers, rows, label, subtitle, searchable = false, sortable = false, note, after }) {
  return (
    <>
      <PageIntro page={page} />
      <Panel title={title} subtitle={subtitle}>
        <DataTable headers={headers} rows={rows} label={label} searchable={searchable} sortable={sortable} />
      </Panel>
      {after}
      {note && <p className="table-total">{note}</p>}
    </>
  );
}
