import { useState } from "react";
import { Link } from "react-router-dom";
import {
  academicSections,
  checkListTerms,
  circulationDetails,
  currentBalance,
  enrolledTerm,
  ledgerEntries,
  notices,
  nonAcademicSections,
  otherPendingClearances,
  pages,
  periodicDues,
  profileRows,
  student,
  subjects,
} from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import Icon from "../components/Icon.jsx";
import { Badge, DataTable, DemoNote, Feedback, PageHeading, Panel, SectionCards } from "../components/UI.jsx";

const simulatedFees = [
  ["Oct 01, 2026", "Enrollment assessment", "₱45,750.00", <Badge key="recorded">Recorded</Badge>],
  ["Oct 02, 2026", "Initial installment · simulated", "₱20,000.00", <Badge key="simulated">Simulated</Badge>],
  ["Oct 16, 2026", "Payment center fee · simulated", "₱250.00", <Badge key="simulated-fee">Simulated</Badge>],
];

function PageIntro({ page, children }) {
  return <PageHeading page={page}>{children}</PageHeading>;
}

function Note({ children }) {
  return <DemoNote>{children}</DemoNote>;
}

function Overview({ page, ids }) {
  return (
    <>
      <PageIntro page={page} />
      <SectionCards links={ids.map((id) => ({ id, title: pages[id].title, description: pages[id].description }))} />
      <Note />
    </>
  );
}

function Dashboard() {
  const today = new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());
  return (
    <>
      <PageHeading page={{ section: "Student Portal", title: "Welcome back", description: "Here’s your academic snapshot and the latest campus updates." }}>
        <div className="date-label"><Icon name="calendar" /><time>{today}</time></div>
      </PageHeading>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-kicker">Your semester, in focus</p><h2 id="hero-title">Make this semester count.</h2>
          <p>Keep track of your classes, requirements, and campus updates—all in one place.</p>
          <Link className="button button-light" to="/index.html#subjects-enrolled">View my enrollment <Icon name="arrow" /></Link>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="hero-art-inner"><Icon name="graduation" /></div></div>
      </section>
      <div className="summary-grid">
        <article className="summary-card"><span className="summary-icon teal"><Icon name="check" /></span><div className="summary-details"><span className="summary-label">Clearance status</span><strong className="summary-value">In progress</strong><span className="summary-meta">2 requirements remaining</span></div></article>
        <article className="summary-card"><span className="summary-icon blue"><Icon name="book" /></span><div className="summary-details"><span className="summary-label">Enrolled subjects</span><strong className="summary-value">{subjects.length} subjects</strong><span className="summary-meta">21 academic units</span></div></article>
        <article className="summary-card"><span className="summary-icon amber"><Icon name="wallet" /></span><div className="summary-details"><span className="summary-label">Next periodic due</span><strong className="summary-value">Nov 15</strong><span className="summary-meta">Installment schedule</span></div></article>
      </div>
      <section className="dashboard-columns" aria-label="Campus updates and student services">
        <div>
          <div className="section-heading"><h2>Updates for you</h2><Link className="text-link" to="/index.html#student-clearance">View clearance</Link></div>
          <section className="panel" aria-label="Student updates">
            <div className="panel-header"><div><h2>Important reminders</h2><p>Stay up to date with your academic requirements</p></div><span className="badge badge-warning">2 actions</span></div>
            <div className="panel-body">{notices.map((notice) => (
              <article className="notice-row" key={notice.title}>
                <span className={`notice-symbol ${notice.tone}`}><Icon name={notice.icon} /></span>
                <div className="notice-copy"><h3 className="notice-title">{notice.title}</h3><p className="notice-description">{notice.description}</p></div>
                <span className="notice-time">{notice.time}</span>
              </article>
            ))}</div>
          </section>
        </div>
        <div className="right-column">
          <section className="service-card"><div className="service-title"><span className="service-icon"><Icon name="email" /></span><h2>Your AUF email</h2></div><p>Use your AUF student email for official university communication, account updates, and announcements.</p><Link className="service-action" to="/index.html#student-clearance">Check student services <Icon name="arrow" /></Link></section>
          <section className="service-card"><div className="service-title"><span className="service-icon"><Icon name="lms" /></span><h2>MyCLASS &amp; Canvas</h2></div><p>Course materials and class announcements are shared through your assigned learning platform.</p><Link className="service-action" to="/index.html#subjects-enrolled">View my subjects <Icon name="arrow" /></Link></section>
          <section className="intervention-card"><div className="service-title"><span className="service-icon service-icon-amber"><Icon name="graduation" /></span><h2>Academic support</h2></div><p>Connect with your faculty adviser to learn about academic support and intervention options.</p></section>
        </div>
      </section>
      <Note />
    </>
  );
}

