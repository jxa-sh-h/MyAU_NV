import {
  academicSections as sourceAcademicSections,
  checkListTerms,
  gradingRecords,
  nonAcademicSections as sourceNonAcademicSections,
  student,
  subjects,
} from "./mockData.js";

const demoMidtermGrades = ["75.0", "82.0", "86.0", "89.0", "77.0", "83.0", "79.0", "85.0"];
const demoFinalGrades = ["78.0", "84.0", "88.0", "90.0", "75.0", "87.0", "82.0", "80.0"];

const demoCheckListTerms = checkListTerms.map((term, termIndex) => ({
  ...term,
  courses: term.courses.map((course, courseIndex) => {
    if (course.grade === undefined) return course;
    const alternateGrade = 75 + ((courseIndex * 7 + termIndex * 3) % 22);
    return {
      ...course,
      grade: course.grade === alternateGrade ? alternateGrade + 1 : alternateGrade,
    };
  }),
}));

const demoAcademicSections = sourceAcademicSections.map((section) => ({
  ...section,
  rows: section.id === "academic-awards-achievements"
    ? [["Demo Academic Recognition", "Sample record · 2026"]]
    : section.id === "grading-per-exam-period"
      ? [["Preliminary", "81.5"], ["Midterm", "85.0"], ["Final", "78.5"]]
      : section.rows,
}));

const demoNonAcademicSections = sourceNonAcademicSections.map((section) => ({
  ...section,
  rows: section.id === "membership"
    ? [["Demo Student Technology Group", "Sample member · 2026"]]
    : [["Demo Innovation Recognition", "Sample participation · 2026"]],
}));

const demoLedgerEntries = [
  ["07/17/2026", "Computer Engineering tuition", "—", "51,200.00", "—", "51,200.00"],
  ["07/17/2026", "Student services fee", "—", "7,200.00", "—", "58,400.00"],
  ["07/17/2026", "Program materials", "—", "9,500.00", "—", "67,900.00"],
  ["07/17/2026", "Prior demo account balance", "—", "850.00", "—", "68,750.00"],
  ["08/03/2026", "Demo scholarship", "—", "—", "5,000.00", "63,750.00"],
  ["08/03/2026", "Demo enrollment payment", "Cashier", "—", "20,000.00", "43,750.00"],
];

const demoLedgerTerms = [
  {
    schoolYear: "2024–2025",
    semester: "First Semester",
    balance: "1,250.00",
    entries: [
      ["07/22/2024", "Computer Engineering tuition", "—", "58,900.00", "—", "58,900.00"],
      ["07/22/2024", "Demo enrollment payment", "Cashier", "—", "10,500.00", "48,400.00"],
      ["09/05/2024", "Demo scholarship credit", "—", "—", "7,000.00", "41,400.00"],
      ["11/20/2024", "Demo tuition payment", "Cashier", "—", "40,150.00", "1,250.00"],
    ],
  },
  {
    schoolYear: "2024–2025",
    semester: "Second Semester",
    balance: "0.00",
    entries: [
      ["01/20/2025", "Computer Engineering tuition", "—", "56,300.00", "—", "56,300.00"],
      ["01/20/2025", "Demo enrollment payment", "Cashier", "—", "11,500.00", "44,800.00"],
      ["03/18/2025", "Demo grant credit", "—", "—", "6,800.00", "38,000.00"],
      ["05/20/2025", "Demo tuition payment", "Cashier", "—", "38,000.00", "0.00"],
    ],
  },
  {
    schoolYear: "2025–2026",
    semester: "First Semester",
    balance: "2,400.00",
    entries: [
      ["07/24/2025", "Computer Engineering tuition", "—", "62,400.00", "—", "62,400.00"],
      ["07/24/2025", "Demo enrollment payment", "Cashier", "—", "13,200.00", "49,200.00"],
      ["09/22/2025", "Demo grant credit", "—", "—", "8,400.00", "40,800.00"],
      ["11/22/2025", "Demo tuition payment", "Cashier", "—", "38,400.00", "2,400.00"],
    ],
  },
  {
    schoolYear: "2025–2026",
    semester: "Second Semester",
    balance: "0.00",
    entries: [
      ["01/22/2026", "Computer Engineering tuition", "—", "64,200.00", "—", "64,200.00"],
      ["01/22/2026", "Demo enrollment payment", "Cashier", "—", "13,500.00", "50,700.00"],
      ["03/20/2026", "Demo grant credit", "—", "—", "6,500.00", "44,200.00"],
      ["05/22/2026", "Demo tuition payment", "Cashier", "—", "44,200.00", "0.00"],
    ],
  },
  {
    schoolYear: "2026–2027",
    semester: "First Semester",
    balance: "43,750.00",
    entries: demoLedgerEntries,
  },
];

