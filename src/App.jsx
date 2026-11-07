import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AcademicRecords from "./pages/AcademicRecords.jsx";
import ClassSchedule from "./pages/ClassSchedule.jsx";
import Enrollment from "./pages/Enrollment.jsx";
import Clearance from "./pages/Clearance.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import Payments from "./pages/Payments.jsx";
import Library from "./pages/Library.jsx";
import FacultyEvaluation from "./pages/FacultyEvaluation.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="academic-records" element={<AcademicRecords />} />
        <Route path="class-schedule" element={<ClassSchedule />} />
        <Route path="enrollment" element={<Enrollment />} />
        <Route path="clearance" element={<Clearance />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="payments" element={<Payments />} />
        <Route path="library" element={<Library />} />
        <Route path="faculty-evaluation" element={<FacultyEvaluation />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