function ClearancePage() {
  const { amount, status } = currentBalance;
  const circulationRows = circulationDetails.map(([detail, value]) => [detail, value]);
  return (
    <>
      <PageIntro page={pages["student-clearance"]} />
      <Panel title="Current Balance" subtitle="Student account balance status">
        <p className="clearance-balance-line">
          <Badge tone={status === "Outstanding" ? "warning" : "success"}>{status.toUpperCase()}</Badge>
          <span aria-hidden="true">:</span>
          <strong>{amount}</strong>
        </p>
      </Panel>
      <Panel title="Circulation Detail" subtitle="Library items or fines that may affect clearance">
        <DataTable headers={["Circulation item", "Details"]} rows={circulationRows} label="Library circulation details" />
      </Panel>
      <Panel title="Other Pending Clearance" subtitle="Non-library requirements that need attention">
        <DataTable
          headers={["Posted by", "Due", "Requirement", "Remark", "Date posted", "Last date to clear"]}
          rows={otherPendingClearances}
          label="Other pending clearance requirements"
        />
      </Panel>
      <Note />
    </>
  );
}

function SimpleDataPage({ page, title, headers, rows, label, subtitle, searchable = false, sortable = false, note, noteText, after }) {
  return (
    <>
      <PageIntro page={page} />
      <Panel title={title} subtitle={subtitle}>
        <DataTable headers={headers} rows={rows} label={label} searchable={searchable} sortable={sortable} />
      </Panel>
      {after}
      {note && <p className="table-total">{note}</p>}
      <Note>{noteText}</Note>
    </>
  );
}

function AdmissionPage() {
  const [submitted, setSubmitted] = useLocalStorage("myau-admission-documents", []);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  function submitDocument(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = form.elements.document.files[0];
    if (!file) return;
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setSubmitted((items) => [...items, { id: `${Date.now()}-${file.name}`, name: file.name, submittedAt: new Date().toLocaleString() }]);
      setFeedback(`Demo only: “${file.name}” was selected but not uploaded.`);
      form.reset();
      setLoading(false);
    }, 350);
  }

  const requirementRows = [
    ["Form 138 / Senior High School Record", <Badge key="received-1">Received</Badge>, "On file"],
    ["PSA Birth Certificate", <Badge tone="warning" key="review">For review</Badge>, "Review pending"],
    ["Certificate of Good Moral Character", <Badge key="received-2">Received</Badge>, "On file"],
  ];

  return (
    <>
      <PageIntro page={pages["submit-admission-requirement"]} />
      <Panel title="Admission requirements"><DataTable headers={["Document", "Status", "Action"]} rows={requirementRows} label="Admission requirement status" /></Panel>
      <section className="panel form-panel">
        <div className="panel-header"><div><h2>Submit a document</h2><p>Choose a file to simulate an admission requirement submission.</p></div></div>
        <form className="demo-form" id="admission-form" onSubmit={submitDocument}>
          <label htmlFor="admission-file">Document file</label>
          <input id="admission-file" name="document" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="loading-spinner" />Submitting…</> : "Submit for demonstration"}</button>
          <Feedback>{feedback}</Feedback>
        </form>
        <div className="submitted-documents">
          <h3>Demo submissions</h3>
          {submitted.length === 0 ? <p className="empty-state">No documents have been selected in this browser.</p> : submitted.map((item) => (
            <div className="submitted-document" key={item.id}>
              <span><strong>{item.name}</strong><small>{item.submittedAt}</small></span>
              <button type="button" className="text-button" onClick={() => setSubmitted((items) => items.filter((saved) => saved.id !== item.id))}>Remove</button>
            </div>
          ))}
        </div>
      </section>
      <Note>Selecting a file only simulates a frontend submission. Files are not uploaded or stored.</Note>
    </>
  );
}

