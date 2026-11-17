import { Fragment, useEffect, useRef, useState } from "react";
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
import { useSessionStorage } from "../hooks/useSessionStorage.js";
import { useStudentProfile } from "../contexts/StudentProfileContext.jsx";
import { demoAccounts } from "../data/demoAccounts.js";
import Icon from "../components/Icon.jsx";
import { Badge, DataTable, Feedback, PageHeading, Panel, SectionCards } from "../components/UI.jsx";

function PageIntro({ page, children }) {
  return <PageHeading page={page}>{children}</PageHeading>;
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
    { image: "msacot_greetings.png", alt: "The AUF dog mascot greeting students", kicker: "Your AUF companion", title: "Welcome back, Angelenean!", message: "Your dashboard brings campus updates, classes, and account details together.", action: "View my dashboard", to: "/index.html#dashboard" },
    { image: "mascot_happy.png", alt: "The AUF dog mascot smiling brightly", kicker: "Keep up the good work", title: "Every course counts.", message: "Review your academic progress and celebrate the effort behind each result.", action: "View academic records", to: "/index.html#academic-performance" },
    { image: "mascot_movingforward.png", alt: "The AUF dog mascot moving forward", kicker: "Ready for your next step?", title: "Keep moving forward.", message: "Checking grades, completing requirements, and asking for support all move you toward your goals.", action: "Academic records", to: "/index.html#academic-performance" },
    { image: "mascot_resting.png", alt: "The AUF dog mascot taking a nap", kicker: "A gentle reminder", title: "Take a breather.", message: "Pause between study sessions, then return to your course plan when you feel ready.", action: "View my courses", to: "/index.html#subjects-enrolled" },
    { image: "mascot_wink.png", alt: "The AUF dog mascot winking", kicker: "Your voice matters", title: "Share your class feedback.", message: "Tell the university about your learning experience through Faculty Evaluation.", action: "Evaluate a class", to: "/pages/faculty-evaluation.html" },
    hasPendingClearance
      ? { image: "mscot_notice.png", alt: "The AUF dog mascot showing a reminder", kicker: "Clearance reminder", title: "Review your clearance.", message: "Check Student Clearance for any pending payment, library, or conduct requirements.", action: "Open clearance", to: "/index.html#student-clearance" }
      : { image: "mascot_asking.png", alt: "The AUF dog mascot asking a question", kicker: "Clearance update", title: "Your clearance is complete.", message: "You have no pending clearance items right now. Check back when you prepare to enroll.", action: "View clearance", to: "/index.html#student-clearance" },
  ];
  const [mascotIndex, setMascotIndex] = useState(0);
  const [mascotHovered, setMascotHovered] = useState(false);
  const [mascotFocused, setMascotFocused] = useState(false);
  const mascot = mascotMessages[mascotIndex];
  useEffect(() => {
    if (mascotHovered || mascotFocused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      setMascotIndex((index) => (index + 1) % mascotMessages.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [mascotMessages.length, mascotHovered, mascotFocused]);
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
      <section
        className="hero"
        aria-labelledby="hero-title"
        onMouseEnter={() => setMascotHovered(true)}
        onMouseLeave={() => setMascotHovered(false)}
        onFocus={() => setMascotFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMascotFocused(false);
        }}
      >
        <div className="hero-content">
          <p className="hero-kicker">{mascot.kicker}</p><h2 id="hero-title">{mascot.title}</h2>
          <p id="mascot-message" aria-live="off">{mascot.message}</p>
          <Link className="button button-light" to={mascot.to}>{mascot.action} <Icon name="arrow" /></Link>
        </div>
        <div className="hero-art mascot-art" aria-hidden="true">
          <img className={`mascot-image${mascot.image === "mascot_resting.png" ? " mascot-image-resting" : ""}`} key={`${mascot.image}-${mascot.title}`} src={`/img/mascot/${mascot.image}`} alt="" />
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
            <details className="dashboard-help-details" open>
              <summary>Setup and support</summary>
              <div className="dashboard-help-copy">
                <p><strong>New students:</strong> Your MyAU Mail account and login credentials are sent to your registered personal email after admission. Check your spam folder if they are missing.</p>
                <p>For help, email <a href="mailto:mailadmin@auf.edu.ph">mailadmin@auf.edu.ph</a> and attach an image of your AUF ID or another identification document.</p>
              </div>
            </details>
            <a className="service-action" href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">Sign in to MyAU Mail <Icon name="arrow" /></a>
          </section>
          <section className="service-card dashboard-account-card">
            <div className="service-title"><img className="dashboard-brand-logo" src="/img/canvas_logo.png" alt="" aria-hidden="true" /><h2>MyClass · Canvas LMS</h2></div>
            <div className="app-store-links" aria-label="Canvas Student app downloads">
              <a href="https://play.google.com/store/apps/details?id=com.instructure.candroid" target="_blank" rel="noopener noreferrer">Google Play</a>
              <a href="https://apps.apple.com/app/id480883488" target="_blank" rel="noopener noreferrer">App Store</a>
            </div>
            <details className="dashboard-help-details" open>
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
    </>
  );
}

