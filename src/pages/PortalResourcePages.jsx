import { Fragment, useRef, useState } from "react";
import { pages } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import Icon from "../components/Icon.jsx";
import { Feedback, Panel } from "../components/UI.jsx";
import { PageIntro, usePortalData } from "./PortalPageShared.jsx";
import { feePaymentSubjects } from "./EnrollmentPages.jsx";

export function LibraryContent() {
  return (
    <>
      <PageIntro page={pages.library} />
      <Panel title="Library services">
        <p className="panel-copy">Explore library resources and research databases. Access to licensed resources may require your AUF credentials.</p>
      </Panel>
      <Panel title="EBSCO research database">
        <p className="panel-copy">Search scholarly journals, articles, and other academic resources through EBSCOhost.</p>
        <a className="button button-primary" href="https://search.ebscohost.com/" target="_blank" rel="noopener noreferrer">Open EBSCO Database <Icon name="arrow" /></a>
      </Panel>
    </>
  );
}

export const documentSections = [
  {
    title: "Guides",
    documents: [
      { name: "Payment Guide", description: "Instructions for reviewing payment options and completing student account payments.", file: "/payment_instruction.pdf" },
    ],
  },
  {
    title: "Manuals",
    documents: [
      { name: "AUF College Student Handbook", description: "Angeles University Foundation College Student Handbook, 2026 edition.", file: "/AUF%20COLLEGE%20STUDENT%20HANDBOOK%202026-FINAL%20DIGITAL%20COPY.pdf" },
    ],
  },
  {
    title: "Forms",
    documents: [
      { name: "Incomplete Grades Form", description: "Form to be accomplished for incomplete grades.", file: "/documents/incomplete-grades-form-placeholder.html" },
      { name: "Load Revision Form", description: "Form to be accomplished for load revision.", file: "/documents/load-revision-form-placeholder.html" },
      { name: "Transfer Form", description: "Form to be accomplished for transferring.", file: "/documents/transfer-form-placeholder.html" },
    ],
  },
];

