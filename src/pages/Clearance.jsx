import { useState } from "react";
import { initialClearance } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DataTable, DemoNote, Feedback, PageHeader, Panel, StatCard, StatusBadge } from "../components/UI.jsx";

export default function Clearance() {
  const [requirements, setRequirements] = useLocalStorage("myau.clearance", initialClearance);
  const [feedback, setFeedback] = useState("");
  const cleared = requirements.filter(({ status }) => status === "Cleared").length;
  const remaining = requirements.length - cleared;

  function updateRequirement(id) {
    const requirement = requirements.find((item) => item.id === id);
    const status = requirement.status === "Action needed" ? "Submitted for review" : "Action needed";
    setRequirements((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setFeedback(`${requirement.office}: status updated to "${status}" for this demo.`);
  }

  return (
    <>
      <PageHeader section="Student Services" title="Clearance" description="Track demonstration clearance requirements by university office." />
      <div className="summary-grid summary-grid-compact">
        <StatCard icon="check" label="Requirements cleared" value={`${cleared} of ${requirements.length}`} detail="Current demonstration status" />
        <StatCard icon="calendar" label="Needs attention" value={`${remaining} items`} detail="Review requirements below" tone="amber" />
      </div>
      <Feedback>{feedback}</Feedback>
      <Panel title="Clearance requirements" subtitle="Student 24-1661-908 · FS, 2026-27">
        <DataTable label="Student clearance requirements" columns={[
          { key: "office", label: "Office" }, { key: "requirement", label: "Requirement" },
          { key: "status", label: "Status", render: (row) => <StatusBadge tone={row.status === "Cleared" ? "success" : row.status === "Action needed" ? "warning" : "neutral"}>{row.status}</StatusBadge> },
          { key: "action", label: "Demo action", render: (row) => row.status === "Cleared" ? <span className="muted-copy">No action needed</span> : <button className="text-button" type="button" onClick={() => updateRequirement(row.id)}>{row.status === "Action needed" ? "Submit for review" : "Undo submission"}</button> },
        ]} rows={requirements} />
      </Panel>
      <DemoNote>Requirement statuses and submissions are mock data. Submissions are not sent to university offices.</DemoNote>
    </>
  );
}
