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
];

export function findDemoAccount(username) {
  return demoAccounts.find((account) => account.username.toLowerCase() === username.trim().toLowerCase());
}