function SimpleDataPage({ page, title, headers, rows, label, subtitle, searchable = false, sortable = false, note, after }) {
  return (
    <>
      <PageIntro page={page} />
      <Panel title={title} subtitle={subtitle}>
        <DataTable headers={headers} rows={rows} label={label} searchable={searchable} sortable={sortable} />
      </Panel>
      {after}
      {note && <p className="table-total">{note}</p>}
    </>
  );
}

function AdmissionPage() {
  const { profile } = usePortalData();
  const [uploads, setUploads] = useState(() => profile.id === "24-1661-908" ? [
    { id: "picture-name", name: "2x2.png", type: "image/png", url: "/submitted-requirements/2x2.png", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "birth-certificate", name: "PSA.jpg", type: "image/jpeg", url: "/submitted-requirements/PSA.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "official-receipt", name: "official_receipt.jpg", type: "image/jpeg", url: "/submitted-requirements/official_receipt.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "report-card", name: "report_card.jpg", type: "image/jpeg", url: "/submitted-requirements/report_card.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "good-moral", name: "good_moral.jpg", type: "image/jpeg", url: "/submitted-requirements/good_moral.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "picture", name: "2x2.png", type: "image/png", url: "/submitted-requirements/2x2.png", uploadedAt: "06/22/2024", isObjectUrl: false },
  ] : []);
  const [previewId, setPreviewId] = useState(null);
  const pendingRequirements = [
    { id: "passport", label: "For Filipinos born abroad — valid Philippine passport data pages and latest arrival stamp page" },
    { id: "dual-citizenship", label: "For dual citizens — documentation for acquisition, reacquisition, or retention of Filipino citizenship" },
  ];
  const submittedRequirements = [
    { id: "picture-name", label: "2×2 picture with name (clear, well-defined, white background)", date: "06/22/2024" },
    { id: "birth-certificate", label: "PSA Birth Certificate (or issued by the country of origin)", date: "06/22/2024" },
    { id: "official-receipt", label: "Official Receipt (for payment of application fee)", date: "06/22/2024" },
    { id: "report-card", label: "Report Card (1st and 2nd Semester)", date: "06/22/2024" },
    { id: "good-moral", label: "Good Moral Certificate", date: "06/22/2024" },
    { id: "picture", label: "2×2 picture", date: "06/22/2024" },
  ];

  function uploadDocument(event, requirement) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploads((items) => {
      const existing = items.find((item) => item.id === requirement.id);
      if (existing?.isObjectUrl) URL.revokeObjectURL(existing.url);
      return [...items.filter((item) => item.id !== requirement.id), { ...requirement, name: file.name, type: file.type, url, uploadedAt: new Date().toLocaleString(), isObjectUrl: true }];
    });
    setPreviewId(requirement.id);
    event.target.value = "";
  }

  function removeUpload(id) {
    setUploads((items) => {
      const existing = items.find((item) => item.id === id);
      if (existing?.isObjectUrl) URL.revokeObjectURL(existing.url);
      return items.filter((item) => item.id !== id);
    });
    if (previewId === id) setPreviewId(null);
  }

  function RequirementRow({ requirement, pending = false }) {
    const upload = uploads.find((item) => item.id === requirement.id);
    const previewOpen = previewId === requirement.id && upload;
    const isImage = upload?.type.startsWith("image/");
    const isPdf = upload?.type === "application/pdf";
    return <article className="admission-requirement">
      <div className="admission-requirement-copy"><h3>{requirement.label}</h3><p>{pending ? "Upload when this requirement applies to you." : `Record date: ${requirement.date}`}</p>{upload && <p className="admission-file-name">{upload.name}</p>}</div>
      <div className="admission-requirement-actions"><label className="button button-secondary" htmlFor={`admission-${requirement.id}`}>{upload ? "Replace file" : "Upload file"}<input id={`admission-${requirement.id}`} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => uploadDocument(event, requirement)} /></label>{upload && <><button className="text-button" type="button" onClick={() => setPreviewId(previewOpen ? null : requirement.id)}>{previewOpen ? "Hide preview" : "Preview"}</button><button className="text-button admission-remove" type="button" onClick={() => removeUpload(requirement.id)}>Remove</button></>}</div>
      {previewOpen && <div className="admission-preview">{isImage ? <img src={upload.url} alt={`Preview of ${upload.name}`} /> : isPdf ? <iframe src={`${upload.url}#view=FitH`} title={`Preview of ${upload.name}`} /> : <a className="button button-secondary" href={upload.url} target="_blank" rel="noreferrer">Open selected file <Icon name="external" /></a>}</div>}
    </article>;
  }

  return (
    <>
      <PageIntro page={pages["submit-admission-requirement"]} />
      <section className="admission-page" aria-label="Admission requirements">
        <div className="admission-intro"><h2>Admission requirements</h2><p>Select a requirement to upload a PDF or image and preview it before leaving this page.</p></div>
        <section className="admission-group" aria-labelledby="pending-requirements-title"><h2 id="pending-requirements-title">Additional requirements, if applicable</h2>{pendingRequirements.map((requirement) => <RequirementRow requirement={requirement} pending key={requirement.id} />)}</section>
        <section className="admission-group" aria-labelledby="submitted-requirements-title"><h2 id="submitted-requirements-title">Submitted requirements</h2>{submittedRequirements.map((requirement) => <RequirementRow requirement={requirement} key={requirement.id} />)}</section>
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
      ["Program", profile.program],
      ["Year level", profile.yearLevel],
      ["Academic year", profile.academicYear],
      ["Address", [profile.addressLine, profile.barangay, profile.city, profile.province].filter(Boolean).join(", ") || "Not provided"],
      ["Contact mobile", profile.contactMobile || "Not provided"],
      ["Alternate contact number", profile.alternateContact || "Not provided"],
      ["Emergency contact", profile.emergencyContactName || "Not provided"],
      ["Emergency contact number", profile.emergencyContactNumber || "Not provided"],
      ["Relationship to emergency contact", profile.emergencyRelationship || "Not provided"],
    ];
    return (
      <>
        <PageIntro page={pages[pageId]} />
        <Panel title="Personal information">
          <div className="profile-view-heading">
            <img className="profile-photo" src="/submitted-requirements/2x2.png" alt="Student profile" />
            <p>Student profile photo</p>
          </div>
          <DataTable headers={["Information", "Details"]} rows={profileRows} label="Personal information" />
          <Link className="button button-primary personal-edit-button" to="/index.html#edit-personal-info">Edit personal information</Link>
        </Panel>
      </>
    );
  }
  if (pageId === "edit-personal-info") {
    function savePersonalInfo(event) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      setProfile((currentProfile) => ({
        ...currentProfile,
        addressLine: formData.get("address-line").trim(),
        barangay: formData.get("barangay").trim(),
        city: formData.get("city").trim(),
        province: formData.get("province").trim(),
        contactMobile: formData.get("contact-mobile").trim(),
        alternateContact: formData.get("alternate-contact").trim(),
        emergencyContactName: formData.get("emergency-contact-name").trim(),
        emergencyContactNumber: formData.get("emergency-contact-number").trim(),
        emergencyRelationship: formData.get("emergency-relationship").trim(),
      }));
      setFeedback("Personal information updated.");
    }

    return (
      <>
        <PageIntro page={pages[pageId]} />
        <section className="panel form-panel">
          <div className="panel-header"><div><h2>Student profile and contact information</h2><p>Student identity details are fixed. Update your address and contact information below.</p></div></div>
          <form className="demo-form profile-form" onSubmit={savePersonalInfo}>
            <section className="profile-overview" aria-label="Student profile">
              <div className="profile-photo-wrap">
                <img className="profile-photo" src="/submitted-requirements/2x2.png" alt="Student profile" />
                <span>2 × 2 profile photo</span>
              </div>
              <div className="profile-overview-details">
                <h3>Fixed student information</h3>
                <div className="profile-fixed-grid">
                  <label htmlFor="personal-name">Student name<input id="personal-name" type="text" value={profile.name} disabled /></label>
                  <label className="profile-field-wide" htmlFor="personal-email">Email address<input id="personal-email" type="email" value={profile.email ?? ""} title={profile.email ?? ""} disabled /></label>
                  <label htmlFor="personal-id">Student ID<input id="personal-id" type="text" value={profile.id} disabled /></label>
                  <label htmlFor="personal-program">Program<input id="personal-program" type="text" value={profile.program} disabled /></label>
                  <label htmlFor="personal-year">Year level<input id="personal-year" type="text" value={profile.yearLevel} disabled /></label>
                  <label htmlFor="personal-academic-year">Academic year<input id="personal-academic-year" type="text" value={profile.academicYear} disabled /></label>
                </div>
              </div>
            </section>
            <div className="profile-section-heading"><h3>Address and contact information</h3><p>Keep these details current so the university can reach you.</p></div>
            <div className="profile-field-grid">
              <label className="profile-field-wide" htmlFor="personal-address-line">House number and street<input id="personal-address-line" name="address-line" type="text" maxLength="150" defaultValue={profile.addressLine ?? ""} autoComplete="street-address" /></label>
              <label htmlFor="personal-barangay">Barangay<input id="personal-barangay" name="barangay" type="text" maxLength="100" defaultValue={profile.barangay ?? ""} /></label>
              <label htmlFor="personal-city">City / Municipality<input id="personal-city" name="city" type="text" maxLength="100" defaultValue={profile.city ?? ""} autoComplete="address-level2" /></label>
              <label htmlFor="personal-province">Province<input id="personal-province" name="province" type="text" maxLength="100" defaultValue={profile.province ?? ""} autoComplete="address-level1" /></label>
              <label htmlFor="personal-mobile">Contact mobile<input id="personal-mobile" name="contact-mobile" type="tel" maxLength="30" defaultValue={profile.contactMobile ?? ""} autoComplete="tel" /></label>
              <label htmlFor="personal-alternate-contact">Alternate contact number<input id="personal-alternate-contact" name="alternate-contact" type="tel" maxLength="30" defaultValue={profile.alternateContact ?? ""} /></label>
            </div>
            <div className="profile-section-heading"><h3>Emergency contact</h3><p>Provide someone the university may contact if needed.</p></div>
            <div className="profile-field-grid">
              <label htmlFor="personal-emergency-name">Contact person<input id="personal-emergency-name" name="emergency-contact-name" type="text" maxLength="100" defaultValue={profile.emergencyContactName ?? ""} autoComplete="name" /></label>
              <label htmlFor="personal-emergency-number">Contact number<input id="personal-emergency-number" name="emergency-contact-number" type="tel" maxLength="30" defaultValue={profile.emergencyContactNumber ?? ""} /></label>
              <label htmlFor="personal-emergency-relationship">Relationship<input id="personal-emergency-relationship" name="emergency-relationship" type="text" maxLength="50" defaultValue={profile.emergencyRelationship ?? ""} /></label>
            </div>
            <button className="button button-primary" type="submit">Save personal information</button>
            <Feedback>{feedback}</Feedback>
          </form>
        </section>
      </>
    );
  }
  if (pageId === "print-personal-info") {
    return <><PageIntro page={pages[pageId]} /><Panel title="Print Personal Info"><p className="panel-copy">Print the current personal information view.</p><button className="button button-secondary" type="button" onClick={() => window.print()}>Print this page <Icon name="file" /></button></Panel></>;
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
      setFeedback("Your passwords match.");
      form.reset();
      setLoading(false);
    }, 300);
  }
  return (
    <>
      <PageIntro page={pages[pageId]} />
      <section className="panel form-panel">
        <div className="panel-header"><div><h2>Change Password</h2><p>Enter and confirm your new password.</p></div></div>
        <form className="demo-form" id="password-form" onSubmit={validatePassword}>
          <label htmlFor="new-password">New password</label><input id="new-password" name="new-password" type="password" minLength="8" autoComplete="new-password" required />
          <label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" name="confirm-password" type="password" minLength="8" autoComplete="new-password" required />
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="loading-spinner" />Checking…</> : "Confirm new password"}</button>
          <Feedback tone={feedback.startsWith("The passwords") ? "error" : "success"}>{feedback}</Feedback>
        </form>
      </section>
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
    </>
  );
}

