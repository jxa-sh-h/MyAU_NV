import { useStorageState } from "./useStorageState.js";

export function useSessionStorage(key, initialValue) {
  return useStorageState(key, initialValue, "sessionStorage");
}
