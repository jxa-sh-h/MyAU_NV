import { useStorageState } from "./useStorageState.js";

export function useLocalStorage(key, initialValue) {
  return useStorageState(key, initialValue, "localStorage");
}