const demoFee = {
  tuition: "51,200.00",
  miscellaneous: "7,200.00",
  otherCharges: "9,500.00",
  assessment: "67,900.00",
  grant: "5,000.00",
  paid: "20,000.00",
  balance: "43,750.00",
  otherChargesDetails: [
    ["Demo Student Services", "1,400.00"],
    ["Digital Learning Access", "1,600.00"],
    ["Engineering Laboratory", "1,800.00"],
    ["Equipment Use", "2,200.00"],
    ["Program Materials", "2,500.00"],
  ],
  studentType: "Demo Participant",
  gender: "Unspecified",
  paymentMode: "Demo installment",
  datePaid: "08/03/2026",
  paymentType: "Demo payment",
  referenceNumber: "DEMO-0001",
  installments: [["Demo Prelim", "14,250.00"], ["Demo Midterm", "14,500.00"], ["Demo Final", "15,000.00"]],
  otherFeeAmount: "2,350.00",
  downpaymentAmount: "6,000.00",
  oldAccount: "850.00",
};

export const demoAccounts = [
  {
    username: "AUFAGUIRRE15",
    password: "08642QWE",
    profileStorageKey: "myau-personal-info-AUFAGUIRRE15-v2",
    profile: {
      name: "AGUIRRE, JOBERT HONRA",
      id: "24-1661-908",
      program: "BSCOE",
      yearLevel: "3RD YEAR",
      academicYear: "FS, 2026-27",
      email: "aguirre.jobert@student.auf.edu.ph",
      contactMobile: "",
      addressLine: "",
      barangay: "",
      city: "",
      province: "",
      alternateContact: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyRelationship: "",
    },
  },
  {
    username: "DEMO",
    password: "MYAUDEMO",
    profileStorageKey: "myau-personal-info-DEMO-v1",
    profile: {
      ...student,
      name: "Demo Account",
      id: "00-0000-00",
      program: "BS Computer Engineering (Demo)",
      email: "demo.account@example.com",
      contactMobile: "Demo phone",
      addressLine: "Demo Residence",
      barangay: "Demo Barangay",
      city: "Demo City",
      province: "Demo Province",
      alternateContact: "Demo alternate contact",
      emergencyContactName: "Demo emergency contact",
      emergencyContactNumber: "Demo emergency number",
      emergencyRelationship: "Demo placeholder",
    },
    data: {
      currentBalance: { amount: "₱43,750.00", status: "Payment pending" },
      notices: [
        { icon: "calendar", tone: "blue", title: "Demo enrollment check", description: "Review your sample enrollment details before the next registration period.", time: "Demo" },
      ],
      circulationDetails: [["Books due now", "0"], ["Overdue books", "0"], ["Unpaid library fine", "₱0.00"]],
      disciplineStatus: { currentStanding: "Demo record clear", activeNotices: [] },
      otherPendingClearances: [["Demo Student Services", "1 item", "Sample document review", "Pending", "Nov 17, 2026", "Nov 24, 2026"]],
      submittedRequirements: [],
      gradingRecords: gradingRecords.map((record, index) => ({
        ...record,
        midtermGrade: demoMidtermGrades[index],
        finalGrade: demoFinalGrades[index],
      })),
      checkListTerms: demoCheckListTerms,
      academicSections: demoAcademicSections,
      nonAcademicSections: demoNonAcademicSections,
      enrolledTerm: {
        label: "First Semester, 2026–2027",
        officialDate: "August 03, 2026",
        maximumUnits: "24.0",
        totalUnits: subjects.reduce((total, [, , , units]) => total + Number(units), 0).toFixed(1),
      },
      ledgerEntries: demoLedgerEntries,
      ledgerTerms: demoLedgerTerms,
      periodicDues: [["Demo Prelim", "14,250.00", "14,250.00"], ["Demo Midterm", "14,500.00", "28,750.00"], ["Demo Final", "15,000.00", "43,750.00"]],
      fee: demoFee,
    },
  },
];

export function findDemoAccount(username) {
  return demoAccounts.find((account) => account.username.toLowerCase() === username.trim().toLowerCase());
}
