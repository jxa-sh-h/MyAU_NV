import { createContext, useContext } from "react";

export const StudentProfileContext = createContext(null);

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);
  if (!context) throw new Error("StudentProfileContext is not available.");
  return context;
}
