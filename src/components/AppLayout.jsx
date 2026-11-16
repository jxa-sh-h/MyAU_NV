import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navigationGroups, pages, standalonePages, student } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { StudentProfileContext } from "../contexts/StudentProfileContext.jsx";
import { demoAccounts } from "../data/demoAccounts.js";
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
      <div className={`nav-group-heading${isCurrent ? " active" : ""}`}>
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

function StudentPanel({ profile, onLogout }) {
  return (
    <section className="student-panel" aria-label="Student information">
      <div className="student-panel-header">
        <div className="avatar avatar-large">AJ</div>
        <div className="student-info"><span className="student-id">{profile.id}</span><strong title={profile.name}>{profile.name}</strong></div>
        <button className="logout-button" type="button" onClick={onLogout}>Logout</button>
      </div>
      <div className="student-meta">
        <span><small>Academic year</small><strong>{profile.academicYear}</strong></span>
        <span><small>Year level</small><strong>{profile.yearLevel}</strong></span>
        <span><small>Program</small><strong>{profile.program}</strong></span>
      </div>
      <Link className="student-edit-link" to="/index.html#edit-personal-info">Edit personal information</Link>
    </section>
  );
}

export default function AppLayout({ activePage, children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useLocalStorage("myau-demo-session", null);
  const account = demoAccounts.find((item) => item.username === session?.username) ?? demoAccounts[0];
  const [profile, setProfile] = useLocalStorage(`myau-personal-info-${account.username}`, account.profile ?? { ...student, email: "", contactMobile: "" });
  const menuButtonRef = useRef(null);
  const active = pages[activePage] ?? pages.dashboard;

  useEffect(() => {
    document.title = `${active.title} | MyAU`;
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

  function logout() {
    setSession(null);
    navigate("/");
  }

  return (
    <StudentProfileContext.Provider value={{ profile, setProfile }}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="app-layout">
        <button id="menu-toggle" ref={menuButtonRef} className="icon-button menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => setMenuOpen((value) => !value)}>
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        {menuOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
        <aside className={`sidebar${menuOpen ? " is-open" : ""}`} id="sidebar" aria-label="Main navigation">
          <Link className="sidebar-brand" to="/index.html#dashboard" onClick={closeMenu} aria-label="MyAU Student Portal home">
            <span className="sidebar-brand-mark" aria-hidden="true">AUF</span>
            <span><strong>MyAU</strong><small>STUDENT PORTAL</small></span>
          </Link>
          <StudentPanel profile={profile} onLogout={logout} />
          <nav className="primary-nav" aria-label="Student portal">
            <NavLink id="dashboard" label="Dashboard" icon="dashboard" activePage={activePage} onNavigate={closeMenu} />
            <NavLink id="student-clearance" label="Student Clearance" icon="clearance" activePage={activePage} onNavigate={closeMenu} />
            {navigationGroups.slice(0, 4).map((group) => <NavigationGroup key={group.id} group={group} activePage={activePage} onNavigate={closeMenu} />)}
            {standalonePages.map(([id, label, icon]) => <NavLink key={id} id={id} label={label} icon={icon} activePage={activePage} onNavigate={closeMenu} />)}
          </nav>
          <div className="sidebar-footer">
            <span className="help-icon" aria-hidden="true">?</span>
            <span><strong>Need help?</strong><Link to="/index.html#student-clearance" onClick={closeMenu}>Student Services</Link></span>
          </div>
        </aside>
        <main className="main-content" id="main-content" tabIndex="-1">
          <div id="page-content" aria-live="polite">{children}</div>
          <footer className="page-footer"><span>MyAU Student Portal <span className="footer-separator">·</span> Demonstration only</span><span>© 2026 Angeles University Foundation</span></footer>
        </main>
      </div>
    </StudentProfileContext.Provider>
  );
}