function OnlineAdvisingPage() {
  const [appointments, setAppointments] = useLocalStorage("myau-advising-appointments", []);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const slots = [];

  for (let offset = 1; slots.length < 5; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateKey = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    for (const time of ["9:00 AM", "2:00 PM"]) {
      slots.push({
        value: `${dateKey}|${time}`,
        date: new Intl.DateTimeFormat("en-PH", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(date),
        time,
      });
      if (slots.length === 5) break;
    }
  }

  function requestAppointment(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const slot = slots.find(({ value }) => value === data.get("appointment-slot"));
    if (!slot || appointments.some((appointment) => appointment.slot === slot.value)) return;

    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setAppointments((items) => [...items, {
        id: `${Date.now()}`,
        slot: slot.value,
        date: slot.date,
        time: slot.time,
        reason: data.get("advising-reason"),
        notes: data.get("advising-notes").trim(),
      }]);
      setFeedback("Demo only: your advising appointment request was saved in this browser.");
      form.reset();
      setLoading(false);
    }, 350);
  }

  function cancelAppointment(id) {
    setAppointments((items) => items.filter((appointment) => appointment.id !== id));
    setFeedback("Demo appointment cancelled.");
  }

  return (
    <>
      <PageIntro page={pages["online-advising"]} />
      <section className="panel form-panel">
        <div className="panel-header"><div><h2>Request an advising appointment</h2><p>Choose an available time and tell your adviser what you would like to discuss.</p></div></div>
        <form className="demo-form" onSubmit={requestAppointment}>
          <label htmlFor="appointment-slot">Available appointment</label>
          <select id="appointment-slot" name="appointment-slot" required defaultValue="">
            <option value="" disabled>Select a date and time</option>
            {slots.map((slot) => <option value={slot.value} key={slot.value} disabled={appointments.some((appointment) => appointment.slot === slot.value)}>{slot.date} · {slot.time}{appointments.some((appointment) => appointment.slot === slot.value) ? " · Requested" : ""}</option>)}
          </select>
          <label htmlFor="advising-reason">Advising topic</label>
          <select id="advising-reason" name="advising-reason" required defaultValue="">
            <option value="" disabled>Select a topic</option>
            <option>Course selection</option>
            <option>Academic progress</option>
            <option>Enrollment question</option>
            <option>Other academic concern</option>
          </select>
          <label htmlFor="advising-notes">Notes <span className="optional-label">(optional)</span></label>
          <textarea id="advising-notes" name="advising-notes" rows="3" maxLength="300" placeholder="Add a short note for your adviser" />
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="loading-spinner" />Saving request…</> : "Request demo appointment"}</button>
          <Feedback>{feedback}</Feedback>
        </form>
      </section>
      <Panel title="Your demo appointments" subtitle="Requests are stored only in this browser.">
        {appointments.length === 0 ? <p className="empty-state">No advising appointments requested.</p> : (
          <div className="table-scroll" role="region" aria-label="Your demo advising appointments" tabIndex="0">
            <table>
              <thead><tr><th scope="col">Date and time</th><th scope="col">Topic</th><th scope="col">Notes</th><th scope="col">Action</th></tr></thead>
              <tbody>{appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.date} · {appointment.time}</td>
                  <td>{appointment.reason}</td>
                  <td>{appointment.notes || "—"}</td>
                  <td><button className="text-button" type="button" onClick={() => cancelAppointment(appointment.id)}>Cancel</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Panel>
      <Note>Advising requests are simulated and are not sent to AUF staff or added to an official calendar.</Note>
    </>
  );
}

