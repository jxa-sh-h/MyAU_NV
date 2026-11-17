import { useCallback, useEffect, useState } from "react";

function readStoredValue(key, initialValue, storageName, storageLabel) {
  try {
    const stored = window[storageName].getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  } catch (error) {
    console.error(`Unable to read ${storageLabel} data for "${key}".`, error);
    return initialValue;
  }
}

export function useStorageState(key, initialValue, storageName) {
  const storageLabel = storageName === "localStorage" ? "local" : "session";
  const [storedState, setStoredState] = useState(() => ({
    key,
    value: readStoredValue(key, initialValue, storageName, storageLabel),
  }));
  const value = storedState.key === key
    ? storedState.value
    : readStoredValue(key, initialValue, storageName, storageLabel);

  useEffect(() => {
    if (storedState.key !== key) {
      setStoredState({ key, value });
      return;
    }

    try {
      window[storageName].setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save ${storageLabel} data for "${key}".`, error);
    }
  }, [key, storageName, storageLabel, storedState, value]);

  const setValue = useCallback((nextValue) => {
    setStoredState((current) => {
      const currentValue = current.key === key
        ? current.value
        : readStoredValue(key, initialValue, storageName, storageLabel);
      return {
        key,
        value: typeof nextValue === "function" ? nextValue(currentValue) : nextValue,
      };
    });
  }, [initialValue, key, storageName, storageLabel]);

  return [value, setValue];
}
