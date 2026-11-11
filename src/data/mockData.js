export const student = {
  name: "AGUIRRE, JOBERT...",
  id: "24-1661-908",
  program: "BSCOE",
  yearLevel: "3RD YEAR",
  academicYear: "FS, 2026-27",
};

export const pages = {
  dashboard: { title: "Dashboard", section: "Overview", description: "Your academic snapshot and the latest campus updates." },
  "student-clearance": { title: "Student Clearance", section: "Student Services", description: "Review payment clearance and violation clearance in one place." },
  enrollment: { title: "Enrollment", section: "Enrollment", description: "Review your enrolled subjects, fees, and admission requirements." },
  "subjects-enrolled": { title: "Subjects Enrolled", section: "Enrollment", description: "Your registered subjects for the current academic term." },
  "fees-paid-during-enrollment": { title: "Fees Paid During Enrollment", section: "Enrollment", description: "A record of enrollment fees in this demonstration account." },
  "submit-admission-requirement": { title: "Submit Admission Requirement", section: "Enrollment", description: "Review and simulate an admission document submission." },
  "student-account": { title: "Student Account", section: "Student Account", description: "Review your student ledger and periodic dues." },
  ledger: { title: "Ledger", section: "Student Account", description: "A summary of charges and credits on your student account." },
  "periodic-dues": { title: "Periodic Dues", section: "Student Account", description: "Your installment schedule and upcoming due dates." },
  "academic-performance": { title: "Academic Performance", section: "Academic Records", description: "Review academic records and progress by category." },
  "check-list": { title: "Check List", section: "Academic Performance", description: "Review courses, earned units, and grades across your academic terms." },
  "academic-awards-achievements": { title: "Awards/Achievements", section: "Academic Performance", description: "Academic recognition recorded in the sample profile." },
  "grading-per-exam-period": { title: "Grading Per Exam Period", section: "Academic Performance", description: "Sample grades by examination period." },
  "non-acad-performance": { title: "Non-Acad Performance", section: "Student Development", description: "Review membership and non-academic achievements." },
  membership: { title: "Membership", section: "Non-Acad Performance", description: "Student organizations and co-curricular participation." },
  "non-acad-awards-achievements": { title: "Awards/Achievements", section: "Non-Acad Performance", description: "Non-academic recognition recorded in the sample profile." },
  "discipline-monitoring": { title: "Discipline Monitoring", section: "Student Services", description: "Review demonstration notices and student conduct resources." },
  "personal-information": { title: "Personal Information", section: "Student Profile", description: "Review and manage your demonstration profile information." },
  "view-personal-info": { title: "View Personal Info", section: "Personal Information", description: "Fictional profile information for this frontend demonstration." },
  "edit-personal-info": { title: "Edit Personal Information", section: "Personal Information", description: "Update demo contact information saved only in this browser." },
  "print-personal-info": { title: "Print Personal Info", section: "Personal Information", description: "Print the current personal information view." },
  "change-password": { title: "Change Password", section: "Personal Information", description: "Validate a demonstration password without saving it." },
  library: { title: "Library", section: "Library Services", description: "Explore library services and research resources." },
  "ebsco-database": { title: "EBSCO Database", section: "Library Services", description: "Open the external EBSCO research database." },
  "faculty-evaluation": { title: "Faculty Evaluation", section: "Student Services", description: "Share course feedback in this demonstration evaluation." },
  "online-payment": { title: "Online Payment", section: "Student Account", description: "Review a simulated account balance and payment options." },
};

export const navigationGroups = [
  {
    id: "enrollment",
    title: "Enrollment",
    icon: "graduation",
    children: [
      ["subjects-enrolled", "Subjects Enrolled"],
      ["fees-paid-during-enrollment", "Fees Paid During Enrollment"],
      ["submit-admission-requirement", "Submit Admission Requirement"],
    ],
  },
  {
    id: "student-account",
    title: "Student Account",
    icon: "account",
    children: [["ledger", "Ledger"], ["periodic-dues", "Periodic Dues"]],
  },
  {
    id: "academic-performance",
    title: "Academic Performance",
    icon: "award",
    children: [
      ["check-list", "Check List"],
      ["academic-awards-achievements", "Awards/Achievements"],
      ["grading-per-exam-period", "Grading Per Exam Period"],
    ],
  },
  {
    id: "non-acad-performance",
    title: "Non-Acad Performance",
    icon: "star",
    children: [["membership", "Membership"], ["non-acad-awards-achievements", "Awards/Achievements"]],
  },
  {
    id: "personal-information",
    title: "Personal Information",
    icon: "user",
    children: [
      ["view-personal-info", "View Personal Info"],
      ["print-personal-info", "Print Personal Info"],
      ["change-password", "Change Password"],
    ],
  },
];