function PersonalContent({ pageId }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  if (pageId === "personal-information") {
    return <Overview page={pages[pageId]} ids={["view-personal-info", "print-personal-info", "change-password"]} />;
  }
  if (pageId === "view-personal-info") {
    return <><SimpleDataPage page={pages[pageId]} title="Personal information" headers={["Information", "Details"]} rows={profileRows} label="Personal information" note="Personal details are fictional." /></>;
  }
  if (pageId === "print-personal-info") {
    return <><PageIntro page={pages[pageId]} /><Panel title="Print Personal Info"><p className="panel-copy">Print the current personal information view for a local demonstration.</p><button className="button button-secondary" type="button" onClick={() => window.print()}>Print this page <Icon name="file" /></button></Panel><Note>Personal details are fictional.</Note></>;
  }
  function validatePassword(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("new-password") !== data.get("confirm-password")) {
      setFeedback("The passwords do not match. Please check both entries.");
      return;
    }
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setFeedback("Demo only: password validated but not saved.");
      form.reset();
      setLoading(false);
    }, 300);
  }
  return (
    <>
      <PageIntro page={pages[pageId]} />
      <section className="panel form-panel">
        <div className="panel-header"><div><h2>Change Password</h2><p>Password changes are simulated and are not saved.</p></div></div>
        <form className="demo-form" id="password-form" onSubmit={validatePassword}>
          <label htmlFor="new-password">New password</label><input id="new-password" name="new-password" type="password" minLength="8" autoComplete="new-password" required />
          <label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" name="confirm-password" type="password" minLength="8" autoComplete="new-password" required />
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="loading-spinner" />Validating…</> : "Validate demo password"}</button>
          <Feedback tone={feedback.startsWith("The passwords") ? "error" : "success"}>{feedback}</Feedback>
        </form>
      </section>
      <Note>Password changes do not affect any real account.</Note>
    </>
  );
}

