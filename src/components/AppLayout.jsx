import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { announcements, pageInfo, student } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import Icon from "./Icon.jsx";
import { Modal } from "./UI.jsx";

const navigationGroups = [
  {
    title: "Academics",
    icon: "book",
    links: [
      { to: "/academic-records", label: "Academic Records", icon: "check" },
      { to: "/class-schedule", label: "Class Schedule", icon: "calendar" },
    ],
  },
  {
    title: "Student Services",
    icon: "check",
    links: [
      { to: "/enrollment", label: "Enrollment", icon: "book" },
      { to: "/clearance", label: "Clearance", icon: "check" },
    ],
  },
  {
    title: "My Account",
    icon: "user",
    links: [
      { to: "/profile", label: "Student Profile", icon: "user" },
      { to: "/payments", label: "Payments", icon: "wallet" },
    ],
  },
  {
    title: "University Services",
    icon: "book",
    links: [
      { to: "/library", label: "Library", icon: "book" },
      { to: "/faculty-evaluation", label: "Faculty Evaluation", icon: "check" },
    ],
  },
];
const defaultPreferences = { announcements: true, reminders: true, compactTables: false };

function StudentPanel() {
  const [logoutMessage, setLogoutMessage] = useState("");

  return (
    <section className="student-panel" aria-label="Student information">
      <div className="student-panel-header">
        <div className="avatar avatar-large" aria-hidden="true">AJ</div>
        <div className="student-info"><span className="student-id">{student.id}</span><strong title={student.name}>{student.name}</strong></div>
        <button className="logout-button" type="button" onClick={() => setLogoutMessage("Sign-out is not connected in this demonstration.")}>Logout</button>
      </div>
      <div className="student-meta">
        <span><small>Academic year</small><strong>{student.academicYear}</strong></span>
        <span><small>Year level</small><strong>{student.yearLevel}</strong></span>
        <span><small>Program</small><strong>{student.program}</strong></span>
      </div>
      {logoutMessage ? <p className="logout-status" role="status">{logoutMessage}</p> : null}
    </section>
  );
}