function GradingPage() {
  const [examPeriod, setExamPeriod] = useState("Final");
  const [term, setTerm] = useState("2nd Semester");
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const { profile, subjects: activeSubjects, gradingRecords: activeGrades } = usePortalData();
  const schoolYearLabel = schoolYear.replace("-", "–");
  const historicalYearLevel = schoolYear === "2024-2025" ? "1st Year" : schoolYear === "2025-2026" ? "2nd Year" : null;
  const historicalTerm = checkListTerms.find((record) => record.year === historicalYearLevel && record.semester === term);
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

function LibraryContent() {
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

const documentSections = [
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

function DocumentsContent() {
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

function PaymentPage() {
  const [session] = useSessionStorage("myau-demo-session", null);
  const account = demoAccounts.find((item) => item.username === session?.username) ?? demoAccounts[0];
  const profileStorageKey = "myau-personal-info-AUFAGUIRRE15-v2";
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
      setFeedback(`Payment preview ready for ${selectedPayment.label} using ${paymentMethod === "card" ? "card" : paymentMethod === "wallet" ? "e-wallet" : "online banking"}.`);
      setLoading(false);
    }, 450);
  }

  return (
    <main className="payment-standalone" aria-label="Online payment">
      <header className="payment-standalone-header">
        <Link className="payment-brand" to="/index.html#dashboard"><img className="payment-brand-logo" src="/img/MYAU_logo.png" alt="" aria-hidden="true" /><strong>MyAU Pay</strong></Link>
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
  if (pageId === "documents") return <DocumentsContent />;
  if (pageId === "library") return <LibraryContent />;
  if (pageId === "faculty-evaluation") return <FacultyEvaluation />;
  if (pageId === "online-payment") return <PaymentPage />;
  return <PageIntro page={pages[pageId]} />;
}
