import { demoAccounts } from "../data/demoAccounts.js";
import { student } from "../data/mockData.js";
import { useLocalStorage } from "./useLocalStorage.js";
import { useSessionStorage } from "./useSessionStorage.js";

export function useActiveStudentAccount() {
  const [session, setSession] = useSessionStorage("myau-demo-session", null);
  const account = demoAccounts.find((item) => item.username === session?.username) ?? demoAccounts[0];
  const initialProfile = account.profile ?? { ...student, email: "", contactMobile: "" };
  const [profile, setProfile] = useLocalStorage(account.profileStorageKey, initialProfile);

  return { session, setSession, account, profile, setProfile };
}
