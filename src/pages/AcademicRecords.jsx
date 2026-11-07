import { useMemo, useState } from "react";
import { subjects, student } from "../data/mockData.js";
import { DataTable, DemoNote, PageHeader, Panel, StatCard, StatusBadge } from "../components/UI.jsx";

export default function AcademicRecords() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("code");
  const filtered = useMemo(() => subjects
    .filter((subject) => `${subject.code} ${subject.name} ${subject.instructor}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "grade" ? b.grade - a.grade : a.code.localeCompare(b.code)), [query, sort]);
  const average = (subjects.reduce((total, subject) => total + subject.grade, 0) / subjects.length).toFixed(1);

  return (
    <>
      <PageHeader section="Academics" title="Academic Records" description="Review your grades, academic standing, and semester information." />
      <div className="summary-grid summary-grid-compact">
        <StatCard icon="check" label="Term average" value={average} detail="Midterm grades · demo" />
        <StatCard icon="book" label="Academic standing" value="Good standing" detail="No academic alerts" tone="blue" />
      </div>
      <Panel title="Semester information" subtitle={`${student.program} · ${student.yearLevel} · ${student.academicYear}`}>
        <div className="semester-details">
          <div><small>Current term</small><strong>First Semester</strong></div>
          <div><small>Academic year</small><strong>2026–2027</strong></div>
          <div><small>Enrolled load</small><strong>21 units</strong></div>
          <div><small>Grade status</small><strong><StatusBadge tone="warning">Midterm</StatusBadge></strong></div>
        </div>
      </Panel>
      <Panel title="Grades by subject" subtitle="Fictional midterm results for the current term." actions={
        <label className="filter-field compact-filter">Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort grades">
            <option value="code">Course code</option><option value="grade">Highest grade</option>
          </select>
        </label>
      }>
        <div className="table-tools"><label className="search-field"><span className="visually-hidden">Search academic records</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses or instructors" /></label></div>
        <DataTable label="Grades by subject" columns={[
          { key: "code", label: "Course" }, { key: "name", label: "Subject" }, { key: "units", label: "Units" },
          { key: "instructor", label: "Instructor" }, { key: "grade", label: "Midterm grade" },
          { key: "standing", label: "Standing", render: (row) => <StatusBadge>{row.grade >= 75 ? "Passing" : "Needs review"}</StatusBadge> },
        ]} rows={filtered} emptyMessage="No courses match your search." />
      </Panel>
      <DemoNote>Grades and standing are fictional, provided for frontend demonstration only.</DemoNote>
    </>
  );
}
