import { useEffect, useRef, useState } from "react";
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
import { demoAccounts } from "../data/demoAccounts.js";
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

function usePortalData() {
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
    enrolledTerm: data.enrolledTerm ?? enrolledTerm,
    ledgerEntries: data.ledgerEntries ?? ledgerEntries,
    periodicDues: data.periodicDues ?? periodicDues,
    fee: data.fee,
  };
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
  const { profile, currentBalance: activeBalance, notices: activeNotices, circulationDetails: activeCirculation, disciplineStatus: activeDiscipline, otherPendingClearances: activeClearances } = usePortalData();
  const today = new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());
  const hasPendingClearance = activeBalance.status === "Outstanding"
    || activeDiscipline.activeNotices.length > 0
    || activeClearances.length > 0
    || activeCirculation.some(([item, value]) => /overdue|fine/i.test(item) && !/^₱?0(?:\.00)?$/.test(value.trim()));
  const mascotMessages = [
    { image: "msacot_greetings.png", alt: "The AUF dog mascot greeting students", kicker: "Your AUF companion", title: "Welcome back, Angelenean!", message: "Ready to check your classes, campus updates, and next steps?", action: "View my enrollment", to: "/index.html#subjects-enrolled" },
    { image: "mascot_happy.png", alt: "The AUF dog mascot smiling brightly", kicker: "Keep up the good work", title: "You’re making progress!", message: "Your steady effort adds up. Take the semester one task at a time.", action: "View my enrollment", to: "/index.html#subjects-enrolled" },
    { image: "mascot_standing.png", alt: "The AUF dog mascot standing at attention", kicker: "Ready for your next step?", title: "Check your academic progress.", message: "Review your records and ask your faculty adviser about support when you need it.", action: "Academic records", to: "/index.html#academic-performance" },
    { image: "mascot_resting.png", alt: "The AUF dog mascot taking a nap", kicker: "A gentle reminder", title: "Take a breather.", message: "A short rest can help you return to your next task with fresh focus.", action: "View my enrollment", to: "/index.html#subjects-enrolled" },
    { image: "mascot_wink.png", alt: "The AUF dog mascot winking", kicker: "You’ve got this", title: "One step at a time.", message: "Need to share feedback about a class? The evaluation form is ready when you are.", action: "Evaluate a class", to: "/pages/faculty-evaluation.html" },
    hasPendingClearance
      ? { image: "mscot_notice.png", alt: "The AUF dog mascot showing a reminder", kicker: "Clearance reminder", title: "There are items to review.", message: "Open Student Clearance to check your pending payment, library, or conduct requirements.", action: "Open clearance", to: "/index.html#student-clearance" }
      : { image: "mascot_happy.png", alt: "The AUF dog mascot smiling", kicker: "Clearance update", title: "You’re all clear!", message: "There are no pending clearance items in your account.", action: "View my enrollment", to: "/index.html#subjects-enrolled" },
  ];
  const [mascotIndex, setMascotIndex] = useState(0);
  const mascot = mascotMessages[mascotIndex];
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      setMascotIndex((index) => (index + 1) % mascotMessages.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [mascotMessages.length]);
  const clearanceCard = hasPendingClearance ? (
    <Link className="summary-card" to="/index.html#student-clearance">
      <span className="summary-icon amber"><Icon name="check" /></span>
      <span className="summary-details"><span className="summary-label">Student clearance</span><strong className="summary-value">Needs attention</strong><span className="summary-meta">Review pending items</span></span>
    </Link>
  ) : (
    <article className="summary-card">
      <span className="summary-icon teal"><Icon name="check" /></span>
      <span className="summary-details"><span className="summary-label">Student clearance</span><strong className="summary-value">Cleared</strong><span className="summary-meta">No pending requirements</span></span>
    </article>
  );
  return (
    <>
      <PageHeading page={{ section: "Student Portal", title: "Welcome back", description: "Here’s your academic snapshot and the latest campus updates." }}>
        <div className="date-label"><Icon name="calendar" /><time>{today}</time></div>
      </PageHeading>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-kicker">{mascot.kicker}</p><h2 id="hero-title">{mascot.title}</h2>
          <p id="mascot-message" aria-live="off">{mascot.message}</p>
          <Link className="button button-light" to={mascot.to}>{mascot.action} <Icon name="arrow" /></Link>
        </div>
        <div className="hero-art mascot-art" aria-hidden="true">
          <img className="mascot-image" key={`${mascot.image}-${mascot.title}`} src={`/img/mascot/${mascot.image}`} alt="" />
        </div>
      </section>
      <div className="summary-grid">
        {clearanceCard}
        <article className="summary-card"><span className="summary-icon blue"><Icon name="graduation" /></span><span className="summary-details"><span className="summary-label">Academic interventions</span><strong className="summary-value">Talk to an adviser</strong><span className="summary-meta">Ask about academic support options</span></span></article>
        <Link className="summary-card" to="/pages/online-payment.html"><span className="summary-icon amber"><Icon name="wallet" /></span><span className="summary-details"><span className="summary-label">Account balance</span><strong className="summary-value">{activeBalance.status}</strong><span className="summary-meta">View payment details</span></span></Link>
        <Link className="summary-card" to="/pages/faculty-evaluation.html"><span className="summary-icon blue"><Icon name="star" /></span><span className="summary-details"><span className="summary-label">Faculty evaluation</span><strong className="summary-value">Open evaluation</strong><span className="summary-meta">Share feedback on your classes</span></span></Link>
      </div>
      <section className="dashboard-columns" aria-label="Campus updates and student services">
        <div>
          <div className="section-heading"><h2>Updates for you</h2><Link className="text-link" to="/index.html#student-clearance">View clearance</Link></div>
          <section className="panel" aria-label="Student updates">
            <div className="panel-header"><div><h2>Campus updates</h2><p>Announcements and reminders for your studies</p></div><span className="badge badge-neutral">{activeNotices.length} updates</span></div>
            <div className="panel-body">{activeNotices.map((notice) => (
              <article className="notice-row" key={notice.title}>
                <span className={`notice-symbol ${notice.tone}`}><Icon name={notice.icon} /></span>
                <div className="notice-copy"><h3 className="notice-title">{notice.title}</h3><p className="notice-description">{notice.description}</p></div>
                <span className="notice-time">{notice.time}</span>
              </article>
            ))}</div>
          </section>
        </div>
        <div className="right-column">
          <section className="service-card dashboard-account-card">
            <div className="service-title"><img className="dashboard-brand-logo" src="/img/gmail_logo.png" alt="" aria-hidden="true" /><h2>MyAU Mail</h2></div>
            <a className="service-account-link" href="https://mail.auf.edu.ph/" target="_blank" rel="noopener noreferrer">{profile.email} <Icon name="external" /></a>
            <details className="dashboard-help-details">
              <summary>Setup and support</summary>
              <div className="dashboard-help-copy">
                <p><strong>New students:</strong> Your MyAU Mail account and login credentials are sent to your registered personal email after admission. Check your spam folder if they are missing.</p>
                <p>For help, email <a href="mailto:mailadmin@auf.edu.ph">mailadmin@auf.edu.ph</a> and attach an image of your AUF ID or another identification document.</p>
              </div>
            </details>
            <a className="service-action" href="https://mail.auf.edu.ph/" target="_blank" rel="noopener noreferrer">Sign in to MyAU Mail <Icon name="arrow" /></a>
          </section>
          <section className="service-card dashboard-account-card">
            <div className="service-title"><img className="dashboard-brand-logo" src="/img/canvas_logo.png" alt="" aria-hidden="true" /><h2>MyClass · Canvas LMS</h2></div>
            <div className="app-store-links" aria-label="Canvas Student app downloads">
              <a href="https://play.google.com/store/apps/details?id=com.instructure.candroid" target="_blank" rel="noopener noreferrer">Google Play</a>
              <a href="https://apps.apple.com/app/id480883488" target="_blank" rel="noopener noreferrer">App Store</a>
            </div>
            <details className="dashboard-help-details">
              <summary>Login instructions and support</summary>
              <div className="dashboard-help-copy">
                <p>Use your student ID as your username and your initial password to sign in. After logging in, change your password under <strong>Account → Settings → Edit Settings → Change Password</strong>.</p>
                <p>New accounts are typically created and activated after the enrollment period. AUF will post an announcement when they are ready.</p>
                <p>For help, email <a href="mailto:myclass@auf.edu.ph">myclass@auf.edu.ph</a> using your <a href="https://mail.auf.edu.ph/" target="_blank" rel="noopener noreferrer">MyAU Mail</a>.</p>
              </div>
            </details>
          </section>
        </div>
      </section>
      <Note />
    </>
  );
}