export const standalonePages = [
  ["library", "Library", "book", "/pages/library.html"],
  ["ebsco-database", "EBSCO Database", "book", "/pages/ebsco-database.html"],
  ["faculty-evaluation", "Faculty Evaluation", "star", "/pages/faculty-evaluation.html"],
  ["online-payment", "Online Payment", "wallet", "/pages/online-payment.html"],
];

export const notices = [
  { icon: "check", tone: "teal", title: "Clearance is in progress", description: "Most offices have cleared your record. Two requirements still need your attention.", time: "Today" },
  { icon: "calendar", tone: "amber", title: "Midterm assessment period", description: "Check your course pages for assessment schedules and instructor announcements.", time: "Oct 27" },
  { icon: "email", tone: "blue", title: "Keep your AUF email active", description: "Official university updates and account notices are sent to your AUF email.", time: "Reminder" },
];

export const disciplineStatus = {
  currentStanding: "Good",
  activeNotices: [],
};

export const subjects = [
  ["CEDDES", "Computer Engineering Drafting and Design", "0.0 / 1.0", "1.0"],
  ["CISCO2", "CISCO 2", "2.0 / 1.0", "3.0"],
  ["DADICO", "Data and Digital Communications", "3.0 / 0.0", "3.0"],
  ["ELECT1", "Cognate/Elective Course 1", "2.0 / 1.0", "3.0"],
  ["FECOSY", "Feedback and Control System", "3.0 / 1.0", "4.0"],
  ["INTHDL", "Introduction to HDL", "0.0 / 1.0", "1.0"],
  ["LOCIDE", "Logic Circuit and Design", "3.0 / 1.0", "4.0"],
  ["OPESYS", "Operating System", "3.0 / 0.0", "3.0"],
];

export const gradingRecords = [
  { code: "CEDDES", instructor: "JUCO, WESTLY G.", midtermGrade: "100.0" },
  { code: "CISCO2", instructor: "JUCO, WESTLY G.", midtermGrade: "98.0" },
  { code: "DADICO", instructor: "LLANOS, WILBERT M.", midtermGrade: "94.0" },
  { code: "ELECT1", instructor: "TECSON, JEREMY PIERRE C.", midtermGrade: "97.0" },
  { code: "FECOSY", instructor: "TULAN, HERBERT O.", midtermGrade: "88.0" },
  { code: "INTHDL", instructor: "LUNA, MARIO LORD S.", midtermGrade: "92.0" },
  { code: "LOCIDE", instructor: "LUNA, MARIO LORD S.", midtermGrade: "96.0" },
  { code: "OPESYS", instructor: "JUCO, WESTLY G.", midtermGrade: "99.0" },
];

export const enrolledTerm = {
  label: "First Semester, 2026–2027",
  officialDate: "July 16, 2026",
  maximumUnits: "22.0",
  totalUnits: "22.0",
};

export const ledgerEntries = [
  ["—", "Old accounts", "—", "0.00", "0.00", "0.00"],
  ["07/16/2026", "Tuition Fee", "—", "48,056.00", "—", "48,056.00"],
  ["07/16/2026", "Miscellaneous Fee", "—", "6,848.00", "—", "54,904.00"],
  ["07/16/2026", "Other Charges", "—", "17,810.00", "—", "72,714.00"],
  ["07/16/2026", "Enrollment/downpayment - Cash", "Demo", "—", "5,000.00", "67,714.00"],
  ["08/28/2026", "ACAD 25 (Grant)", "—", "—", "12,014.00", "55,700.00"],
  ["11/03/2026", "Tuition - Cash", "Demo", "—", "10,000.00", "45,700.00"],
  ["11/09/2026", "Tuition - Cash", "Demo", "—", "10,000.00", "35,700.00"],
];

export const periodicDues = [
  ["Prelim", "0.00", "0.00"],
  ["Midterm", "17,133.34", "17,133.34"],
  ["Final", "18,566.67", "35,700.00"],
];

