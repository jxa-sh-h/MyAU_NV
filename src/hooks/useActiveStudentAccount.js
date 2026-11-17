import { useCallback, useEffect } from "react";
import { demoAccounts } from "../data/demoAccounts.js";
import { student } from "../data/mockData.js";
import { useLocalStorage } from "./useLocalStorage.js";
import { useSessionStorage } from "./useSessionStorage.js";

function normalizeProfile(accountProfile, storedProfile) {
  if (storedProfile?.id !== accountProfile.id) return accountProfile;
  return {
    ...accountProfile,
    ...storedProfile,
    name: accountProfile.name,
    id: accountProfile.id,
    program: accountProfile.program,
    yearLevel: accountProfile.yearLevel,
    academicYear: accountProfile.academicYear,
    email: accountProfile.email,
  };
}

export function useActiveStudentAccount() {
  const [session, setSession] = useSessionStorage("myau-demo-session", null);
  const account = demoAccounts.find((item) => item.username === session?.username) ?? demoAccounts[0];
  const accountProfile = account.profile ?? { ...student, email: "", contactMobile: "" };
  const [storedProfile, setStoredProfile] = useLocalStorage(account.profileStorageKey, accountProfile);
  const profile = normalizeProfile(accountProfile, storedProfile);

  useEffect(() => {
    if (storedProfile?.id !== accountProfile.id) setStoredProfile(accountProfile);
  }, [accountProfile, setStoredProfile, storedProfile?.id]);

  const setProfile = useCallback((update) => {
    setStoredProfile((currentProfile) => {
      const current = normalizeProfile(accountProfile, currentProfile);
      const next = typeof update === "function" ? update(current) : update;
      return normalizeProfile(accountProfile, next);
    });
  }, [accountProfile, setStoredProfile]);

  return { session, setSession, account, profile, setProfile };
}
