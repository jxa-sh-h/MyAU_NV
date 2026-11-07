import { useState } from "react";
import { subjects } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DataTable, DemoNote, Feedback, PageHeader, Panel, StatusBadge } from "../components/UI.jsx";

const ratings = [
  { value: "5", label: "5 · Excellent" },
  { value: "4", label: "4 · Very good" },
  { value: "3", label: "3 · Good" },
  { value: "2", label: "2 · Fair" },
  { value: "1", label: "1 · Needs improvement" },
];

export default function FacultyEvaluation() {
  const [evaluations, setEvaluations] = useLocalStorage("myau.evaluations", []);
  const [feedback, setFeedback] = useState("");

  function submitEvaluation(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const course = subjects.find(({ id }) => id === formData.get("course"));
    const rating = Number(formData.get("rating"));
    setEvaluations((current) => [{
      id: `evaluation-${Date.now()}`,
      date: new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date()),
      course: course.code,
      subject: course.name,
      instructor: course.instructor,
      rating,
      comment: String(formData.get("comment") ?? "").trim(),
    }, ...current]);
    event.currentTarget.reset();
    setFeedback("Your evaluation was saved in this browser for demonstration only.");
  }

  function removeEvaluation(id) {
    setEvaluations((current) => current.filter((entry) => entry.id !== id));
    setFeedback("The demo evaluation was removed from local browser data.");
  }

  return (
    <>
      <PageHeader section="University Services" title="Faculty Evaluation" description="Share course feedback in this demonstration evaluation." />
      <Feedback>{feedback}</Feedback>
      <Panel title="Course feedback" subtitle="Share constructive feedback about a class experience.">
        <form className="demo-form" onSubmit={submitEvaluation}>
          <label htmlFor="evaluation-course">Course</label>
          <select id="evaluation-course" name="course" required defaultValue="">
            <option value="" disabled>Select a course</option>
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.code} · {subject.name}</option>)}
          </select>
          <label htmlFor="evaluation-rating">Overall rating</label>
          <select id="evaluation-rating" name="rating" required defaultValue="">
            <option value="" disabled>Select a rating</option>
            {ratings.map((rating) => <option key={rating.value} value={rating.value}>{rating.label}</option>)}
          </select>
          <label htmlFor="evaluation-comment">Comments <span className="optional-label">(optional)</span></label>
          <textarea id="evaluation-comment" name="comment" rows="4" maxLength="500" placeholder="Share specific, constructive feedback." />
          <button className="button button-primary" type="submit">Save demo evaluation</button>
        </form>
      </Panel>
      <Panel title="Saved demo evaluations" subtitle="Entries are stored in local browser storage and can be removed.">
        <DataTable label="Saved faculty evaluations" columns={[
          { key: "date", label: "Date" }, { key: "course", label: "Course" }, { key: "instructor", label: "Instructor" },
          { key: "rating", label: "Rating", render: (row) => <StatusBadge>{row.rating} / 5</StatusBadge> },
          { key: "comment", label: "Comment", render: (row) => row.comment || <span className="muted-copy">No comment</span> },
          { key: "action", label: "Action", render: (row) => <button className="text-button danger" type="button" onClick={() => removeEvaluation(row.id)}>Remove</button> },
        ]} rows={evaluations} emptyMessage="No evaluations have been saved." />
      </Panel>
      <DemoNote>Evaluation responses are saved only in this browser. They are not sent to faculty or university systems.</DemoNote>
    </>
  );
}
