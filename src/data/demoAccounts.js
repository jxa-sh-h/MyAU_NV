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
  },
];

export function findDemoAccount(username) {
  return demoAccounts.find((account) => account.username.toLowerCase() === username.trim().toLowerCase());
}