function ClearancePage() {
  const { currentBalance: activeBalance, circulationDetails: activeCirculation, disciplineStatus: activeDiscipline, otherPendingClearances: activeClearances } = usePortalData();
  const { amount, status } = activeBalance;
  const circulationRows = activeCirculation.map(([detail, value]) => [detail, value]);
  const activeNotices = activeDiscipline.activeNotices.length
    ? activeDiscipline.activeNotices.map(({ title }) => title).join(", ")
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
              ["Current standing", activeDiscipline.currentStanding],
              ["Active violation notices", activeNotices],
            ]}
            label="Violation clearance and discipline status"
          />
        </Panel>
        <Panel title="Other Violation Clearance Items" subtitle="Non-payment requirements that need attention">
          <DataTable
            headers={["Posted by", "Amount / quantity", "Requirement", "Status", "Date posted", "Due date"]}
            rows={activeClearances}
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
  const { profile } = usePortalData();
  const [submitted, setSubmitted] = useLocalStorage(`myau-admission-documents-${profile.id}`, []);
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
    ["Form 138 / Senior High School Record", <Badge key="received-1">Received</Badge>, "No action needed"],
    ["PSA Birth Certificate", <Badge tone="warning" key="review">For review</Badge>, "Review in progress"],
    ["Certificate of Good Moral Character", <Badge key="received-2">Received</Badge>, "No action needed"],
  ];

  return (
    <>
      <PageIntro page={pages["submit-admission-requirement"]} />
      <Panel title="Sample admission requirements"><DataTable headers={["Document", "Status", "Next step"]} rows={requirementRows} label="Admission requirement status" /></Panel>
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
  const { profile, subjects: activeSubjects } = usePortalData();
  const activeCheckListTerms = profile.program === "BSCE"
    ? [
      { year: "1st Year", semester: "2nd Semester", requiredUnits: 24, creditedUnits: 24, courses: activeSubjects.slice(0, 4).map(([code, title, , units], index) => ({ code, title, units: Number(units), earnedUnits: Number(units), grade: 88 + index, status: "passed" })) },
      { year: "2nd Year", semester: "1st Semester", requiredUnits: 24, creditedUnits: 24, courses: activeSubjects.slice(4).map(([code, title, , units], index) => ({ code, title, units: Number(units), earnedUnits: Number(units), grade: 90 + index, status: "passed" })) },
    ]
    : checkListTerms;
  const rowCount = Math.max(...activeCheckListTerms.map(({ courses }) => courses.length));
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
                {activeCheckListTerms.filter((_, index) => index % 2 === 0).map(({ year }) => (
                  <th className="checklist-year-heading" scope="colgroup" colSpan="2" key={year}>{year}</th>
                ))}
              </tr>
              <tr>
                {activeCheckListTerms.map((term, index) => (
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
                  {activeCheckListTerms.map((term, termIndex) => {
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
  const { profile, subjects: activeSubjects, gradingRecords: activeGrades } = usePortalData();
  const hasTermRecords = term === "1st Semester" && startYear === "2026" && endYear === "2027";
  const grades = hasTermRecords ? activeSubjects.map(([code, title, , credit]) => {
    const record = activeGrades.find((item) => item.code === code);
    const grade = examPeriod === "Midterm" ? record?.midtermGrade ?? "Not posted" : "Not posted";
    return {
      code,
      title,
      credit,
      instructor: record?.instructor ?? "Faculty member",
      grade,
      remarks: examPeriod === "Midterm" ? "Passed" : "—",
      isEncoded: examPeriod === "Midterm",
    };
  }) : [];

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
        <h2 className="grading-title">Grades by exam period</h2>
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
          <button className="grading-view-button" type="submit">View grades</button>
        </form>
        {showGrades && (
          <section className="grading-results" aria-live="polite">
            <p className="grading-note">Red grades are sample values that have not been verified by the registrar. “Not posted” means no grade is shown.</p>
            <h3>{examPeriod} Grades · {term} · {startYear}–{endYear}</h3>
            {grades.length === 0 ? <p className="empty-state">No sample grade records are available for {term}, {startYear}–{endYear}.</p> : <div className="grading-table-scroll" role="region" aria-label={`${examPeriod} grades for ${term}, ${startYear}-${endYear}`} tabIndex="0">
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
        )}
      </section>
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

const feePaymentSubjects = [
  ["CEDDES", "COMPUTER ENGINEERING DRAFTING AND DESIGN", "TH 1:00PM–4:00PM", "BSCPE 3-A/EA-512", "1.0"],
  ["CISCO2", "CISCO 2", "M 9:00AM–12:00PM", "BSCPE 3-A/EA-612", "3.0"],
  ["DADICO", "DATA AND DIGITAL COMMUNICATIONS", "M 1:00PM–4:00PM", "BSCPE 3-A/EA-303", "3.0"],
  ["ELECT1", "COGNATE/ELECTIVE COURSE 1", "W 4:30PM–7:30PM", "BSCPE 3-A/EA-512", "3.0"],
  ["FECOSY", "FEEDBACK AND CONTROL SYSTEM", "W 9:00AM–12:00PM", "BSCPE 3-A/EA-506 / EA-512", "4.0"],
  ["INTHDL", "INTRODUCTION TO HDL", "W 1:00PM–4:00PM", "BSCPE 3-A/EA-512", "1.0"],
  ["LOCIDE", "LOGIC CIRCUIT AND DESIGN", "T 1:00PM–4:00PM", "BSCPE 3-A/EA-504", "4.0"],
  ["OPESYS", "OPERATING SYSTEM", "F 1:00PM–4:00PM", "BSCPE 3-A/EA-603", "3.0"],
];

const otherCharges = [
  ["ACCIDENT INSURANCE", "100.00"], ["AUF HEALTH PROGRAM", "224.00"], ["CPA FEE", "200.00"], ["ICPE MEMBERSHIP FEE", "1,000.00"],
  ["INTERNET (LMS FEE)", "605.00"], ["PIONEER", "100.00"], ["RECOLLECTION FEE", "947.00"], ["SAF", "1,500.00"],
  ["USC", "100.00"], ["CISCO FEE", "764.00"], ["CEDDES LAB", "2,297.00"], ["CISCO 2 LAB", "2,297.00"],
  ["ELECT1 LAB FEE", "1,919.00"], ["FECOSY LAB", "1,919.00"], ["INTHDL LAB", "1,919.00"], ["LOCIDE LAB", "1,919.00"],
];

function FeePaymentDocument() {
  const { profile, subjects: activeSubjects, fee } = usePortalData();
  const documentSubjects = profile.program === "BSCE"
    ? activeSubjects.map(([code, title, , units], index) => [code, title.toUpperCase(), ["M 8:00AM–11:00AM", "T 1:00PM–4:00PM", "W 8:00AM–11:00AM", "TH 1:00PM–4:00PM"][index % 4], `BSCE 2-A/CE-${201 + index}`, units])
    : feePaymentSubjects;
  const totalUnits = documentSubjects.reduce((sum, [, , , , units]) => sum + Number(units), 0).toFixed(1);
  const feeData = fee ?? { tuition: "48,056.00", miscellaneous: "6,848.00", otherCharges: "17,810.00", assessment: "72,714.00", grant: "12,014.00", paid: "5,000.00", balance: "55,700.00" };
  const printedAt = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
  return (
    <>
      <div className="document-page-actions">
        <button className="button button-primary" type="button" onClick={() => window.print()}><Icon name="file" /> Print or save as PDF</button>
      </div>
      <article className="fee-payment-document" aria-labelledby="fee-payment-title">
        <header className="fee-document-header">
          <div><h1 id="fee-payment-title">FEE PAYMENT DETAILS</h1><p>1st Semester AY 2026 - 2027</p></div>
          <time>Date and time printed: {printedAt}</time>
        </header>

        <section className="fee-student-details" aria-label="Student details">
          <dl><div><dt>Student ID</dt><dd>{profile.id}</dd></div><div><dt>Student Name</dt><dd>{profile.name}</dd></div><div><dt>Student type</dt><dd>Old / Regular</dd></div></dl>
          <dl><div><dt>Course/Major</dt><dd>{profile.program === "BSCE" ? "Bachelor of Science in Civil Engineering" : "Bachelor of Science in Computer Engineering"}</dd></div><div><dt>Year Level</dt><dd>{profile.yearLevel}</dd></div></dl>
          <dl><div><dt>Gender</dt><dd>Male</dd></div></dl>
        </section>

        <section className="fee-subjects" aria-labelledby="fee-subjects-title">
          <h2 id="fee-subjects-title" className="visually-hidden">Enrolled subjects</h2>
          <table>
            <thead><tr><th>Subject code</th><th>Subject title</th><th>Schedule</th><th>Section/Room #</th><th>Units taken</th></tr></thead>
            <tbody>{documentSubjects.map(([code, title, schedule, room, units]) => <tr key={code}><td data-label="Subject code">{code}</td><td data-label="Subject title">{title}</td><td data-label="Schedule">{schedule}</td><td data-label="Section/Room #">{room}</td><td data-label="Units taken">{units}</td></tr>)}</tbody>
          </table>
          <p className="fee-total-units">TOTAL LOAD UNITS: <strong>{totalUnits}</strong></p>
        </section>

        <section className="fee-financial-details">
          <div className="fee-charge-summary">
            <dl><div><dt>TUITION FEE</dt><dd>{feeData.tuition}</dd></div><div><dt>MISCELLANEOUS FEES</dt><dd>{feeData.miscellaneous}</dd></div></dl>
            <h2>OTHER CHARGES</h2>
            <dl>{otherCharges.map(([label, amount]) => <div key={label}><dt>{label}</dt><dd>{amount}</dd></div>)}<div className="fee-subtotal"><dt>TOTAL OTHER CHARGE</dt><dd>{feeData.otherCharges}</dd></div></dl>
            <dl className="fee-grand-totals"><div><dt>TOTAL ASSESSMENT</dt><dd>Php {feeData.assessment}</dd></div><div><dt>OLD ACCOUNT</dt><dd>Php 0.00</dd></div><div><dt>SCHOLARSHIP/GRANT APPLIED</dt><dd>Php {feeData.grant}</dd></div><div><dt>BALANCE AFTER GRANT AND DOWNPAYMENT</dt><dd>Php {feeData.balance}</dd></div></dl>
          </div>
          <div className="fee-payment-summary">
            <dl><div><dt>PAYMENT MODE</dt><dd>Installment</dd></div><div><dt>AMOUNT PAID</dt><dd>{feeData.paid}</dd></div><div><dt>DATE PAID</dt><dd>07/18/2026</dd></div><div><dt>PAYMENT TYPE</dt><dd>Cash</dd></div><div><dt>REFERENCE NUMBER</dt><dd>0007900</dd></div></dl>
            <p className="fee-receipt">(Business Office) Receipt printed by: <u>{profile.name}</u></p>
            <dl className="fee-installments"><div><dt>PRELIM DUE</dt><dd>18,500.00</dd></div><div><dt>MIDTERM DUE</dt><dd>18,500.00</dd></div><div><dt>FINAL DUE</dt><dd>18,700.00</dd></div></dl>
            <p className="fee-note">(NOTE: Above installment schedule may change based on actual payment and after enrolment adjustments.)</p>
          </div>
        </section>
      </article>
    </>
  );
}

const ledgerTerms = [
  {
    schoolYear: "2024–2025", semester: "First Semester", balance: "0.00", entries: [
      ["07/18/2024", "Tuition and school fees", "—", "54,400.00", "—", "54,400.00"],
      ["07/18/2024", "Enrollment/downpayment - Cash", "Business Office", "—", "10,000.00", "44,400.00"],
      ["09/12/2024", "Tuition - Cash", "Business Office", "—", "22,200.00", "22,200.00"],
      ["11/15/2024", "Tuition - Cash", "Business Office", "—", "22,200.00", "0.00"],
    ],
  },
  {
    schoolYear: "2024–2025", semester: "Second Semester", balance: "0.00", entries: [
      ["01/16/2025", "Tuition and school fees", "—", "53,850.00", "—", "53,850.00"],
      ["01/16/2025", "Enrollment/downpayment - Cash", "Business Office", "—", "10,000.00", "43,850.00"],
      ["03/11/2025", "Tuition - Cash", "Business Office", "—", "21,925.00", "21,925.00"],
      ["05/15/2025", "Tuition - Cash", "Business Office", "—", "21,925.00", "0.00"],
    ],
  },
  {
    schoolYear: "2025–2026", semester: "First Semester", balance: "0.00", entries: [
      ["07/17/2025", "Tuition and school fees", "—", "59,600.00", "—", "59,600.00"],
      ["07/17/2025", "Enrollment/downpayment - Cash", "Business Office", "—", "12,000.00", "47,600.00"],
      ["09/18/2025", "Academic grant", "—", "—", "8,000.00", "39,600.00"],
      ["11/14/2025", "Tuition - Cash", "Business Office", "—", "39,600.00", "0.00"],
    ],
  },
  {
    schoolYear: "2025–2026", semester: "Second Semester", balance: "0.00", entries: [
      ["01/15/2026", "Tuition and school fees", "—", "61,150.00", "—", "61,150.00"],
      ["01/15/2026", "Enrollment/downpayment - Cash", "Business Office", "—", "12,000.00", "49,150.00"],
      ["03/13/2026", "Tuition - Cash", "Business Office", "—", "24,575.00", "24,575.00"],
      ["05/16/2026", "Tuition - Cash", "Business Office", "—", "24,575.00", "0.00"],
    ],
  },
  { schoolYear: "2026–2027", semester: "First Semester", balance: "35,700.00", entries: ledgerEntries },
];

function LedgerPage() {
  const { ledgerEntries: activeLedgerEntries, currentBalance: activeBalance } = usePortalData();
  const [schoolYear, setSchoolYear] = useState("2026–2027");
  const [semester, setSemester] = useState("First Semester");
  const accountLedgerTerms = [...ledgerTerms.slice(0, -1), { schoolYear: "2026–2027", semester: "First Semester", balance: activeBalance.amount.replace("₱", ""), entries: activeLedgerEntries }];
  const schoolYears = [...new Set(accountLedgerTerms.map(({ schoolYear: value }) => value))];
  const semesters = [...new Set(accountLedgerTerms.map(({ semester: value }) => value))];
  const visibleTerms = accountLedgerTerms.filter((term) => (schoolYear === "all" || term.schoolYear === schoolYear) && (semester === "all" || term.semester === semester));
  const latestBalance = visibleTerms.at(-1)?.balance ?? "0.00";

  return (
    <>
      <PageIntro page={pages.ledger} />
      <section className="ledger-filter-panel" aria-labelledby="ledger-filter-title">
        <div><h2 id="ledger-filter-title">Ledger history</h2><p>View one term or every recorded term from your first semester through the current semester.</p></div>
        <div className="ledger-filters">
          <label>School year<select value={schoolYear} onChange={(event) => setSchoolYear(event.target.value)}><option value="all">All school years</option>{schoolYears.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <label>Semester<select value={semester} onChange={(event) => setSemester(event.target.value)}><option value="all">All semesters</option>{semesters.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        </div>
      </section>
      <div className="ledger-history-summary"><span>{visibleTerms.length === accountLedgerTerms.length ? "Showing all recorded terms" : `Showing ${visibleTerms.length} filtered ${visibleTerms.length === 1 ? "term" : "terms"}`}</span><strong>Latest balance: ₱{latestBalance}</strong></div>
      <div className="ledger-term-list">
        {visibleTerms.map((term) => (
          <section className="ledger-term" key={`${term.schoolYear}-${term.semester}`}>
            <header className="ledger-term-header"><div><p>School year {term.schoolYear}</p><h2>{term.semester}</h2></div><span className={term.balance === "0.00" ? "ledger-balance cleared" : "ledger-balance"}>{term.balance === "0.00" ? "Cleared" : `Balance ₱${term.balance}`}</span></header>
            <DataTable headers={["Date", "Particulars", "Collected by", "Debit", "Credit", "Balance"]} rows={term.entries} label={`${term.schoolYear} ${term.semester} ledger`} />
          </section>
        ))}
      </div>
      {visibleTerms.length === 0 && <p className="empty-state">No ledger entries match this filter.</p>}
    </>
  );
}

function EnrollmentPage({ pageId }) {
  const { subjects: activeSubjects, gradingRecords: activeGrades, enrolledTerm: activeTerm, periodicDues: activeDues } = usePortalData();
  if (pageId === "enrollment") return <Overview page={pages[pageId]} ids={["subjects-enrolled", "fees-paid-during-enrollment", "submit-admission-requirement"]} />;
  if (pageId === "student-account") return <Overview page={pages[pageId]} ids={["ledger", "periodic-dues"]} />;
  if (pageId === "subjects-enrolled") {
    const rows = activeSubjects.map(([code, title, lecLabUnits, totalUnits]) => [code, title, lecLabUnits, totalUnits, activeGrades.find((record) => record.code === code)?.instructor ?? "To be announced"]);
    const totalUnits = activeSubjects.reduce((sum, [, , , units]) => sum + Number(units), 0).toFixed(1);
    return (
      <>
        <PageIntro page={pages[pageId]}><button className="button button-primary print-action" type="button" onClick={() => window.print()}><Icon name="file" /> Print or save as PDF</button></PageIntro>
        <Panel className="subjects-enrolled-paper" title={`Enrolled ${activeTerm.label}`} subtitle={`Enrollment date: ${activeTerm.officialDate}`}>
          <div className="term-summary">
            <span>Maximum units this semester <strong>{activeTerm.maximumUnits}</strong></span>
            <span>Total units load taken <strong>{totalUnits}</strong></span>
          </div>
          <DataTable headers={["Subject code", "Subject title", "LEC/LAB units", "Total units", "Faculty assigned"]} rows={rows} label="Subjects enrolled" />
        </Panel>
      </>
    );
  }
  if (pageId === "fees-paid-during-enrollment") return <FeePaymentDocument />;
  if (pageId === "submit-admission-requirement") return <AdmissionPage />;
  if (pageId === "ledger") return <LedgerPage />;
  const duesRows = activeDues.map(([period, required, cumulative]) => [period, required, cumulative]);
  return (
    <>
      <PageIntro page={pages[pageId]} />
      <div className="account-term-summary">
        <span>Term <strong>First Semester, 2026–2027</strong></span>
        <span>Enrollment status <Badge>Enrolled</Badge></span>
      </div>
      <Panel title="Payment schedule" subtitle="Original installment amounts in PHP; payments and grants are reflected in the current ledger balance.">
        <DataTable headers={["Payment period", "Required amount", "Cumulative balance"]} rows={duesRows} label="Periodic dues schedule" />
      </Panel>
    </>
  );
}

function LibraryContent({ pageId }) {
  if (pageId === "library") {
    return <><PageIntro page={pages[pageId]} /><Panel title="Research databases"><p className="panel-copy">Access to licensed databases may require your AUF credentials.</p><Link className="button button-primary" to="/pages/ebsco-database.html">Open EBSCO Database <Icon name="arrow" /></Link></Panel></>;
  }
  return <><PageIntro page={pages[pageId]} /><Panel title="EBSCO research database"><p className="panel-copy">You may need to sign in with your AUF credentials to use licensed resources.</p><a className="button button-primary" href="https://search.ebscohost.com/" target="_blank" rel="noopener noreferrer">Continue to EBSCO <Icon name="arrow" /></a></Panel></>;
}

const evaluationSections = [
  { title: "Instructional Management", questions: [
    "Our instructor informs us of the session objectives.", "Our instructor discusses lessons in a systematic and coherent manner.", "Our instructor provides opportunities for active participation in class.", "Our instructor asks relevant questions about the lesson.", "Our instructor responds to questions and comments by clarifying or summarizing the key points.", "Our instructor uses relevant and engaging materials and resources.", "Our instructor uses real-life examples when appropriate.", "Our instructor connects the current lesson to previous lessons or other courses.", "Our instructor uses assessments that let us demonstrate our understanding and application of course content.", "Our instructor gives us a reasonable amount of time to complete tasks.", "Our instructor uses English as the language of instruction.", "Our instructor sustains our attention and interest in lessons.", "Our instructor designs learning activities that encourage curiosity.", "Our instructor designs learning activities that stimulate critical thinking.", "Our instructor makes effective use of resources and tools for the course format (online, hybrid, or in person).", "Our instructor uses varied materials and strategies in course discussions (for example, videos, demonstrations, lectures, podcasts, and group work).", "Our instructor publishes course modules on time.", "Our instructor provides meaningful, constructive feedback within a reasonable time.",
  ] },
  { title: "Classroom Management", questions: ["Our instructor begins and ends the class on time.", "Our instructor ends the class with the AUF prayer.", "Our instructor ensures that teaching and learning tools are readily available for the class.", "Our instructor effectively addresses disruptive behaviors whenever they arise in our class."] },
  { title: "Positive Learning Environment", questions: ["Our instructor acknowledges our positive contributions to learning.", "Our instructor is available during their stated consultation hours.", "Our instructor responds to student messages and questions within a reasonable time during office hours.", "Our instructor allows us to make up missed requirements when we provide a valid reason.", "Our instructor comes to class well-groomed.", "Our instructor treats students with respect.", "Our instructor is approachable and accommodating."] },
];

function FacultyEvaluation() {
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
        <header className="faculty-evaluation-header"><h2 id="faculty-evaluation-form-title">Faculty teaching performance evaluation</h2><p>Rate each statement from 1 (Strongly disagree) to 5 (Strongly agree). Demo responses are stored on this device only.</p></header>
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

function PaymentPage() {
  const [session] = useLocalStorage("myau-demo-session", null);
  const account = demoAccounts.find((item) => item.username === session?.username) ?? demoAccounts[0];
  const profileStorageKey = account.username === "AUFAGUIRRE15" ? "myau-personal-info-AUFAGUIRRE15-v2" : "myau-personal-info-MYAUDEMO-v2";
  const [profile] = useLocalStorage(profileStorageKey, account.profile);
  const accountData = account.data ?? {};
  const activeBalance = accountData.currentBalance ?? currentBalance;
  const activeDues = accountData.periodicDues ?? periodicDues;
  const activeLedger = accountData.ledgerEntries ?? ledgerEntries;
  const activeFee = accountData.fee ?? { assessment: "72,714.00", grant: "12,014.00", paid: "25,000.00" };
  const [paymentType, setPaymentType] = useState("installment");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const paymentTypes = [
    { id: "installment", label: "Installment fee", description: "Pay a scheduled installment.", amount: `₱${activeDues[1][1]}` },
    { id: "other-fee", label: "Other school fee", description: "Settle laboratory or service-related fees.", amount: "₱1,919.00" },
    { id: "downpayment", label: "Downpayment", description: "Make an additional payment to your balance.", amount: "₱5,000.00" },
  ];
  const selectedPayment = paymentTypes.find(({ id }) => id === paymentType);

  function previewPayment() {
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setFeedback(`Demo preview ready for ${selectedPayment.label} using ${paymentMethod === "card" ? "card" : paymentMethod === "wallet" ? "e-wallet" : "online banking"}. No payment was processed.`);
      setLoading(false);
    }, 450);
  }

  return (
    <main className="payment-standalone" aria-label="Online payment">
      <header className="payment-standalone-header">
        <Link className="payment-brand" to="/index.html#dashboard"><span>AUF</span><strong>MyAU Pay</strong></Link>
        <Link className="payment-return" to="/index.html#dashboard">Back to portal <Icon name="arrow" /></Link>
      </header>
      <div className="payment-standalone-content">
        <section className="payment-summary-card" aria-labelledby="payment-summary-title">
          <div><p className="payment-eyebrow">Student account</p><h1 id="payment-summary-title">Payment summary</h1><p className="payment-student-name">{profile.name} <span>· {profile.id}</span></p></div>
          <div className="payment-balance-overview"><span>Outstanding balance</span><strong>{activeBalance.amount}</strong><small>First Semester, 2026–2027</small></div>
        </section>
        <section className="payment-checkout" aria-labelledby="make-payment-title">
          <div className="payment-checkout-main">
            <h2 id="make-payment-title">Make a payment</h2>
            <p>Choose what you would like to pay, then select a payment method.</p>
            <p className="payment-demo-note">Demonstration only. No payment is processed.</p>
            <div className="payment-type-options" role="radiogroup" aria-label="Payment type">
              {paymentTypes.map((option) => <label className={`payment-type-option${paymentType === option.id ? " selected" : ""}`} key={option.id}>
                <input type="radio" name="payment-type" value={option.id} checked={paymentType === option.id} onChange={() => { setPaymentType(option.id); setFeedback(""); }} />
                <span><strong>{option.label}</strong><small>{option.description}</small></span><b>{option.amount}</b>
              </label>)}
            </div>
            <h3>Payment method</h3>
            <div className="payment-method-options" role="radiogroup" aria-label="Payment method">
              {[['card', 'Card', 'Debit or credit card'], ['wallet', 'E-wallet', 'GCash or Maya'], ['bank', 'Online banking', 'Bank transfer']].map(([id, label, detail]) => <label className={paymentMethod === id ? "selected" : ""} key={id}>
                <input type="radio" name="payment-method" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} />
                <span><strong>{label}</strong><small>{detail}</small></span>
              </label>)}
            </div>
          </div>
          <aside className="payment-order-summary">
            <h2>Payment details</h2>
            <dl><div><dt>Payment for</dt><dd>{selectedPayment.label}</dd></div><div><dt>Amount</dt><dd>{selectedPayment.amount}</dd></div></dl>
            <button className="button button-primary" type="button" onClick={previewPayment} disabled={loading}>{loading ? <><span className="loading-spinner" />Preparing…</> : "Preview payment"}</button>
            <Feedback>{feedback}</Feedback>
          </aside>
        </section>
        <section className="payment-help" aria-labelledby="payment-help-title">
          <div><p className="payment-eyebrow">Help</p><h2 id="payment-help-title">Payment instructions</h2><p>Review the payment process before you continue.</p><div className="payment-help-actions"><a className="button button-secondary" href="/payment_instruction.pdf" target="_blank" rel="noreferrer">Open PDF <Icon name="external" /></a><a className="text-link" href="/payment_instruction.pdf" download>Download PDF</a></div></div>
          <iframe src="/payment_instruction.pdf#view=FitH" title="Payment instructions PDF" />
        </section>
        <section className="payment-account-details" aria-labelledby="payment-account-details-title">
          <div className="payment-section-heading"><div><p className="payment-eyebrow">Account details</p><h2 id="payment-account-details-title">Charges and payment activity</h2></div><span>Current term</span></div>
          <div className="payment-tables">
            <section><h3>Current charges</h3><table><thead><tr><th>Item</th><th>Amount</th></tr></thead><tbody><tr><td>Tuition and school fees</td><td>₱{activeFee.assessment}</td></tr><tr><td>Scholarship / grant</td><td>− ₱{activeFee.grant}</td></tr><tr><td>Payments received</td><td>− ₱{activeFee.paid}</td></tr></tbody></table></section>
            <section><h3>Installment schedule</h3><p className="payment-table-note">Original schedule. Grants and payments applied to date are reflected in the outstanding balance.</p><table><thead><tr><th>Due period</th><th>Amount</th></tr></thead><tbody>{activeDues.map(([period, amount]) => <tr key={period}><td>{period}</td><td>₱{amount}</td></tr>)}</tbody></table></section>
            <section><h3>Recent payments</h3><table><thead><tr><th>Date</th><th>Amount</th></tr></thead><tbody>{activeLedger.filter(([, , , debit, credit]) => debit === "—" && credit !== "0.00").slice(-3).reverse().map(([date, , , , credit]) => <tr key={`${date}-${credit}`}><td>{date}</td><td>₱{credit}</td></tr>)}</tbody></table></section>
          </div>
        </section>
      </div>
    </main>
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
