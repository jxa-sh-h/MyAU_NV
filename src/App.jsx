import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
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
  return (
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
  );
}

export default App;
