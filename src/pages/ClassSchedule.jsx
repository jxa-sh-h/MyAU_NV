import { useMemo, useState } from "react";
import { subjects } from "../data/mockData.js";
import { DataTable, DemoNote, PageHeader, Panel } from "../components/UI.jsx";

const days = ["All days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ClassSchedule() {
  const [day, setDay] = useState("All days");
  const [query, setQuery] = useState("");
  const classes = useMemo(() => subjects
    .filter((subject) => (day === "All days" || subject.days.includes(day)))
    .filter((subject) => `${subject.code} ${subject.name} ${subject.room} ${subject.instructor}`.toLowerCase().includes(query.toLowerCase()))
    .map((subject) => ({ ...subject, day: subject.days })), [day, query]);

  return (
    <>
      <PageHeader section="Academics" title="Class Schedule" description="Your weekly class schedule and assigned learning spaces." />
      <Panel title="Weekly schedule" subtitle="First Semester · AY 2026–2027" actions={
        <label className="filter-field compact-filter">Day
          <select value={day} onChange={(event) => setDay(event.target.value)} aria-label="Filter by day">
            {days.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      }>
        <div className="table-tools"><label className="search-field"><span className="visually-hidden">Search schedule</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search course, room, or instructor" /></label></div>
        <DataTable label="Weekly class schedule" columns={[
          { key: "days", label: "Day" }, { key: "time", label: "Time" }, { key: "code", label: "Course" },
          { key: "name", label: "Subject" }, { key: "room", label: "Room" }, { key: "instructor", label: "Instructor" },
        ]} rows={classes} emptyMessage="No classes match these filters." />
      </Panel>
      <DemoNote>Class times, rooms, and instructor names are fictional.</DemoNote>
    </>
  );
}
