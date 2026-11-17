import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navigationGroups, pages, standalonePages, subjects } from "../data/mockData.js";
import { isStandalonePage, routeForPage } from "../data/routes.js";
import { StudentProfileContext } from "../contexts/StudentProfileContext.jsx";
import HelpSupport from "./HelpSupport.jsx";
import Icon from "./Icon.jsx";
import { useActiveStudentAccount } from "../hooks/useActiveStudentAccount.js";

function NavLink({ id, label, icon, activePage, onNavigate, className = "" }) {
  const isActive = activePage === id;
  return (
    <Link
      className={`${className || "nav-link"}${isActive ? " active" : ""}`}
      to={routeForPage(id)}
      aria-current={isActive ? (isStandalonePage(id) ? "page" : "location") : undefined}
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
  const address = [profile.addressLine, profile.barangay, profile.city, profile.province].filter(Boolean).join(", ");
  return (
    <section className="student-panel" aria-label="Student information">
      <div className="student-panel-header">
        {profile.id === "00-0000-00"
          ? <span className="avatar avatar-large demo-avatar" aria-hidden="true">DA</span>
          : <img className="avatar avatar-large avatar-photo" src="/submitted-requirements/2x2.png" alt="" />}
        <div className="student-info"><span className="student-id">{profile.id}</span><strong title={profile.name}>{profile.name}</strong></div>
        <button className="logout-button" type="button" onClick={onLogout}>Logout</button>
      </div>
      <div className="student-meta">
        <span><small>Academic year</small><strong>{profile.academicYear}</strong></span>
        <span><small>Year level</small><strong>{profile.yearLevel}</strong></span>
        <span><small>Program</small><strong>{profile.program}</strong></span>
        <span><small>Email address</small><strong title={profile.email}>{profile.email || "Not provided"}</strong></span>
        <span><small>Contact mobile</small><strong>{profile.contactMobile || "Not provided"}</strong></span>
        <span><small>Address</small><strong title={address}>{address || "Not provided"}</strong></span>
      </div>
      <Link className="student-edit-link" to="/index.html#edit-personal-info">Edit personal information</Link>
    </section>
  );
}

export default function AppLayout({ activePage, children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setSession, account, profile, setProfile } = useActiveStudentAccount();
  const activeSubjects = account.subjects ?? subjects;
  const menuButtonRef = useRef(null);
  const sidebarRef = useRef(null);
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

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const updateScrollLock = () => {
      document.body.style.overflow = window.matchMedia("(max-width: 760px)").matches ? "hidden" : previousOverflow;
    };
    updateScrollLock();
    sidebarRef.current?.querySelector(".sidebar-brand")?.focus();
    window.addEventListener("resize", updateScrollLock);
    return () => {
      window.removeEventListener("resize", updateScrollLock);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  function trapSidebarFocus(event) {
    if (event.key !== "Tab" || !menuOpen || !window.matchMedia("(max-width: 760px)").matches) return;
    const focusable = [...(sidebarRef.current?.querySelectorAll('a[href], button:not([disabled]), summary') ?? [])]
      .filter((element) => (
        element.getClientRects().length > 0
        && getComputedStyle(element).visibility !== "hidden"
        && (element.matches("summary") || !element.closest("details:not([open])"))
      ));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function logout() {
    setSession(null);
    navigate("/");
  }

  return (
    <StudentProfileContext.Provider value={{ profile, setProfile, subjects: activeSubjects, data: account.data ?? {} }}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="app-layout">
        <button id="menu-toggle" ref={menuButtonRef} className="icon-button menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => setMenuOpen((value) => !value)}>
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        {menuOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" tabIndex="-1" onClick={closeMenu} />}
        <aside ref={sidebarRef} className={`sidebar${menuOpen ? " is-open" : ""}`} id="sidebar" aria-label="Main navigation" onKeyDown={trapSidebarFocus}>
          <Link className="sidebar-brand" to="/index.html#dashboard" onClick={closeMenu} aria-label="MyAU Student Portal home">
            <img className="sidebar-brand-logo" src="/img/MYAU_logo.png" alt="" aria-hidden="true" />
            <span><strong>MyAU</strong><small>STUDENT PORTAL</small></span>
          </Link>
          <StudentPanel profile={profile} onLogout={logout} />
          <nav className="primary-nav" aria-label="Student portal">
            <NavLink id="dashboard" label="Dashboard" icon="dashboard" activePage={activePage} onNavigate={closeMenu} />
            <NavLink id="student-clearance" label="Student Clearance" icon="clearance" activePage={activePage} onNavigate={closeMenu} />
            {navigationGroups.slice(0, 4).map((group) => <NavigationGroup key={group.id} group={group} activePage={activePage} onNavigate={closeMenu} />)}
            {standalonePages.map(([id, label, icon]) => <NavLink key={id} id={id} label={label} icon={icon} activePage={activePage} onNavigate={closeMenu} />)}
          </nav>
          <div className="sidebar-footer sidebar-help">
            <HelpSupport variant="sidebar" />
          </div>
        </aside>
        <main className="main-content" id="main-content" tabIndex="-1">
          <div id="page-content" aria-live="polite">{children}</div>
          <footer className="page-footer"><span>MyAU Student Portal</span><span>© 2026 Angeles University Foundation</span></footer>
        </main>
      </div>
    </StudentProfileContext.Provider>
  );
}