function CheckListPage() {
  const rowCount = Math.max(...checkListTerms.map(({ courses }) => courses.length));
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
        <div className="checklist-legend" aria-label="Course status legend">
          {Object.entries(statusLabels).map(([status, label]) => (
            <span className="checklist-legend-item" key={status}>
              <span className={`checklist-status-swatch status-${status}`} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
        <div className="checklist-scroll" role="region" aria-label="Academic course flowchart" tabIndex="0">
          <table className="checklist-table">
            <thead>
              <tr>
                <th className="checklist-number-heading" scope="col" rowSpan="2">#</th>
                {checkListTerms.filter((_, index) => index % 2 === 0).map(({ year }) => (
                  <th className="checklist-year-heading" scope="colgroup" colSpan="2" key={year}>{year}</th>
                ))}
              </tr>
              <tr>
                {checkListTerms.map((term, index) => (
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
                  {checkListTerms.map((term, termIndex) => {
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
        </div>
        <p className="checklist-source-note">Course-level earned units and grades are shown only where the supplied academic record includes them.</p>
      </Panel>
      <Note />
    </>
  );
}

function AcademicPage({ pageId }) {
  if (pageId === "academic-performance") return <Overview page={pages[pageId]} ids={academicSections.map(({ id }) => id)} />;
  if (pageId === "non-acad-performance") return <Overview page={pages[pageId]} ids={nonAcademicSections.map(({ id }) => id)} />;
  if (pageId === "check-list") return <CheckListPage />;
  if (pageId === "discipline-monitoring") {
    return <SimpleDataPage page={pages[pageId]} title="Discipline Monitoring" subtitle="Student conduct resources and sample standing." headers={["Item", "Details"]} rows={[["Current standing", "Good"], ["Active notices", "None"], ["Student conduct resources", "Consult the student handbook"]]} label="Discipline monitoring" />;
  }
  const item = [...academicSections, ...nonAcademicSections].find(({ id }) => id === pageId);
  return <SimpleDataPage page={pages[pageId]} title={item.title} subtitle={item.description} headers={["Item", "Details"]} rows={item.rows} label={item.title} />;
}

function EnrollmentPage({ pageId }) {
  if (pageId === "enrollment") return <Overview page={pages[pageId]} ids={["subjects-enrolled", "online-advising", "fees-paid-during-enrollment", "submit-admission-requirement"]} />;
  if (pageId === "student-account") return <Overview page={pages[pageId]} ids={["ledger", "periodic-dues"]} />;
  if (pageId === "subjects-enrolled") {
    const rows = subjects.map(([code, title, lecLabUnits, totalUnits]) => [code, title, lecLabUnits, totalUnits, "Assigned faculty · Demo"]);
    return (
      <>
        <PageIntro page={pages[pageId]} />
        <Panel title={`Enrolled ${enrolledTerm.label}`} subtitle={`Official enrollment date: ${enrolledTerm.officialDate}`}>
          <div className="term-summary">
            <span>Maximum units this semester <strong>{enrolledTerm.maximumUnits}</strong></span>
            <span>Total units load taken <strong>{enrolledTerm.totalUnits}</strong></span>
          </div>
          <DataTable headers={["Subject code", "Subject title", "LEC/LAB units", "Total units", "Faculty assigned"]} rows={rows} label="Subjects enrolled" />
        </Panel>
        <Note>Course and unit information is shown for demonstration. Faculty names are not included.</Note>
      </>
    );
  }
  if (pageId === "online-advising") return <OnlineAdvisingPage />;
  if (pageId === "fees-paid-during-enrollment") return <SimpleDataPage page={pages[pageId]} title="Enrollment fee records" headers={["Date", "Description", "Amount", "Record status"]} rows={simulatedFees} label="Fees paid during enrollment" note={<>Recorded in this demo <strong>₱20,250.00</strong></>} noteText="Fee amounts and payment records are fictional. No payment has been made or processed." />;
  if (pageId === "submit-admission-requirement") return <AdmissionPage />;
  if (pageId === "ledger") {
    const rows = ledgerEntries.map(([date, particulars, collectedBy, debit, credit, balance]) => [date, particulars, collectedBy, debit, credit, balance]);
    return (
      <>
        <PageIntro page={pages[pageId]} />
        <div className="account-term-summary">
          <span>School year / term <strong>2026–2027 · First Semester</strong></span>
          <span>Student <strong>{student.id} · {student.name}</strong></span>
          <span>Program / year <strong>{student.program} · {student.yearLevel}</strong></span>
        </div>
        <Panel title="Student ledger" subtitle="Fictional account activity · amounts in PHP">
          <DataTable headers={["Date", "Particulars", "Collected by", "Debit", "Credit", "Balance"]} rows={rows} label="Student account ledger" />
        </Panel>
        <section className="balance-card"><span>Sample outstanding balance</span><strong>₱35,700.00</strong><small>Based on the fictional ledger entries above.</small></section>
        <Note>Ledger entries and amounts are demonstration data, not an official student account statement.</Note>
      </>
    );
  }
  const duesRows = periodicDues.map(([period, required, cumulative]) => [period, required, cumulative]);
  return (
    <>
      <PageIntro page={pages[pageId]} />
      <div className="account-term-summary">
        <span>Term <strong>First Semester, 2026–2027</strong></span>
        <span>Enrollment status <Badge>Enrolled</Badge></span>
      </div>
      <Panel title="Payment schedule" subtitle="Amounts in PHP">
        <DataTable headers={["Payment period", "Required amount", "Cumulative balance"]} rows={duesRows} label="Periodic dues schedule" />
      </Panel>
      <Note>Payment schedule and amounts are fictional demonstration data. No payment is processed.</Note>
    </>
  );
}

function LibraryContent({ pageId }) {
  if (pageId === "library") {
    return <><PageIntro page={pages[pageId]} /><Panel title="Library services"><p className="panel-copy">Explore research resources and library services for students. Access to licensed research databases may depend on university credentials.</p><Link className="button button-primary" to="/pages/ebsco-database.html">Open EBSCO Database <Icon name="arrow" /></Link></Panel><Note>MYAU does not provide or verify access to external library services.</Note></>;
  }
  return <><PageIntro page={pages[pageId]} /><Panel title="EBSCO research database"><p className="panel-copy">Open the external EBSCO research database to explore journals, articles, and academic resources. Access may require university credentials.</p><a className="button button-primary" href="https://search.ebscohost.com/" target="_blank" rel="noopener noreferrer">Continue to EBSCO <Icon name="arrow" /></a></Panel><Note>EBSCO is an external destination. MYAU does not verify access or provide credentials.</Note></>;
}

function FacultyEvaluation() {
  const [evaluations, setEvaluations] = useLocalStorage("myau-faculty-evaluations", []);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  function submitEvaluation(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setEvaluations((items) => [...items, { id: Date.now(), course: data.get("course"), rating: data.get("rating"), comment: data.get("comment"), submittedAt: new Date().toLocaleString() }]);
      setFeedback("Demo only: evaluation submitted for preview and not saved.");
      form.reset();
      setLoading(false);
    }, 400);
  }
  return (
    <>
      <PageIntro page={pages["faculty-evaluation"]} />
      <section className="panel form-panel">
        <div className="panel-header"><div><h2>Course feedback</h2><p>Your feedback can help improve learning experiences.</p></div></div>
        <form className="demo-form" id="evaluation-form" onSubmit={submitEvaluation}>
          <label htmlFor="evaluation-course">Course</label>
          <select id="evaluation-course" name="course" required><option value="">Select a course</option>{subjects.map(([code, name]) => <option value={code} key={code}>{code} — {name}</option>)}</select>
          <label htmlFor="evaluation-rating">Overall rating</label>
          <select id="evaluation-rating" name="rating" required><option value="">Select a rating</option><option>Excellent</option><option>Good</option><option>Satisfactory</option><option>Needs improvement</option></select>
          <label htmlFor="evaluation-comment">Comments <span className="optional-label">(optional)</span></label>
          <textarea id="evaluation-comment" name="comment" rows="4" maxLength="500" placeholder="Share constructive feedback" />
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="loading-spinner" />Submitting…</> : "Submit demo evaluation"}</button>
          <Feedback>{feedback}</Feedback>
        </form>
        {evaluations.length > 0 && <div className="saved-evaluations"><p>{evaluations.length} local demo {evaluations.length === 1 ? "response" : "responses"} on this device.</p><button type="button" className="text-button" onClick={() => setEvaluations([])}>Clear local responses</button></div>}
      </section>
      <Note>Evaluation responses are only stored in this browser for demonstration and are not sent to faculty.</Note>
    </>
  );
}

function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  function previewPayment() {
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setFeedback("Demo only: payment preview complete. No payment was made.");
      setLoading(false);
    }, 450);
  }
  return <><PageIntro page={pages["online-payment"]} /><section className="balance-card payment-balance"><span>Sample amount due</span><strong>₱15,750.00</strong><small>Fictional student account balance</small></section><Panel title="Payment option"><p className="panel-copy">The actual online payment service is not connected in this demonstration. Preview the simulated confirmation without entering any payment details.</p><button className="button button-primary" type="button" onClick={previewPayment} disabled={loading}>{loading ? <><span className="loading-spinner" />Preparing preview…</> : "Preview simulated payment"}</button><Feedback>{feedback}</Feedback></Panel><Note>No payment credentials are requested and no funds are transferred.</Note></>;
}

export default function PortalPage({ pageId }) {
  if (pageId === "dashboard") return <Dashboard />;
  if (pageId === "student-clearance") return <ClearancePage />;
  if (["enrollment", "subjects-enrolled", "online-advising", "fees-paid-during-enrollment", "submit-admission-requirement", "student-account", "ledger", "periodic-dues"].includes(pageId)) return <EnrollmentPage pageId={pageId} />;
  if (["academic-performance", "non-acad-performance", "discipline-monitoring", ...academicSections.map(({ id }) => id), ...nonAcademicSections.map(({ id }) => id)].includes(pageId)) return <AcademicPage pageId={pageId} />;
  if (["personal-information", "view-personal-info", "print-personal-info", "change-password"].includes(pageId)) return <PersonalContent pageId={pageId} />;
  if (pageId === "library" || pageId === "ebsco-database") return <LibraryContent pageId={pageId} />;
  if (pageId === "faculty-evaluation") return <FacultyEvaluation />;
  if (pageId === "online-payment") return <PaymentPage />;
  return <PageIntro page={pages[pageId]} />;
}
