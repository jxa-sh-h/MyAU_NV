import { useEffect, useState } from "react";

function readValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    console.error(`Unable to read MYAU demo data for "${key}".`, error);
    return fallback;
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save MYAU demo data for "${key}".`, error);
    }
  }, [key, value]);

  useEffect(() => {
    function syncStorage(event) {
      if (event.key === key) {
        setValue(event.newValue === null ? initialValue : readValue(key, initialValue));
      }
    }

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, [initialValue, key]);

  return [value, setValue];
}
