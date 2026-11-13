import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PortalPage from "./pages/PortalPages.jsx";
import { pages, standalonePages } from "./data/mockData.js";

const standaloneIds = new Set(standalonePages.map(([id]) => id));

function PortalRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedPage = location.hash.slice(1) || "dashboard";
  const isLegacyDisciplineRoute = requestedPage === "discipline-monitoring";
  const validPortalPage = pages[requestedPage] && !standaloneIds.has(requestedPage);

  useEffect(() => {
    if (isLegacyDisciplineRoute) {
      navigate("/index.html#student-clearance", { replace: true });
    } else if (standaloneIds.has(requestedPage)) {
      const standalone = standalonePages.find(([id]) => id === requestedPage);
      navigate(standalone[3], { replace: true });
    } else if (!validPortalPage) {
      navigate("/index.html#dashboard", { replace: true });
    }
  }, [isLegacyDisciplineRoute, navigate, requestedPage, validPortalPage]);

  if (!validPortalPage || isLegacyDisciplineRoute) return null;

  return (
    <AppLayout activePage={requestedPage}>
      <PortalPage pageId={requestedPage} />
    </AppLayout>
  );
}

function StandaloneRoute({ pageId }) {
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
      {standalonePages.map(([pageId, , , path]) => (
        <Route key={pageId} path={path} element={<StandaloneRoute pageId={pageId} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
