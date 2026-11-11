import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navigationGroups, notices, pages, standalonePages, student } from "../data/mockData.js";
import Icon from "./Icon.jsx";

function routeFor(id) {
  const standalone = standalonePages.find(([pageId]) => pageId === id);
  return standalone ? standalone[3] : `/index.html#${id}`;
}

function NavLink({ id, label, icon, activePage, onNavigate, className = "" }) {
  const isActive = activePage === id;
  return (
    <Link
      className={`${className || "nav-link"}${isActive ? " active" : ""}`}
      to={routeFor(id)}
      aria-current={isActive ? (standalonePages.some(([pageId]) => pageId === id) ? "page" : "location") : undefined}
      onClick={onNavigate}
    >
      {icon && <Icon name={icon} />}
      <span>{label}</span>
    </Link>
  );
}

function NavigationGroup({ group, activePage, onNavigate }) {
  const isCurrent = activePage === group.id || group.children.some(([id]) => id === activePage);
  const [expanded, setExpanded] = useState(isCurrent);

  useEffect(() => {
    if (isCurrent) setExpanded(true);
  }, [isCurrent]);

  return (
    <div className="nav-group">
      <div className={`nav-group-heading${activePage === group.id ? " active" : ""}`}>
        <NavLink id={group.id} label={group.title} icon={group.icon} activePage={activePage} onNavigate={onNavigate} className="nav-group-page" />
        <button className="nav-group-toggle" type="button" aria-label={`${expanded ? "Collapse" : "Expand"} ${group.title}`} aria-expanded={expanded} aria-controls={`${group.id}-links`} onClick={() => setExpanded((value) => !value)}>
          <Icon name="chevron" className="group-chevron" />
        </button>
      </div>
      <div className="nav-submenu" id={`${group.id}-links`} hidden={!expanded}>
        {group.children.map(([id, label]) => (
          <NavLink key={id} id={id} label={label} activePage={activePage} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function StudentPanel() {
  const navigate = useNavigate();
  return (
    <section className="student-panel" aria-label="Student information">
      <div className="student-panel-header">
        <div className="avatar avatar-large">AJ</div>
        <div className="student-info"><span className="student-id">{student.id}</span><strong title={student.name}>{student.name}</strong></div>
        <button className="logout-button" type="button" onClick={() => navigate("/")}>Logout</button>
      </div>
      <div className="student-meta">
        <span><small>Academic year</small><strong>{student.academicYear}</strong></span>
        <span><small>Year level</small><strong>{student.yearLevel}</strong></span>
        <span><small>Program</small><strong>{student.program}</strong></span>
      </div>
    </section>
  );
}

function Header({ menuOpen, onMenuToggle, menuButtonRef }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function dismiss(event) {
      if (!notificationRef.current?.contains(event.target)) setNotificationsOpen(false);
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return (
    <header className="topbar">
      <button id="menu-toggle" ref={menuButtonRef} className="icon-button menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="sidebar" onClick={onMenuToggle}>
        <Icon name={menuOpen ? "close" : "menu"} />
      </button>
      <Link className="brand" to="/index.html#dashboard" aria-label="MYAU dashboard">
        <span className="brand-mark" aria-hidden="true">AUF</span>
        <span className="brand-copy"><strong>MYAU</strong><span>ANGELES UNIVERSITY FOUNDATION</span></span>
      </Link>
      <div className="topbar-tools">
        <span className="portal-label">STUDENT PORTAL</span>
        <div className="topbar-popover-wrap" ref={notificationRef}>
          <button className="icon-button notification-button" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setProfileOpen(false); }}>
            <Icon name="bell" /><span className="notification-dot" aria-hidden="true" />
          </button>
          {notificationsOpen && <div className="header-popover notification-popover"><strong>Recent updates</strong>{notices.slice(0, 2).map((notice) => <p key={notice.title}>{notice.title}<small>{notice.time}</small></p>)}</div>}
        </div>
        <span className="topbar-divider" aria-hidden="true" />
        <div className="topbar-popover-wrap" ref={profileRef}>
          <button className="profile-button" type="button" aria-label={`Student profile: ${student.name}`} aria-expanded={profileOpen} onClick={() => { setProfileOpen((value) => !value); setNotificationsOpen(false); }}>
            <span className="avatar avatar-small">AJ</span><span className="profile-name">{student.name}</span><Icon name="chevron" className="chevron" />
          </button>
          {profileOpen && <div className="header-popover profile-popover"><strong>{student.id}</strong><Link to="/index.html#view-personal-info" onClick={() => setProfileOpen(false)}>View personal information</Link><span>Demo account</span></div>}
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ activePage, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const active = pages[activePage] ?? pages.dashboard;

  useEffect(() => {
    document.title = `${active.title} | MYAU`;
  }, [active.title]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((value) => !value)} menuButtonRef={menuButtonRef} />
      <div className="app-layout">
        {menuOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
        <aside className={`sidebar${menuOpen ? " is-open" : ""}`} id="sidebar" aria-label="Main navigation">
          <StudentPanel />
          <nav className="primary-nav" aria-label="Student portal">
            <NavLink id="dashboard" label="Dashboard" icon="dashboard" activePage={activePage} onNavigate={closeMenu} />
            <NavLink id="student-clearance" label="Student Clearance" icon="clearance" activePage={activePage} onNavigate={closeMenu} />
            {navigationGroups.slice(0, 4).map((group) => <NavigationGroup key={group.id} group={group} activePage={activePage} onNavigate={closeMenu} />)}
            <NavLink id="discipline-monitoring" label="Discipline Monitoring" icon="shield" activePage={activePage} onNavigate={closeMenu} />
            <NavigationGroup group={navigationGroups[4]} activePage={activePage} onNavigate={closeMenu} />
            {standalonePages.map(([id, label, icon]) => <NavLink key={id} id={id} label={label} icon={icon} activePage={activePage} onNavigate={closeMenu} />)}
          </nav>
          <div className="sidebar-footer">
            <span className="help-icon" aria-hidden="true">?</span>
            <span><strong>Need help?</strong><Link to="/index.html#student-clearance" onClick={closeMenu}>Student Services</Link></span>
          </div>
        </aside>
        <main className="main-content" id="main-content" tabIndex="-1">
          <div id="page-content" aria-live="polite">{children}</div>
          <footer className="page-footer"><span>MYAU Student Portal <span className="footer-separator">·</span> Demonstration only</span><span>© 2026 Angeles University Foundation</span></footer>
        </main>
      </div>
    </>
  );
}