function Sidebar({ mobileOpen, collapsed, closeMobile, expandSidebar }) {
  const location = useLocation();
  const activeGroupTitle = navigationGroups.find((group) => group.links.some((link) => location.pathname.startsWith(link.to)))?.title;
  const [expanded, setExpanded] = useState(activeGroupTitle ?? "");

  useEffect(() => {
    if (activeGroupTitle) setExpanded(activeGroupTitle);
  }, [activeGroupTitle]);

  return (
    <>
      {mobileOpen ? <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={closeMobile} /> : null}
      <aside className={`sidebar${mobileOpen ? " is-open" : ""}${collapsed ? " is-collapsed" : ""}`} id="sidebar" aria-label="Main navigation">
        <StudentPanel />
        <nav className="primary-nav" aria-label="Student portal">
          <NavLink to="/" end aria-label="Dashboard" title={collapsed ? "Dashboard" : undefined} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={() => closeMobile()}>
            <Icon name="dashboard" /><span>Dashboard</span>
          </NavLink>
          {navigationGroups.map((group) => {
            const isExpanded = expanded === group.title;
            return (
              <section className="nav-group" key={group.title}>
                <div className="nav-group-heading">
                  <span className="nav-group-label"><Icon name={group.icon} /><span>{group.title}</span></span>
                  <button
                    className="nav-group-toggle"
                    type="button"
                    aria-label={collapsed ? `Expand sidebar to open ${group.title}` : `${isExpanded ? "Collapse" : "Expand"} ${group.title}`}
                    aria-expanded={!collapsed && isExpanded}
                    onClick={() => collapsed ? expandSidebar() : setExpanded(isExpanded ? "" : group.title)}
                  ><Icon name="chevron" /></button>
                </div>
                {isExpanded && !collapsed ? (
                  <div className="nav-submenu">
                    {group.links.map((link) => (
                      <NavLink key={link.to} to={link.to} aria-label={link.label} title={collapsed ? link.label : undefined} className={({ isActive }) => isActive ? "active" : ""} onClick={() => closeMobile()}>
                        <Icon name={link.icon} /><span>{link.label}</span>
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
          <NavLink to="/settings" aria-label="Settings" title={collapsed ? "Settings" : undefined} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={() => closeMobile()}>
            <Icon name="settings" /><span>Settings</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <span className="help-icon" aria-hidden="true">?</span>
          <span><strong>Need help?</strong><a href="mailto:studentservices@auf.edu.ph">Student Services</a></span>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, onCollapse, collapsed, mobileOpen, menuButtonRef, onNotifications, navigate, showNotificationDot }) {
  return (
    <header className="topbar">
      <button ref={menuButtonRef} className="icon-button menu-toggle" type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={onMenu}><Icon name="menu" /></button>
      <button className="desktop-collapse icon-button" type="button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} onClick={onCollapse}><Icon name="menu" /></button>
      <NavLink className="brand" to="/" aria-label="MYAU dashboard">
        <span className="brand-mark" aria-hidden="true">AUF</span>
        <span className="brand-copy"><strong>MYAU</strong><span>ANGELES UNIVERSITY FOUNDATION</span></span>
      </NavLink>
      <div className="topbar-tools">
        <span className="portal-label">STUDENT PORTAL · DEMO</span>
        <button className="icon-button notification-button" type="button" aria-label="View announcements" onClick={onNotifications}><Icon name="bell" />{showNotificationDot ? <span className="notification-dot" aria-hidden="true" /> : null}</button>
        <span className="topbar-divider" aria-hidden="true" />
        <button className="profile-button" type="button" onClick={() => navigate("/profile")} aria-label={`View profile for ${student.name}`}>
          <span className="avatar avatar-small">AJ</span><span className="profile-name">{student.name}</span><Icon className="chevron" name="chevron" />
        </button>
      </div>
    </header>
  );
}

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useLocalStorage("myau.sidebarCollapsed", false);
  const [theme, setTheme] = useLocalStorage("myau.theme", "light");
  const [preferences, setPreferences] = useLocalStorage("myau.preferences", defaultPreferences);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const menuButtonRef = useRef(null);

  function closeMobile(returnFocus = false) {
    setMobileOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }

  useEffect(() => {
    setMobileOpen(false);
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => { delete document.documentElement.dataset.theme; };
  }, [theme]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    document.querySelector(".primary-nav a")?.focus();
    function dismissOnEscape(event) {
      if (event.key === "Escape") closeMobile(true);
    }
    document.addEventListener("keydown", dismissOnEscape);
    return () => document.removeEventListener("keydown", dismissOnEscape);
  }, [mobileOpen]);

  const currentPage = Object.entries(pageInfo).find(([key]) => location.pathname === (key === "dashboard" ? "/" : `/${key}`));

  return (
    <div className={`portal-app${collapsed ? " sidebar-collapsed" : ""}${preferences.compactTables ? " compact-tables" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header
        onMenu={() => setMobileOpen((open) => !open)}
        onCollapse={() => setCollapsed((value) => !value)}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        menuButtonRef={menuButtonRef}
        onNotifications={() => setShowAnnouncements(true)}
        navigate={navigate}
        showNotificationDot={preferences.announcements}
      />
      <div className="app-layout">
        <Sidebar mobileOpen={mobileOpen} collapsed={collapsed} closeMobile={() => closeMobile()} expandSidebar={() => setCollapsed(false)} />
        <main className="main-content" id="main-content" tabIndex="-1" aria-label={currentPage?.[1].title ?? "Student portal"}>
          {children ?? <Outlet context={{ theme, setTheme, preferences, setPreferences }} />}
          <footer className="page-footer"><span>MYAU Student Portal <span className="footer-separator">·</span> Demonstration only</span><span>© {new Date().getFullYear()} Angeles University Foundation</span></footer>
        </main>
      </div>
      {showAnnouncements ? (
        <Modal title="Campus announcements" description="Recent updates for this demo student." onClose={() => setShowAnnouncements(false)}>
          <div className="announcement-list">
            {announcements.filter((announcement) => preferences.announcements && (preferences.reminders || announcement.id !== "midterms")).map((announcement) => (
              <article className="notice-row" key={announcement.id}>
                <span className={`notice-symbol ${announcement.tone}`}><Icon name="bell" /></span>
                <div className="notice-copy"><h3 className="notice-title">{announcement.title}</h3><p className="notice-description">{announcement.description}</p></div>
                <span className="notice-time">{announcement.time}</span>
              </article>
            ))}
            {!preferences.announcements ? <p className="muted-copy">Announcements are hidden in your preferences.</p> : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
