export const demoAccounts = [
  {
    username: "AUFAGUIRRE15",
    password: "08642QWE",
    profile: {
      name: "AGUIRRE, JOBERT HONRA",
      id: "24-1661-908",
      program: "BSCOE",
      yearLevel: "3RD YEAR",
      academicYear: "FS, 2026-27",
      email: "aguirre.jobert@student.auf.edu.ph",
      contactMobile: "",
    },
  },
  {
    username: "MYAUDEMO",
    password: "DEMO2026",
    profile: {
      name: "BENITEZ, ASH",
      id: "22-0307-719",
      program: "BSCE",
      yearLevel: "2ND YEAR",
      academicYear: "FS, 2026-27",
      email: "ash.benitez@student.auf.edu.ph",
      contactMobile: "0917 555 0128",
    },
    subjects: [
      ["CE101", "Engineering Surveying", "2.0 / 1.0", "3.0"],
      ["CE102", "Statics of Rigid Bodies", "3.0 / 0.0", "3.0"],
      ["CE103", "Construction Materials and Testing", "2.0 / 1.0", "3.0"],
      ["CE104", "Fluid Mechanics", "3.0 / 0.0", "3.0"],
      ["CE105", "Structural Theory", "3.0 / 0.0", "3.0"],
      ["CE106", "Geotechnical Engineering 1", "2.0 / 1.0", "3.0"],
      ["MATHCE", "Differential Equations", "3.0 / 0.0", "3.0"],
      ["CE107", "Civil Engineering Drafting", "1.0 / 2.0", "3.0"],
    ],
    data: {
      enrolledTerm: { label: "First Semester, 2026–2027", officialDate: "July 18, 2026", maximumUnits: "24.0", totalUnits: "24.0" },
      currentBalance: { amount: "₱18,250.00", status: "Outstanding" },
      notices: [
        { icon: "calendar", tone: "amber", title: "Structural analysis quiz", description: "Review the posted coverage and bring your calculator.", time: "Nov 18" },
        { icon: "file", tone: "blue", title: "Surveying fieldwork schedule", description: "Meet your group at the engineering laboratory before 8:00 AM.", time: "Nov 20" },
        { icon: "check", tone: "teal", title: "Library account is clear", description: "You have no overdue items or library fines.", time: "Today" },
      ],
      circulationDetails: [["Overdue library items", "0"], ["Library fine balance", "₱0.00"]],
      disciplineStatus: { currentStanding: "Good", activeNotices: [] },
      otherPendingClearances: [["Engineering Laboratory", "₱350.00", "Materials testing kit fee", "Pending", "Nov 12, 2026", "Nov 30, 2026"]],
      gradingRecords: [
        { code: "CE101", instructor: "Faculty member", midtermGrade: "91.0" }, { code: "CE102", instructor: "Faculty member", midtermGrade: "88.0" },
        { code: "CE103", instructor: "Faculty member", midtermGrade: "94.0" }, { code: "CE104", instructor: "Faculty member", midtermGrade: "89.0" },
        { code: "CE105", instructor: "Faculty member", midtermGrade: "92.0" }, { code: "CE106", instructor: "Faculty member", midtermGrade: "90.0" },
        { code: "MATHCE", instructor: "Faculty member", midtermGrade: "93.0" }, { code: "CE107", instructor: "Faculty member", midtermGrade: "95.0" },
      ],
      periodicDues: [["Prelim", "0.00", "0.00"], ["Midterm", "9,125.00", "9,125.00"], ["Final", "9,125.00", "18,250.00"]],
      ledgerEntries: [
        ["—", "Old accounts", "—", "0.00", "0.00", "0.00"], ["07/18/2026", "Tuition and school fees", "—", "54,750.00", "—", "54,750.00"],
        ["07/18/2026", "Enrollment/downpayment - Cash", "Business Office", "—", "8,000.00", "46,750.00"], ["08/15/2026", "Academic scholarship grant", "—", "—", "10,000.00", "36,750.00"],
        ["10/17/2026", "Tuition - Cash", "Business Office", "—", "9,250.00", "27,500.00"], ["11/06/2026", "Tuition - Cash", "Business Office", "—", "9,250.00", "18,250.00"],
      ],
      fee: { tuition: "36,750.00", miscellaneous: "5,250.00", otherCharges: "12,750.00", assessment: "54,750.00", grant: "10,000.00", paid: "26,500.00", balance: "18,250.00" },
    },
  },
];

export function findDemoAccount(username) {
  return demoAccounts.find((account) => account.username.toLowerCase() === username.trim().toLowerCase());
}
