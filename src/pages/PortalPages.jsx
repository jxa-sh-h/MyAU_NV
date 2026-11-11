import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  academicSections,
  checkListTerms,
  circulationDetails,
  currentBalance,
  disciplineStatus,
  enrolledTerm,
  gradingRecords,
  ledgerEntries,
  notices,
  nonAcademicSections,
  otherPendingClearances,
  pages,
  periodicDues,
  student,
  subjects,
} from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useStudentProfile } from "../contexts/StudentProfileContext.jsx";
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
        <Link className="summary-card" to="/index.html#student-clearance"><span className="summary-icon blue"><Icon name="shield" /></span><span className="summary-details"><span className="summary-label">Discipline standing</span><strong className="summary-value">{disciplineStatus.currentStanding}</strong><span className="summary-meta">{disciplineStatus.activeNotices.length} active notices</span></span></Link>
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
  const activeNotices = disciplineStatus.activeNotices.length
    ? disciplineStatus.activeNotices.map(({ title }) => title).join(", ")
    : "None";
  return (
    <>
      <PageIntro page={pages["student-clearance"]} />
      <section className="clearance-section" aria-labelledby="payment-clearance-title">
        <h2 className="clearance-section-title" id="payment-clearance-title"><Icon name="wallet" /> Payment Clearance</h2>
        <Panel title="Current Balance" subtitle="Student account payment status">
          <p className="clearance-balance-line">
            <Badge tone={status === "Outstanding" ? "warning" : "success"}>{status.toUpperCase()}</Badge>
            <span aria-hidden="true">:</span>
            <strong>{amount}</strong>
          </p>
        </Panel>
        <Panel title="Circulation Fees" subtitle="Library items or fines that may affect payment clearance">
          <DataTable headers={["Circulation item", "Details"]} rows={circulationRows} label="Payment-related library circulation fees" />
        </Panel>
      </section>
      <section className="clearance-section" aria-labelledby="violation-clearance-title">
        <h2 className="clearance-section-title" id="violation-clearance-title"><Icon name="shield" /> Violation Clearance</h2>
        <Panel title="Discipline Monitoring" subtitle="Student conduct standing and active violation notices">
          <DataTable
            headers={["Item", "Details"]}
            rows={[
              ["Current standing", disciplineStatus.currentStanding],
              ["Active violation notices", activeNotices],
            ]}
            label="Violation clearance and discipline status"
          />
        </Panel>
        <Panel title="Other Violation Clearance Items" subtitle="Non-payment requirements that need attention">
          <DataTable
            headers={["Posted by", "Due", "Requirement", "Remark", "Date posted", "Last date to clear"]}
            rows={otherPendingClearances}
            label="Other violation clearance requirements"
          />
        </Panel>
      </section>
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

function PersonalContent({ pageId }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile, setProfile } = useStudentProfile();
  if (pageId === "personal-information") {
    return <Overview page={pages[pageId]} ids={["view-personal-info", "edit-personal-info", "print-personal-info", "change-password"]} />;
  }
  if (pageId === "view-personal-info") {
    const profileRows = [
      ["Student ID", profile.id],
      ["Student name", profile.name],
      ["Email address", profile.email || "Not provided"],
      ["Contact mobile", profile.contactMobile || "Not provided"],
      ["Program", profile.program],
      ["Year level", profile.yearLevel],
      ["Academic year", profile.academicYear],
    ];
    return (
      <>
        <PageIntro page={pages[pageId]} />
        <Panel title="Personal information">
          <DataTable headers={["Information", "Details"]} rows={profileRows} label="Personal information" />
          <Link className="button button-primary personal-edit-button" to="/index.html#edit-personal-info">Edit personal information</Link>
        </Panel>
        <Note>Personal details are fictional and saved only in this browser.</Note>
      </>
    );
  }
  if (pageId === "edit-personal-info") {
    function savePersonalInfo(event) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      setProfile((currentProfile) => ({
        ...currentProfile,
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        contactMobile: formData.get("contact-mobile").trim(),
      }));
      setFeedback("Personal information updated in this browser.");
    }

    return (
      <>
        <PageIntro page={pages[pageId]} />
        <section className="panel form-panel">
          <div className="panel-header"><div><h2>Edit contact information</h2><p>Changes are stored only in this browser and are not sent to AUF.</p></div></div>
          <form className="demo-form" onSubmit={savePersonalInfo}>
            <label htmlFor="personal-name">Student name</label>
            <input id="personal-name" name="name" type="text" maxLength="100" defaultValue={profile.name} required />
            <label htmlFor="personal-email">Email address</label>
            <input id="personal-email" name="email" type="email" maxLength="254" defaultValue={profile.email} />
            <label htmlFor="personal-mobile">Contact mobile</label>
            <input id="personal-mobile" name="contact-mobile" type="tel" maxLength="30" defaultValue={profile.contactMobile} />
            <button className="button button-primary" type="submit">Save personal information</button>
            <Feedback>{feedback}</Feedback>
          </form>
        </section>
        <Note>Student ID, program, year level, and academic year are read-only demonstration details.</Note>
      </>
    );
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

function GradingPage() {
  const [examPeriod, setExamPeriod] = useState("Prelim");
  const [term, setTerm] = useState("1st Semester");
  const [startYear, setStartYear] = useState("2026");
  const [endYear, setEndYear] = useState("2027");
  const [showGrades, setShowGrades] = useState(false);
  const { profile } = useStudentProfile();
  const grades = subjects.map(([code, title, , credit]) => {
    const record = gradingRecords.find((item) => item.code === code);
    const grade = examPeriod === "Midterm" ? record.midtermGrade : "Grade not encoded for now";
    return {
      code,
      title,
      credit,
      instructor: record.instructor,
      grade,
      remarks: examPeriod === "Midterm" ? "Passed" : "Grade not encoded for now",
      isEncoded: examPeriod === "Midterm",
    };
  });

  function updateExamPeriod(event) {
    setExamPeriod(event.target.value);
    setShowGrades(false);
  }

  function updateTerm(event) {
    setTerm(event.target.value);
    setShowGrades(false);
  }

  return (
    <>
      <PageIntro page={pages["grading-per-exam-period"]} />
      <section className="grading-page" aria-label="Grades by exam period">
        <h2 className="grading-title">Grade Per Exam Period</h2>
        <dl className="grading-student-details">
          <div><dt>Student ID</dt><dd>{profile.id}</dd></div>
          <div><dt>Student name</dt><dd>{profile.name}</dd></div>
          <div><dt>Course/Major</dt><dd>{profile.program}</dd></div>
          <div><dt>Year</dt><dd>{profile.yearLevel}</dd></div>
        </dl>
        <form className="grading-controls" onSubmit={(event) => { event.preventDefault(); setShowGrades(true); }}>
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
            <label htmlFor="grading-start-year">SY:</label>
            <input id="grading-start-year" aria-label="School year start" inputMode="numeric" maxLength="4" value={startYear} onChange={(event) => { setStartYear(event.target.value); setShowGrades(false); }} />
            <span>to</span>
            <input aria-label="School year end" inputMode="numeric" maxLength="4" value={endYear} onChange={(event) => { setEndYear(event.target.value); setShowGrades(false); }} />
          </div>
          <button className="grading-view-button" type="submit">Click to View Grade</button>
        </form>
        {showGrades && (
          <section className="grading-results" aria-live="polite">
            <p className="grading-note">NOTE: Red color indicates grades not verified by registrar.</p>
            <h3>{examPeriod} GRADES FOR {startYear}-{endYear}</h3>
            <div className="grading-table-scroll" role="region" aria-label={`${examPeriod} grades for ${term}, ${startYear}-${endYear}`} tabIndex="0">
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
            </div>
          </section>
        )}
      </section>
      <Note>Grades shown are demonstration data and are not an official registrar record.</Note>
    </>
  );
}

function AcademicPage({ pageId }) {
  if (pageId === "academic-performance") return <Overview page={pages[pageId]} ids={academicSections.map(({ id }) => id)} />;
  if (pageId === "non-acad-performance") return <Overview page={pages[pageId]} ids={nonAcademicSections.map(({ id }) => id)} />;
  if (pageId === "check-list") return <CheckListPage />;
  if (pageId === "grading-per-exam-period") return <GradingPage />;
  const item = [...academicSections, ...nonAcademicSections].find(({ id }) => id === pageId);
  return <SimpleDataPage page={pages[pageId]} title={item.title} subtitle={item.description} headers={["Item", "Details"]} rows={item.rows} label={item.title} />;
}

function EnrollmentPage({ pageId }) {
  if (pageId === "enrollment") return <Overview page={pages[pageId]} ids={["subjects-enrolled", "fees-paid-during-enrollment", "submit-admission-requirement"]} />;
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
  const [selectedCourse, setSelectedCourse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const evaluationFormRef = useRef(null);

  function chooseFaculty(code) {
    setSelectedCourse(code);
    evaluationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    evaluationFormRef.current?.querySelector("select")?.focus({ preventScroll: true });
  }

  function submitEvaluation(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setEvaluations((items) => [...items, { id: Date.now(), course: data.get("course"), faculty: "Faculty name placeholder", rating: data.get("rating"), comment: data.get("comment"), submittedAt: new Date().toLocaleString() }]);
      setFeedback("Demo only: evaluation submitted for preview and not saved.");
      form.reset();
      setSelectedCourse("");
      setLoading(false);
    }, 400);
  }
  return (
    <>
      <PageIntro page={pages["faculty-evaluation"]} />
      <section className="faculty-list" aria-label="Faculty teaching currently enrolled subjects">
        <h2 className="faculty-list-title">Faculty for your enrolled subjects</h2>
        <div className="faculty-card-grid">
          {subjects.map(([code, title]) => (
            <article className="faculty-card" key={code}>
              <div className="faculty-photo-placeholder" role="img" aria-label="Faculty photo placeholder">
                <Icon name="user" />
                <span>Photo placeholder</span>
              </div>
              <div className="faculty-card-details">
                <h3>Faculty name placeholder</h3>
                <p className="faculty-subject-code">{code}</p>
                <p className="faculty-subject-title">{title}</p>
                <button className="button button-secondary faculty-evaluate-button" type="button" onClick={() => chooseFaculty(code)}>Evaluate this faculty</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel form-panel">
        <div className="panel-header"><div><h2>Course feedback</h2><p>Your feedback can help improve learning experiences.</p></div></div>
        <form className="demo-form" id="evaluation-form" ref={evaluationFormRef} onSubmit={submitEvaluation}>
          <label htmlFor="evaluation-course">Course</label>
          <select id="evaluation-course" name="course" value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)} required><option value="">Select a course</option>{subjects.map(([code, name]) => <option value={code} key={code}>{code} — {name}</option>)}</select>
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
  const { profile } = useStudentProfile();
  const [activeTab, setActiveTab] = useState("summary");
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const paymentTabs = [
    ["summary", "Summary"],
    ["history", "Payment History"],
    ["installment", "Pay Installment Fee"],
    ["other-fee", "Pay Otherschool Fee"],
    ["downpayment", "Pay Downpayment"],
  ];

  function previewPayment(paymentType) {
    setLoading(true);
    setFeedback(`Preparing ${paymentType.toLowerCase()} preview…`);
    window.setTimeout(() => {
      setFeedback("Demo only: payment preview complete. No payment was made.");
      setLoading(false);
    }, 450);
  }

  function handlePaymentTabKeyDown(event, index) {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % paymentTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + paymentTabs.length) % paymentTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = paymentTabs.length - 1;
    else return;

    event.preventDefault();
    const tabs = event.currentTarget.parentElement.querySelectorAll('[role="tab"]');
    tabs[nextIndex].focus();
    setActiveTab(paymentTabs[nextIndex][0]);
    setFeedback("");
  }

  return (
    <>
      <PageIntro page={pages["online-payment"]} />
      <section className="payment-portal" aria-label="Online payment">
        <nav className="payment-tabs" role="tablist" aria-label="Payment sections">
          {paymentTabs.map(([id, label]) => (
            <button
              className={`payment-tab${activeTab === id ? " active" : ""}`}
              id={`payment-tab-${id}`}
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls="payment-tab-panel"
              tabIndex={activeTab === id ? 0 : -1}
              onKeyDown={(event) => handlePaymentTabKeyDown(event, paymentTabs.findIndex(([tabId]) => tabId === id))}
              onClick={() => { setActiveTab(id); setFeedback(""); }}
            >
              {label}
            </button>
          ))}
          <Link className="payment-tab payment-main-link" to="/index.html#dashboard">Go Back To Main</Link>
        </nav>
        <div className="payment-tab-panel" id="payment-tab-panel" role="tabpanel" aria-labelledby={`payment-tab-${activeTab}`} tabIndex="0">
          {activeTab === "summary" && (
            <>
              <h2 className="payment-section-title">Student information - demo only</h2>
              <dl className="payment-student-details">
                <div><dt>Name</dt><dd>{profile.name}</dd></div>
                <div><dt>Email ID</dt><dd>{profile.email || "Not provided for this demo"}</dd></div>
                <div><dt>Contact mobile</dt><dd>{profile.contactMobile || "Not provided for this demo"}</dd></div>
                <div><dt>SY-Term enrolled</dt><dd>{profile.academicYear}</dd></div>
                <div><dt>Course enrolled</dt><dd>{profile.program} - {profile.yearLevel}</dd></div>
              </dl>
              <section className="payment-instructions" aria-labelledby="payment-instructions-title">
                <h2 id="payment-instructions-title">Instructions</h2>
                <button className="payment-instructions-toggle" type="button" aria-expanded={instructionsOpen} aria-controls="payment-instructions-content" onClick={() => setInstructionsOpen((value) => !value)}>
                  {instructionsOpen ? "Hide payment instructions" : "Click to view payment instructions"}
                </button>
                {instructionsOpen && <p className="payment-instructions-content" id="payment-instructions-content">This is a demonstration only. No payment will be processed, and no payment or banking details should be entered.</p>}
                <p className="payment-cutoff-note">Payment provider cutoff times may change. Confirm the current schedule directly with your payment provider.</p>
              </section>
            </>
          )}
          {activeTab === "history" && (
            <>
              <h2 className="payment-section-title">Payment history</h2>
              <p className="payment-empty-state">No payment history is available in this demo.</p>
            </>
          )}
          {activeTab !== "summary" && activeTab !== "history" && (
            <>
              <h2 className="payment-section-title">{paymentTabs.find(([id]) => id === activeTab)[1]}</h2>
              <div className="payment-amount-due"><span>Sample amount due</span><strong>{currentBalance.amount}</strong></div>
              <p className="payment-demo-copy">This payment section is a preview only. No payment details are collected and no transaction is made.</p>
              <button className="button button-primary" type="button" onClick={() => previewPayment(paymentTabs.find(([id]) => id === activeTab)[1])} disabled={loading}>
                {loading ? <><span className="loading-spinner" />Preparing preview…</> : "Preview simulated payment"}
              </button>
              <Feedback>{feedback}</Feedback>
            </>
          )}
        </div>
      </section>
      <Note>No payment credentials are requested and no funds are transferred.</Note>
    </>
  );
}

export default function PortalPage({ pageId }) {
  if (pageId === "dashboard") return <Dashboard />;
  if (pageId === "student-clearance") return <ClearancePage />;
  if (["enrollment", "subjects-enrolled", "fees-paid-during-enrollment", "submit-admission-requirement", "student-account", "ledger", "periodic-dues"].includes(pageId)) return <EnrollmentPage pageId={pageId} />;
  if (["academic-performance", "non-acad-performance", ...academicSections.map(({ id }) => id), ...nonAcademicSections.map(({ id }) => id)].includes(pageId)) return <AcademicPage pageId={pageId} />;
  if (["personal-information", "view-personal-info", "edit-personal-info", "print-personal-info", "change-password"].includes(pageId)) return <PersonalContent pageId={pageId} />;
  if (pageId === "library" || pageId === "ebsco-database") return <LibraryContent pageId={pageId} />;
  if (pageId === "faculty-evaluation") return <FacultyEvaluation />;
  if (pageId === "online-payment") return <PaymentPage />;
  return <PageIntro page={pages[pageId]} />;
}
