import { useState } from "react";
import { pages } from "../data/mockData.js";
import { Panel } from "../components/UI.jsx";
import { Overview, PageIntro, SimpleDataPage, usePortalData } from "./PortalPageShared.jsx";

export function CheckListPage() {
  const [viewMode, setViewMode] = useState("table");
  const { profile, subjects: activeSubjects, checkListTerms: activeCheckListTerms } = usePortalData();
  const terms = profile.program === "BSCE"
    ? [
      { year: "1st Year", semester: "2nd Semester", requiredUnits: 24, creditedUnits: 24, courses: activeSubjects.slice(0, 4).map(([code, title, , units], index) => ({ code, title, units: Number(units), earnedUnits: Number(units), grade: 88 + index, status: "passed" })) },
      { year: "2nd Year", semester: "1st Semester", requiredUnits: 24, creditedUnits: 24, courses: activeSubjects.slice(4).map(([code, title, , units], index) => ({ code, title, units: Number(units), earnedUnits: Number(units), grade: 90 + index, status: "passed" })) },
    ]
    : activeCheckListTerms;
  const rowCount = Math.max(...terms.map(({ courses }) => courses.length));
  const statusLabels = {
    passed: "Passed",
    "credit-short": "Credit below required units",
    enrolled: "Currently enrolled",
    "no-credit": "No credit recorded",
  };

  return (
    <>
      <PageIntro page={pages["check-list"]} />
      <Panel title="Course progress by term" subtitle="Course sequence, required units, earned credits, and grades from the academic record.">
        <div className="checklist-toolbar">
          <span className="checklist-view-label">View format</span>
          <div className="checklist-view-toggle" role="group" aria-label="Course checklist view format">
            <button className={viewMode === "table" ? "is-active" : ""} type="button" aria-pressed={viewMode === "table"} onClick={() => setViewMode("table")}>Table</button>
            <button className={viewMode === "list" ? "is-active" : ""} type="button" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}>List</button>
          </div>
        </div>
        <div className="checklist-legend" aria-label="Course status legend">
          {Object.entries(statusLabels).map(([status, label]) => (
            <span className="checklist-legend-item" key={status}>
              <span className={`checklist-status-swatch status-${status}`} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
        {viewMode === "list" ? <div className="checklist-list" aria-label="Academic course checklist list">
          {terms.map((term) => <section className="checklist-list-term" key={`${term.year}-${term.semester}`}>
            <header><div><strong>{term.year} · {term.semester}</strong><span>Required {term.requiredUnits} · Credited {term.creditedUnits}</span></div></header>
            <div className="checklist-list-courses">{term.courses.map((course) => <article className={`checklist-list-course status-${course.status}`} key={`${term.year}-${term.semester}-${course.code}`}>
              <div><strong>{course.code}</strong><span>{course.title}</span></div><div className="checklist-list-meta"><span>{course.units} units{course.earnedUnits !== undefined && ` · ${course.earnedUnits} earned`}</span><b>{statusLabels[course.status]}</b>{course.grade !== undefined && <em>Grade {course.grade}</em>}</div>
            </article>)}</div>
          </section>)}
        </div> : <div className="checklist-scroll" role="region" aria-label="Academic course flowchart" tabIndex="0">
          <table className="checklist-table">
            <thead>
              <tr>
                <th className="checklist-number-heading" scope="col" rowSpan="2">#</th>
                {terms.filter((_, index) => index % 2 === 0).map(({ year }) => (
                  <th className="checklist-year-heading" scope="colgroup" colSpan="2" key={year}>{year}</th>
                ))}
              </tr>
              <tr>
                {terms.map((term, index) => (
                  <th className="checklist-term-heading" id={`checklist-term-${index + 1}`} scope="col" key={`${term.year}-${term.semester}`}>
                    <strong>{term.semester}</strong>
                    <span>Required {term.requiredUnits} · Credited {term.creditedUnits}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  <th className="checklist-row-number" scope="row">{rowIndex + 1}</th>
                  {terms.map((term, termIndex) => {
                    const course = term.courses[rowIndex];
                    if (!course) return <td className="checklist-empty-cell" key={`${termIndex}-${rowIndex}`} aria-hidden="true" />;
                    return (
                      <td className={`checklist-course-cell status-${course.status}`} headers={`checklist-term-${termIndex + 1}`} key={`${termIndex}-${course.code}`}>
                        <article className="checklist-course">
                          <strong className="checklist-course-code">{course.code}</strong>
                          <span className="checklist-course-title">{course.title}</span>
                          <span className="checklist-course-units">
                            {course.units} units
                            {course.earnedUnits !== undefined && ` · ${course.earnedUnits} earned`}
                          </span>
                          <span className="checklist-course-status">{statusLabels[course.status]}</span>
                          {course.grade !== undefined && <span className="checklist-course-grade">Grade {course.grade}</span>}
                        </article>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
        <p className="checklist-source-note">Course-level earned units and grades are shown only where the supplied academic record includes them.</p>
      </Panel>
    </>
  );
}

export function GradingPage() {
  const [examPeriod, setExamPeriod] = useState("Final");
  const [term, setTerm] = useState("2nd Semester");
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const { profile, subjects: activeSubjects, gradingRecords: activeGrades, checkListTerms: activeCheckListTerms } = usePortalData();
  const schoolYearLabel = schoolYear.replace("-", "–");
  const historicalYearLevel = schoolYear === "2024-2025" ? "1st Year" : schoolYear === "2025-2026" ? "2nd Year" : null;
  const historicalTerm = activeCheckListTerms.find((record) => record.year === historicalYearLevel && record.semester === term);
  const grades = historicalYearLevel && ["Midterm", "Final"].includes(examPeriod)
    ? (historicalTerm?.courses ?? []).filter((course) => course.grade !== undefined).map((course) => ({
      code: course.code,
      title: course.title,
      credit: course.units.toFixed(1),
      instructor: "—",
      grade: String(course.grade),
      remarks: course.status === "passed" ? "Passed" : "—",
      isEncoded: true,
    }))
    : schoolYear === "2026-2027" && term === "1st Semester"
      ? activeSubjects.map(([code, title, , credit]) => {
        const record = activeGrades.find((item) => item.code === code);
        const grade = examPeriod === "Midterm"
          ? record?.midtermGrade ?? "Not posted"
          : examPeriod === "Final"
            ? record?.finalGrade ?? "Not posted"
            : "Not posted";
        return {
          code,
          title,
          credit,
          instructor: record?.instructor ?? "Faculty member",
          grade,
          remarks: grade !== "Not posted" ? "Passed" : "—",
          isEncoded: grade !== "Not posted",
        };
      })
      : [];

  function updateExamPeriod(event) {
    setExamPeriod(event.target.value);
  }

  function updateTerm(event) {
    setTerm(event.target.value);
  }

  function updateSchoolYear(event) {
    setSchoolYear(event.target.value);
  }

  return (
    <>
      <PageIntro page={pages["grading-per-exam-period"]} />
      <section className="grading-page" aria-label="Grades by exam period">
        <h2 className="grading-title">Grades by exam period</h2>
        <dl className="grading-student-details">
          <div><dt>Student ID</dt><dd>{profile.id}</dd></div>
          <div><dt>Student name</dt><dd>{profile.name}</dd></div>
          <div><dt>Course/Major</dt><dd>{profile.program}</dd></div>
          <div><dt>Year</dt><dd>{profile.yearLevel}</dd></div>
        </dl>
        <div className="grading-controls">
          <label htmlFor="grading-exam-period">Show</label>
          <select id="grading-exam-period" value={examPeriod} onChange={updateExamPeriod}>
            <option>Prelim</option>
            <option>Midterm</option>
            <option>Final</option>
          </select>
          <label htmlFor="grading-term">Term:</label>
          <select id="grading-term" value={term} onChange={updateTerm}>
            <option>1st Semester</option>
            <option>2nd Semester</option>
            <option>Summer</option>
          </select>
          <div className="grading-school-year">
            <label htmlFor="grading-school-year">SY:</label>
            <select id="grading-school-year" value={schoolYear} onChange={updateSchoolYear}>
              <option value="2024-2025">2024–2025</option>
              <option value="2025-2026">2025–2026</option>
              <option value="2026-2027">2026–2027</option>
            </select>
          </div>
        </div>
        <section className="grading-results" aria-live="polite">
          <p className="grading-note">Gold-highlighted grades have not been verified by the registrar. “Not posted” means no grade is shown.</p>
          <h3>{examPeriod} Grades · {term} · {schoolYearLabel}</h3>
          {grades.length === 0 ? <p className="empty-state">No grade records are available for {term}, {schoolYearLabel}.</p> : <div className="grading-table-scroll" role="region" aria-label={`${examPeriod} grades for ${term}, ${schoolYear}`} tabIndex="0">
            <table className="grading-table">
              <thead>
                <tr>
                  <th scope="col">Subject Code</th>
                  <th scope="col">Subject Name</th>
                  <th scope="col">Credit</th>
                  <th scope="col">Instructor</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.code}>
                    <td>{grade.code}</td>
                    <td>{grade.title}</td>
                    <td>{grade.credit}</td>
                    <td>{grade.instructor}</td>
                    <td className={grade.isEncoded ? "grade-unverified" : "grade-not-encoded"}>{grade.grade}</td>
                    <td className={grade.isEncoded ? "grade-unverified" : "grade-not-encoded"}>{grade.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </section>
      </section>
    </>
  );
}

export function AcademicPage({ pageId }) {
  const { academicSections: activeAcademicSections, nonAcademicSections: activeNonAcademicSections } = usePortalData();
  if (pageId === "academic-performance") return <Overview page={pages[pageId]} ids={activeAcademicSections.map(({ id }) => id)} />;
  if (pageId === "non-acad-performance") return <Overview page={pages[pageId]} ids={activeNonAcademicSections.map(({ id }) => id)} />;
  if (pageId === "check-list") return <CheckListPage />;
  if (pageId === "grading-per-exam-period") return <GradingPage />;
  const item = [...activeAcademicSections, ...activeNonAcademicSections].find(({ id }) => id === pageId);
  return <SimpleDataPage page={pages[pageId]} title={item.title} subtitle={item.description} headers={["Item", "Details"]} rows={item.rows} label={item.title} />;
}