export function DocumentsContent() {
  const [previewFile, setPreviewFile] = useState(null);

  return (
    <>
      <PageIntro page={pages.documents} />
      {documentSections.map(({ title, documents }) => (
        <Panel key={title} title={title}>
          <div className="table-scroll">
            <table className="documents-table">
              <thead>
                <tr><th scope="col">Name</th><th scope="col">Description</th><th scope="col">Actions</th></tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <Fragment key={document.name}>
                    <tr>
                      <td><strong>{document.name}</strong></td>
                      <td>{document.description}</td>
                      <td className="documents-actions">
                        <button className="text-button" type="button" aria-expanded={previewFile === document.file} onClick={() => setPreviewFile((current) => current === document.file ? null : document.file)}>
                          {previewFile === document.file ? "Hide preview" : "Preview"}
                        </button>
                        <a className="text-button" href={document.file} download>Download</a>
                      </td>
                    </tr>
                    {previewFile === document.file && (
                      <tr>
                        <td className="documents-preview-cell" colSpan="3">
                          <iframe className="documents-preview" src={document.file} title={`${document.name} preview`} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ))}
    </>
  );
}

export const evaluationSections = [
  { title: "Instructional Management", questions: [
    "Our instructor informs us of the session objectives.", "Our instructor discusses lessons in a systematic and coherent manner.", "Our instructor provides opportunities for active participation in class.", "Our instructor asks relevant questions about the lesson.", "Our instructor responds to questions and comments by clarifying or summarizing the key points.", "Our instructor uses relevant and engaging materials and resources.", "Our instructor uses real-life examples when appropriate.", "Our instructor connects the current lesson to previous lessons or other courses.", "Our instructor uses assessments that let us demonstrate our understanding and application of course content.", "Our instructor gives us a reasonable amount of time to complete tasks.", "Our instructor uses English as the language of instruction.", "Our instructor sustains our attention and interest in lessons.", "Our instructor designs learning activities that encourage curiosity.", "Our instructor designs learning activities that stimulate critical thinking.", "Our instructor makes effective use of resources and tools for the course format (online, hybrid, or in person).", "Our instructor uses varied materials and strategies in course discussions (for example, videos, demonstrations, lectures, podcasts, and group work).", "Our instructor publishes course modules on time.", "Our instructor provides meaningful, constructive feedback within a reasonable time.",
  ] },
  { title: "Classroom Management", questions: ["Our instructor begins and ends the class on time.", "Our instructor ends the class with the AUF prayer.", "Our instructor ensures that teaching and learning tools are readily available for the class.", "Our instructor effectively addresses disruptive behaviors whenever they arise in our class."] },
  { title: "Positive Learning Environment", questions: ["Our instructor acknowledges our positive contributions to learning.", "Our instructor is available during their stated consultation hours.", "Our instructor responds to student messages and questions within a reasonable time during office hours.", "Our instructor allows us to make up missed requirements when we provide a valid reason.", "Our instructor comes to class well-groomed.", "Our instructor treats students with respect.", "Our instructor is approachable and accommodating."] },
];

export function FacultyEvaluation() {
  const { profile, subjects: activeSubjects, gradingRecords: activeGrades } = usePortalData();
  const [evaluations, setEvaluations] = useLocalStorage(`myau-faculty-evaluations-${profile.id}`, []);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const evaluationFormRef = useRef(null);

  function chooseFaculty(code, title) {
    setSelectedFaculty({ code, title, faculty: activeGrades.find((record) => record.code === code)?.instructor ?? "Faculty member", schedule: feePaymentSubjects.find(([subjectCode]) => subjectCode === code)?.[2] ?? "Assigned schedule" });
    setFeedback("");
    window.requestAnimationFrame(() => {
      evaluationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      evaluationFormRef.current?.querySelector('input[type="radio"]')?.focus({ preventScroll: true });
    });
  }

  function submitEvaluation(event) {
    event.preventDefault();
    if (!selectedFaculty) return;
    const form = event.currentTarget;
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setEvaluations((items) => [...items, { id: Date.now(), course: selectedFaculty.code, faculty: selectedFaculty.faculty, submittedAt: new Date().toLocaleString() }]);
    setFeedback("Your evaluation has been saved on this device. It has not been sent to AUF.");
      form.reset();
      setLoading(false);
    }, 400);
  }

  let questionNumber = 0;
  return (
    <>
      <PageIntro page={pages["faculty-evaluation"]} />
      <section className="faculty-list" aria-label="Faculty teaching currently enrolled subjects">
        <h2 className="faculty-list-title">Faculty for your enrolled subjects</h2>
        <div className="faculty-card-grid">
          {activeSubjects.map(([code, title]) => (
            <article className="faculty-card" key={code}>
              <div className="faculty-photo-placeholder" role="img" aria-label="Faculty photo placeholder"><Icon name="user" /><span>Faculty</span></div>
              <div className="faculty-card-details"><h3>{activeGrades.find((record) => record.code === code)?.instructor ?? "Faculty member"}</h3><p className="faculty-subject-code">{code}</p><p className="faculty-subject-title">{title}</p><button className="button button-secondary faculty-evaluate-button" type="button" onClick={() => chooseFaculty(code, title)}>Evaluate this faculty</button></div>
            </article>
          ))}
        </div>
      </section>
      <section className="faculty-evaluation-form" ref={evaluationFormRef} aria-labelledby="faculty-evaluation-form-title">
        <header className="faculty-evaluation-header"><h2 id="faculty-evaluation-form-title">Faculty teaching performance evaluation</h2><p>Rate each statement from 1 (Strongly disagree) to 5 (Strongly agree).</p></header>
        {selectedFaculty ? <>
          <dl className="evaluation-context"><div><dt>Faculty</dt><dd>{selectedFaculty.faculty}</dd></div><div><dt>Subject</dt><dd>{selectedFaculty.code} · {selectedFaculty.title}</dd></div><div><dt>Class schedule</dt><dd>{selectedFaculty.schedule}</dd></div><div><dt>Academic year / semester</dt><dd>2026–2027 · First Semester</dd></div></dl>
          <form className="evaluation-question-form" onSubmit={submitEvaluation}>
            {evaluationSections.map((section) => <fieldset className="evaluation-section" key={section.title}><legend>{section.title}</legend>{section.questions.map((question) => {
              questionNumber += 1;
              const number = questionNumber;
              return <div className="evaluation-question" key={question}><p><strong>{number}.</strong> {question}</p><div className="rating-options" role="radiogroup" aria-label={`Question ${number}: ${question}`}>{[1, 2, 3, 4, 5].map((rating) => <label key={rating}><input type="radio" name={`question-${number}`} value={rating} required={rating === 1} /><span>{rating}</span></label>)}</div></div>;
            })}</fieldset>)}
            <section className="evaluation-comments" aria-label="Optional comments"><h3>Comments</h3>{evaluationSections.map((section) => <label key={section.title}>{section.title}<textarea name={`comment-${section.title}`} rows="4" maxLength="500" placeholder="Share commendable attributes and suggested improvements" /></label>)}</section>
            <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="loading-spinner" />Submitting…</> : "Submit evaluation"}</button><Feedback>{feedback}</Feedback>
          </form>
        </> : <p className="evaluation-empty">Select a faculty card above to begin the evaluation.</p>}
        {evaluations.length > 0 && <div className="saved-evaluations"><p>{evaluations.length} saved evaluation {evaluations.length === 1 ? "response" : "responses"} on this device.</p><button type="button" className="text-button" onClick={() => setEvaluations([])}>Clear saved responses</button></div>}
      </section>
    </>
  );
}
