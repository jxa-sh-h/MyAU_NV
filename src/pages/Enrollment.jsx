import { useMemo, useState } from "react";
import { availableSubjects, formatPeso, subjects } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DataTable, DemoNote, Feedback, Modal, PageHeader, Panel, StatusBadge } from "../components/UI.jsx";
import Icon from "../components/Icon.jsx";

export default function Enrollment() {
  const [enrolledIds, setEnrolledIds] = useLocalStorage("myau.enrolledSubjectIds", subjects.map(({ id }) => id));
  const [query, setQuery] = useState("");
  const [action, setAction] = useState(null);
  const [feedback, setFeedback] = useState("");
  const enrolled = [...subjects, ...availableSubjects].filter(({ id }) => enrolledIds.includes(id));
  const available = useMemo(() => availableSubjects
    .filter(({ id }) => !enrolledIds.includes(id))
    .filter((subject) => `${subject.code} ${subject.name}`.toLowerCase().includes(query.toLowerCase())), [enrolledIds, query]);
  const units = enrolled.reduce((sum, subject) => sum + subject.units, 0);

  function confirmAction() {
    if (!action) return;
    if (action.type === "add") {
      setEnrolledIds((current) => [...current, action.subject.id]);
      setFeedback(`${action.subject.code} was added to this demonstration enrollment.`);
    } else {
      setEnrolledIds((current) => current.filter((id) => id !== action.subject.id));
      setFeedback(`${action.subject.code} was removed from this demonstration enrollment.`);
    }
    setAction(null);
  }

  return (
    <>
      <PageHeader section="Student Services" title="Enrollment" description="Review your registered load or explore simulated course offerings." actions={<span className="load-indicator">{enrolled.length} subjects · {units} units</span>} />
      <Feedback>{feedback}</Feedback>
      <Panel title="My enrolled subjects" subtitle="Current registered load in this local demo.">
        <DataTable label="Enrolled subjects" columns={[
          { key: "code", label: "Course" }, { key: "name", label: "Subject" }, { key: "units", label: "Units" },
          { key: "days", label: "Schedule" }, { key: "status", label: "Status", render: () => <StatusBadge>Enrolled</StatusBadge> },
          { key: "action", label: "Action", render: (row) => <button className="text-button danger" type="button" onClick={() => setAction({ type: "remove", subject: row })}>Drop demo course</button> },
        ]} rows={enrolled} emptyMessage="No courses are currently enrolled." />
      </Panel>
      <Panel title="Available subjects" subtitle="Adding a subject only changes this browser's mock enrollment." actions={<span className="badge badge-neutral">{available.length} offerings</span>}>
        <div className="table-tools"><label className="search-field"><span className="visually-hidden">Search available courses</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search course or subject" /></label></div>
        <DataTable label="Available subjects" columns={[
          { key: "code", label: "Course" }, { key: "name", label: "Subject" }, { key: "units", label: "Units" },
          { key: "days", label: "Meeting days" }, { key: "time", label: "Time" },
          { key: "action", label: "Action", render: (row) => <button className="button button-secondary button-small" type="button" onClick={() => { setFeedback(""); setAction({ type: "add", subject: row }); }}><Icon name="plus" /> Enroll</button> },
        ]} rows={available} emptyMessage="No available subjects match your search." />
      </Panel>
      <p className="table-total">Estimated tuition <strong>{formatPeso(units * 2100)}</strong><span> · mock estimate</span></p>
      <DemoNote>Enrollment actions are simulated locally and do not register courses with Angeles University Foundation.</DemoNote>
      {action ? (
        <Modal title={`${action.type === "add" ? "Add" : "Drop"} ${action.subject.code}?`} description={action.subject.name} onClose={() => setAction(null)}>
          <p className="panel-copy">This updates only the demonstration enrollment stored in this browser. No official enrollment action will occur.</p>
          <div className="dialog-actions">
            <button type="button" className="button button-secondary" onClick={() => setAction(null)}>Cancel</button>
            <button type="button" className="button button-primary" onClick={confirmAction}>Confirm demo action</button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
