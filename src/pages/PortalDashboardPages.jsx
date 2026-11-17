import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pages } from "../data/mockData.js";
import Icon from "../components/Icon.jsx";
import { Badge, DataTable, PageHeading, Panel } from "../components/UI.jsx";
import { PageIntro, usePortalData } from "./PortalPageShared.jsx";

export function Dashboard() {
  const { profile, currentBalance: activeBalance, notices: activeNotices, circulationDetails: activeCirculation, disciplineStatus: activeDiscipline, otherPendingClearances: activeClearances } = usePortalData();
  const today = new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());
  const hasPendingClearance = activeBalance.status !== "Paid"
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
      <span className="summary-description"><span className="summary-label">Student clearance</span><span className="summary-meta">Review pending items</span></span><strong className="summary-title">Needs attention</strong>
    </Link>
  ) : (
    <article className="summary-card">
      <span className="summary-icon teal"><Icon name="check" /></span>
      <span className="summary-description"><span className="summary-label">Student clearance</span><span className="summary-meta">No pending requirements</span></span><strong className="summary-title">Cleared</strong>
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
        <article className="summary-card"><span className="summary-icon blue"><Icon name="graduation" /></span><span className="summary-description"><span className="summary-label">Academic interventions</span><span className="summary-meta">Ask about academic support options</span></span><strong className="summary-title">Talk to an adviser</strong></article>
        <Link className="summary-card" to="/pages/online-payment.html"><span className="summary-icon amber"><Icon name="wallet" /></span><span className="summary-description"><span className="summary-label">Account balance</span><span className="summary-meta">View payment details</span></span><strong className="summary-title">{activeBalance.status}</strong></Link>
        <Link className="summary-card" to="/pages/faculty-evaluation.html"><span className="summary-icon blue"><Icon name="star" /></span><span className="summary-description"><span className="summary-label">Faculty evaluation</span><span className="summary-meta">Share feedback on your classes</span></span><strong className="summary-title">Open evaluation</strong></Link>
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

export function ClearancePage() {
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
            <Badge tone={status === "Paid" ? "success" : "warning"}>{status.toUpperCase()}</Badge>
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