export const checkListTerms = [
  {
    year: "1st Year",
    semester: "1st Semester",
    requiredUnits: 27,
    creditedUnits: 27,
    courses: [
      { code: "CALCU1", title: "Calculus 1", units: 5, earnedUnits: 5, grade: 75, status: "passed" },
      { code: "CHEM01", title: "Chemistry for Engineers", units: 4, earnedUnits: 4, grade: 87, status: "passed" },
      { code: "COMDIS", title: "Computer Engineering as a Discipline", units: 2, earnedUnits: 2, grade: 95, status: "passed" },
      { code: "MMW", title: "Mathematics in the Modern World", units: 3, earnedUnits: 3, grade: 95, status: "passed" },
      { code: "NSTP1", title: "National Service Training Program I", units: 3, earnedUnits: 3, grade: 99, status: "passed" },
      { code: "PEF1", title: "Physical Activity Towards Health and Fitness 1 (PATH-Fit 1)", units: 2, earnedUnits: 2, grade: 99, status: "passed" },
      { code: "PROLOD", title: "Programming Logic and Design", units: 2, earnedUnits: 2, grade: 90, status: "passed" },
      { code: "RPH", title: "Readings in Philippine History", units: 3, earnedUnits: 3, grade: 93, status: "passed" },
      { code: "SSELEC", title: "Social Sciences Elective", units: 3, earnedUnits: 3, grade: 97, status: "passed" },
    ],
  },
  {
    year: "1st Year",
    semester: "2nd Semester",
    requiredUnits: 31,
    creditedUnits: 31,
    courses: [
      { code: "AHELECT", title: "Arts & Humanities Elective", units: 3, earnedUnits: 3, grade: 92, status: "passed" },
      { code: "CALCU2", title: "Calculus 2", units: 5, earnedUnits: 5, grade: 85, status: "passed" },
      { code: "DISMAT", title: "Discrete Mathematics", units: 3, earnedUnits: 3, grade: 93, status: "passed" },
      { code: "ENGDAT", title: "Engineering Data Analysis", units: 3, earnedUnits: 3, grade: 89, status: "passed" },
      { code: "NSTP2", title: "National Service Training Program II", units: 3, earnedUnits: 3, grade: 97, status: "passed" },
      { code: "OOPROG", title: "Object Oriented Programming", units: 2, earnedUnits: 2, grade: 96, status: "passed" },
      { code: "PEF2", title: "Physical Activity Towards Health and Fitness 2 (PATH-Fit 2)", units: 2, earnedUnits: 2, grade: 96, status: "passed" },
      { code: "PHYS01", title: "Physics for Engineers", units: 4, earnedUnits: 4, grade: 90, status: "passed" },
      { code: "RLW", title: "Rizal’s Life, Works and Writings", units: 3, earnedUnits: 3, grade: 95, status: "passed" },
      { code: "STS", title: "Science, Technology and Society", units: 3, earnedUnits: 3, grade: 93, status: "passed" },
    ],
  },
  {
    year: "2nd Year",
    semester: "1st Semester",
    requiredUnits: 24,
    creditedUnits: 18,
    courses: [
      { code: "AITAPP", title: "Art Appreciation", units: 3, status: "credit-short" },
      { code: "COMPAD", title: "Computer-Aided Drafting", units: 1, earnedUnits: 1, grade: 98, status: "passed" },
      { code: "DASTAL", title: "Data Structure and Algorithm", units: 2, earnedUnits: 2, grade: 94, status: "passed" },
      { code: "DIFFEQ", title: "Differential Equations", units: 3, earnedUnits: 3, grade: 87, status: "passed" },
      { code: "EECIRC", title: "Fundamentals of Electrical Circuits", units: 4, earnedUnits: 4, grade: 86, status: "passed" },
      { code: "ENECOM", title: "Engineering Economics", units: 3, status: "credit-short" },
      { code: "PCOM", title: "Purposive Communication", units: 3, earnedUnits: 3, grade: 94, status: "passed" },
      { code: "PEF3", title: "Physical Activity Towards Health and Fitness 3 (PATH-Fit 3)", units: 2, earnedUnits: 2, grade: 95, status: "passed" },
      { code: "RRES", title: "Religions, Religious Experiences and Spirituality", units: 3, earnedUnits: 3, grade: 92, status: "passed" },
    ],
  },
  {
    year: "2nd Year",
    semester: "2nd Semester",
    requiredUnits: 25,
    creditedUnits: 21,
    courses: [
      { code: "CISCO1", title: "CISCO 1", units: 3, earnedUnits: 3, grade: 93, status: "passed" },
      { code: "CW", title: "The Contemporary World", units: 3, earnedUnits: 3, grade: 96, status: "passed" },
      { code: "EECIRC", title: "Fundamentals of Electronic Circuits", units: 4, status: "credit-short" },
      { code: "ETHICS", title: "Ethics", units: 3, earnedUnits: 3, grade: 85, status: "passed" },
      { code: "NUMMET", title: "Numerical Methods", units: 3, earnedUnits: 3, grade: 98, status: "passed" },
      { code: "PEF4", title: "Physical Activity Towards Health and Fitness 4 (PATH-Fit 4)", units: 2, earnedUnits: 2, grade: 97, status: "passed" },
      { code: "SOFDES", title: "Software Design", units: 4, earnedUnits: 4, grade: 99, status: "passed" },
      { code: "UTS", title: "Understanding the Self", units: 3, earnedUnits: 3, grade: 95, status: "passed" },
    ],
  },
  {
    year: "3rd Year",
    semester: "1st Semester",
    requiredUnits: 25,
    creditedUnits: 21,
    courses: [
      { code: "CEDDES", title: "Computer Engineering Drafting and Design", units: 1, status: "enrolled" },
      { code: "CISCO2", title: "CISCO 2", units: 3, status: "enrolled" },
      { code: "DADICO", title: "Data and Digital Communications", units: 3, status: "enrolled" },
      { code: "ELECT1", title: "Cognate/Elective Course 1", units: 3, status: "enrolled" },
      { code: "FECOSY", title: "Feedback and Control System", units: 4, status: "enrolled" },
      { code: "INTHDL", title: "Introduction to HDL", units: 1, status: "enrolled" },
      { code: "LOCIDE", title: "Logic Circuit and Design", units: 4, status: "enrolled" },
      { code: "OPESYS", title: "Operating System", units: 3, status: "enrolled" },
    ],
  },
  {
    year: "3rd Year",
    semester: "2nd Semester",
    requiredUnits: 24,
    creditedUnits: 0,
    courses: [
      { code: "BOHASA", title: "Basic Occupational Health and Safety", units: 3, status: "no-credit" },
      { code: "CISCO3", title: "CISCO 3", units: 3, status: "no-credit" },
      { code: "CONESE", title: "Computer Networks and Security", units: 4, status: "no-credit" },
      { code: "CPELAW", title: "CpE Laws and Professional Practice Arch", units: 2, status: "no-credit" },
      { code: "ELECT2", title: "Cognate/Elective Course 2", units: 3, status: "no-credit" },
      { code: "METRES", title: "Methods of Research", units: 2, status: "no-credit" },
      { code: "MICROPI", title: "Microprocessors", units: 4, status: "no-credit" },
      { code: "TECHNO", title: "Technopreneurship 101", units: 3, status: "no-credit" },
    ],
  },
  {
    year: "4th Year",
    semester: "1st Semester",
    requiredUnits: 25,
    creditedUnits: 0,
    courses: [
      { code: "COMARC", title: "Computer Architecture and Organization", units: 4, status: "no-credit" },
      { code: "DISIPR", title: "Digital Signal Processing", units: 4, status: "no-credit" },
      { code: "ELECT3", title: "Cognate/Elective Course 3", units: 3, status: "no-credit" },
      { code: "EMBESY", title: "Embedded Systems", units: 4, status: "no-credit" },
      { code: "EMERTE", title: "Emerging Technologies in CpE", units: 3, status: "no-credit" },
      { code: "FUNMSS", title: "Fundamentals of Mixed Signals and Sensors", units: 3, status: "no-credit" },
      { code: "MOBDEV", title: "Mobile Application and Development", units: 3, status: "no-credit" },
      { code: "PRADE1", title: "CpE Practice and Design 1", units: 1, status: "no-credit" },
    ],
  },
  {
    year: "4th Year",
    semester: "2nd Semester",
    requiredUnits: 6,
    creditedUnits: 0,
    courses: [
      { code: "CPEOJT", title: "On the Job Training", units: 3, status: "no-credit" },
      { code: "PRADE2", title: "CpE Practice and Design 2", units: 2, status: "no-credit" },
      { code: "SEMTRI", title: "Seminars and Field Trips", units: 1, status: "no-credit" },
    ],
  },
];

