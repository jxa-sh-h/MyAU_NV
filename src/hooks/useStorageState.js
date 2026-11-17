import { useEffect, useState } from "react";

export function useStorageState(key, initialValue, storageName) {
  const storageLabel = storageName === "localStorage" ? "local" : "session";
  const [value, setValue] = useState(() => {
    try {
      const stored = window[storageName].getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch (error) {
      console.error(`Unable to read ${storageLabel} data for "${key}".`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window[storageName].setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save ${storageLabel} data for "${key}".`, error);
    }
  }, [key, storageName, storageLabel, value]);

  return [value, setValue];
}
