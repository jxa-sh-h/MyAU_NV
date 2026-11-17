import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import Icon from "./components/Icon.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PortalPage from "./pages/PortalPages.jsx";
import { pages, standalonePages } from "./data/mockData.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

const standaloneIds = new Set(standalonePages.map(([id]) => id));

function PortalRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session] = useLocalStorage("myau-demo-session", null);
  const requestedPage = location.hash.slice(1) || "dashboard";
  const isLegacyDisciplineRoute = requestedPage === "discipline-monitoring";
  const isLegacyEbscoRoute = requestedPage === "ebsco-database";
  const validPortalPage = pages[requestedPage] && !standaloneIds.has(requestedPage);

  useEffect(() => {
    if (isLegacyDisciplineRoute) {
      navigate("/index.html#student-clearance", { replace: true });
    } else if (isLegacyEbscoRoute) {
      navigate("/pages/library.html", { replace: true });
    } else if (standaloneIds.has(requestedPage)) {
      const standalone = standalonePages.find(([id]) => id === requestedPage);
      navigate(standalone[3], { replace: true });
    } else if (!validPortalPage) {
      navigate("/index.html#dashboard", { replace: true });
    }
  }, [isLegacyDisciplineRoute, isLegacyEbscoRoute, navigate, requestedPage, validPortalPage]);

  if (!session) return <Navigate to="/login" replace />;
  if (!validPortalPage || isLegacyDisciplineRoute || isLegacyEbscoRoute) return null;

  return (
    <AppLayout activePage={requestedPage}>
      <PortalPage pageId={requestedPage} />
    </AppLayout>
  );
}

function StandaloneRoute({ pageId }) {
  const [session] = useLocalStorage("myau-demo-session", null);
  if (!session) return <Navigate to="/login" replace />;
  if (pageId === "online-payment") return <PortalPage pageId={pageId} />;
  return (
    <AppLayout activePage={pageId}>
      <PortalPage pageId={pageId} />
    </AppLayout>
  );
}

function App() {
  const [acknowledged, setAcknowledged] = useLocalStorage("myau-prototype-acknowledged", false);

  useEffect(() => {
    if (acknowledged) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [acknowledged]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/index.html" element={<PortalRoute />} />
        <Route path="/pages/ebsco-database.html" element={<Navigate to="/pages/library.html" replace />} />
        {standalonePages.map(([pageId, , , path]) => (
          <Route key={pageId} path={path} element={<StandaloneRoute pageId={pageId} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!acknowledged && (
        <div className="acknowledgment-backdrop">
          <section
            className="acknowledgment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="acknowledgment-title"
            aria-describedby="acknowledgment-description"
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                event.preventDefault();
                event.currentTarget.querySelector("button").focus();
              }
            }}
          >
            <header className="acknowledgment-header">
              <span className="acknowledgment-brand-mark">AUF</span>
              <span>
                <strong>AUF MyAU</strong>
                <small>Angeles University Foundation</small>
              </span>
            </header>
            <div className="acknowledgment-content">
              <span className="acknowledgment-shield"><Icon name="shield" /></span>
              <h1 id="acknowledgment-title">Welcome to AUF MyAU</h1>
              <p className="acknowledgment-subtitle">Prototype Access &amp; User Acknowledgment</p>
              <section className="acknowledgment-notice" id="acknowledgment-description">
                <h2>Important Notice</h2>
                <p>This website is an academic capstone project developed as a prototype redesign of the AUF MyAU Student Portal. It is intended for demonstration and educational purposes only.</p>
              </section>
              <h2 className="acknowledgment-list-title">Please be aware that:</h2>
              <ul className="acknowledgment-list">
                <li><Icon name="account" /><span>All student information and records displayed are fictional or sample data.</span></li>
                <li><Icon name="wallet" /><span>No actual payments, enrollment, or official transactions are processed.</span></li>
                <li><Icon name="shield" /><span>This prototype is not connected to the official AUF database or university systems.</span></li>
              </ul>
              <p className="acknowledgment-footer-copy">By proceeding, you acknowledge that you understand the prototype&apos;s purpose and limitations.</p>
              <button className="acknowledgment-accept" type="button" autoFocus onClick={() => setAcknowledged(true)}>I Understand and Agree</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default App;
