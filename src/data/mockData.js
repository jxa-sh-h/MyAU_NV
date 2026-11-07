export const student = {
  id: "24-1661-908",
  name: "AGUIRRE, JOBERT...",
  fullName: "Jobert Aguirre",
  program: "BSCOE",
  yearLevel: "3RD YEAR",
  academicYear: "FS, 2026-27",
  email: "jobert.aguirre@student.auf.edu.ph",
  phone: "+63 917 555 0142",
  address: "Angeles City, Pampanga",
};

export const announcements = [
  {
    id: "clearance",
    title: "Clearance is in progress",
    description: "Most offices have cleared your record. Review the remaining requirements.",
    time: "Today",
    tone: "teal",
  },
  {
    id: "midterms",
    title: "Midterm assessment period",
    description: "Check your course pages for assessment schedules and instructor updates.",
    time: "Nov 5",
    tone: "amber",
  },
  {
    id: "email",
    title: "Keep your AUF email active",
    description: "Official university updates are sent to your student email address.",
    time: "Nov 2",
    tone: "blue",
  },
];

export const subjects = [
  { id: "cpe-311", code: "CPE 311", name: "Data Structures and Algorithms", units: 3, days: "Monday, Wednesday", time: "8:00–9:30 AM", room: "Engineering 204", instructor: "Engr. Maria Santos", grade: 91, period: "Midterm" },
  { id: "cpe-312", code: "CPE 312", name: "Computer Organization", units: 3, days: "Tuesday, Thursday", time: "10:00–11:30 AM", room: "Engineering 301", instructor: "Engr. Paolo Reyes", grade: 89, period: "Midterm" },
  { id: "cpe-313", code: "CPE 313", name: "Digital Systems Design", units: 3, days: "Monday, Wednesday", time: "1:00–2:30 PM", room: "Engineering Lab 2", instructor: "Engr. Camille Cruz", grade: 93, period: "Midterm" },
  { id: "cpe-314", code: "CPE 314", name: "Engineering Design", units: 3, days: "Tuesday, Thursday", time: "1:00–2:30 PM", room: "Innovation Hub", instructor: "Engr. Daniel Lim", grade: 88, period: "Midterm" },
  { id: "gec-108", code: "GEC 108", name: "Ethics", units: 3, days: "Friday", time: "9:00 AM–12:00 PM", room: "Humanities 105", instructor: "Dr. Andrea Dizon", grade: 90, period: "Midterm" },
  { id: "cpe-315l", code: "CPE 315L", name: "Computer Engineering Laboratory", units: 3, days: "Friday", time: "1:00–4:00 PM", room: "Engineering Lab 1", instructor: "Engr. Maria Santos", grade: 92, period: "Midterm" },
  { id: "pe-4", code: "PE 4", name: "Sports and Recreation", units: 3, days: "Wednesday", time: "4:00–5:30 PM", room: "AUF Gymnasium", instructor: "Coach Miguel Flores", grade: 95, period: "Midterm" },
];

export const availableSubjects = [
  { id: "cpe-401", code: "CPE 401", name: "Embedded Systems", units: 3, days: "Monday, Wednesday", time: "10:00–11:30 AM", room: "Engineering 302", instructor: "Engr. Lara Mendoza", grade: null, period: "Not enrolled" },
  { id: "cpe-402", code: "CPE 402", name: "Computer Networks", units: 3, days: "Tuesday, Thursday", time: "8:00–9:30 AM", room: "Engineering 205", instructor: "Engr. Paolo Reyes", grade: null, period: "Not enrolled" },
  { id: "gec-112", code: "GEC 112", name: "The Contemporary World", units: 3, days: "Friday", time: "8:00–11:00 AM", room: "Humanities 202", instructor: "Dr. Andrea Dizon", grade: null, period: "Not enrolled" },
  { id: "cpe-403l", code: "CPE 403L", name: "Microprocessor Laboratory", units: 1, days: "Thursday", time: "2:30–5:30 PM", room: "Engineering Lab 3", instructor: "Engr. Camille Cruz", grade: null, period: "Not enrolled" },
];

export const initialClearance = [
  { id: "library", office: "Library", requirement: "Return one borrowed book", status: "Action needed" },
  { id: "accounts", office: "Student Accounts", requirement: "No outstanding balance", status: "Cleared" },
  { id: "laboratory", office: "Laboratory", requirement: "Equipment accountability", status: "Cleared" },
  { id: "department", office: "Department", requirement: "Adviser consultation", status: "Cleared" },
  { id: "registrar", office: "Registrar", requirement: "Enrollment documents", status: "Action needed" },
];

export const assessmentItems = [
  { label: "Tuition fees", amount: 36500 },
  { label: "Miscellaneous fees", amount: 6750 },
  { label: "Laboratory fees", amount: 3250 },
];

export const initialPayments = [
  { id: "payment-1", date: "Oct 16, 2026", description: "Installment payment · simulated", amount: 10000, status: "Demo record" },
  { id: "payment-2", date: "Oct 02, 2026", description: "Initial installment · simulated", amount: 20000, status: "Demo record" },
];

export const initialBooks = [
  { id: "book-1", title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest & Stein", due: "Nov 18, 2026", status: "Borrowed" },
  { id: "book-2", title: "Digital Design", author: "M. Morris Mano", due: "Nov 24, 2026", status: "Borrowed" },
];

export const pageInfo = {
  dashboard: { title: "Welcome back", section: "Student Portal", description: "Your academic snapshot and the latest campus updates." },
  "academic-records": { title: "Academic Records", section: "Academics", description: "Review your grades, academic standing, and semester information." },
  "class-schedule": { title: "Class Schedule", section: "Academics", description: "Your weekly class schedule and assigned learning spaces." },
  enrollment: { title: "Enrollment", section: "Student Services", description: "Review your registered load or explore simulated course offerings." },
  clearance: { title: "Clearance", section: "Student Services", description: "Track demonstration clearance requirements by university office." },
  profile: { title: "Student Profile", section: "My Account", description: "Manage your fictional student contact information." },
  payments: { title: "Payments", section: "Student Account", description: "Review your mock assessment, balance, and payment history." },
  library: { title: "Library", section: "University Services", description: "Review borrowed materials and library information." },
  "faculty-evaluation": { title: "Faculty Evaluation", section: "University Services", description: "Share course feedback in this demonstration evaluation." },
  settings: { title: "Settings", section: "Preferences", description: "Personalize your portal appearance and demo preferences." },
};

export const demoNote = "Fictional demonstration data. This portal is not connected to official AUF systems.";

export const formatPeso = (amount) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