export const academicSections = [
  { id: "check-list", title: "Check List", description: pages["check-list"].description },
  { id: "academic-awards-achievements", title: "Awards/Achievements", description: pages["academic-awards-achievements"].description, rows: [["Dean’s List", "2nd Semester · AY 2025–2026"], ["Programming Challenge finalist", "College level · 2025"]] },
  { id: "grading-per-exam-period", title: "Grading Per Exam Period", description: pages["grading-per-exam-period"].description, rows: [["Preliminary", "88.4"], ["Midterm", "90.1"], ["Final", "Pending"]] },
];

export const nonAcademicSections = [
  { id: "membership", title: "Membership", description: pages.membership.description, rows: [["AUF Computer Engineering Society", "Active member"], ["Campus Robotics Circle", "Participant"]] },
  { id: "non-acad-awards-achievements", title: "Awards/Achievements", description: pages["non-acad-awards-achievements"].description, rows: [["Inter-college robotics showcase", "Participant · 2026"], ["Student volunteer appreciation", "Recognition · 2025"]] },
];

export const currentBalance = {
  amount: "₱15,750.00",
  status: "Outstanding",
};

export const circulationDetails = [
  ["Books due now", "1"],
  ["Overdue books", "1"],
  ["Unpaid library fine", "₱12.00"],
];

export const otherPendingClearances = [
  ["Student Affairs", "Amount: ₱0 · Qty: N/A", "No-uniform notice", "—", "Nov 3, 2026", "Nov 10, 2026"],
];

export const profileRows = [
  ["Student ID", student.id],
  ["Student name", student.name],
  ["Program", student.program],
  ["Year level", student.yearLevel],
  ["Academic year", student.academicYear],
];
