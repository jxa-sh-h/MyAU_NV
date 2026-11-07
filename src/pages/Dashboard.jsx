import { Link } from "react-router-dom";
import { announcements, availableSubjects, demoNote, initialClearance, subjects } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DemoNote, PageHeader, Panel, StatCard, StatusBadge } from "../components/UI.jsx";
import Icon from "../components/Icon.jsx";

const initialEnrolledIds = subjects.map(({ id }) => id);
const initialPreferences = { announcements: true, reminders: true, compactTables: false };

export default function Dashboard() {
  const [clearance] = useLocalStorage("myau.clearance", initialClearance);
  const [enrolledIds] = useLocalStorage("myau.enrolledSubjectIds", initialEnrolledIds);
  const [preferences] = useLocalStorage("myau.preferences", initialPreferences);
  const dueCount = clearance.filter(({ status }) => status !== "Cleared").length;
  const visibleAnnouncements = preferences.announcements
    ? announcements.filter((item) => preferences.reminders || item.id !== "midterms")
    : [];
  const today = new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());

  return (
    <>
      <PageHeader section="Student Portal" title="Welcome back" description="Your academic snapshot and the latest campus updates." actions={<span className="date-label"><Icon name="calendar" />{today}</span>} />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-kicker">Your semester, in focus</p>
          <h2 id="hero-title">Make this semester count.</h2>
          <p>Keep track of your classes, requirements, and campus updates—all in one place.</p>
          <Link className="button button-light" to="/enrollment">Review enrollment <Icon name="arrow" /></Link>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="hero-art-inner"><Icon name="book" /></div></div>
      </section>
      <div className="summary-grid">
        <StatCard icon="check" label="Clearance status" value={dueCount ? "In progress" : "Complete"} detail={`${dueCount} requirements remaining`} tone="teal" />
        <StatCard icon="book" label="Enrolled subjects" value={`${enrolledIds.length} subjects`} detail={`${enrolledIds.reduce((total, id) => total + ([...subjects, ...availableSubjects].find((subject) => subject.id === id)?.units ?? 0), 0)} academic units`} tone="blue" />
        <StatCard icon="wallet" label="Next periodic due" value="Nov 15" detail="Installment schedule" tone="amber" />
      </div>
      <section className="dashboard-columns" aria-label="Campus updates and student services">
        <div>
          <div className="section-heading"><h2>Updates for you</h2><Link className="text-link" to="/clearance">View clearance</Link></div>
          <Panel title="Important reminders" subtitle="Stay up to date with academic requirements" actions={<StatusBadge tone="warning">{dueCount} actions</StatusBadge>}>
            <div className="notice-list">
              {visibleAnnouncements.length ? visibleAnnouncements.map((item) => (
                <article className="notice-row" key={item.id}>
                  <span className={`notice-symbol ${item.tone}`}><Icon name={item.id === "midterms" ? "calendar" : "check"} /></span>
                  <div className="notice-copy"><h3 className="notice-title">{item.title}</h3><p className="notice-description">{item.description}</p></div>
                  <span className="notice-time">{item.time}</span>
                </article>
              )) : <p className="empty-announcements">Announcements are hidden in Settings.</p>}
            </div>
          </Panel>
        </div>
        <div className="right-column">
          <ServiceCard icon="user" title="Your AUF email" text="Use your student email for official university communication and announcements." link="/profile" linkText="Review profile" />
          <ServiceCard icon="book" title="Class resources" text="Keep up with course materials and announcements from your instructors." link="/class-schedule" linkText="View my classes" />
          <article className="intervention-card"><div className="service-title"><span className="service-icon service-icon-amber"><Icon name="check" /></span><h3>Academic support</h3></div><p>Connect with your faculty adviser to learn about academic support options.</p></article>
        </div>
      </section>
      <DemoNote>{demoNote}</DemoNote>
    </>
  );
}

function ServiceCard({ icon, title, text, link, linkText }) {
  return (
    <article className="service-card">
      <div className="service-title"><span className="service-icon"><Icon name={icon} /></span><h3>{title}</h3></div>
      <p>{text}</p>
      <Link className="service-action" to={link}>{linkText}<Icon name="arrow" /></Link>
    </article>
  );
}
