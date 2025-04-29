// utils/indexedDB.ts
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ReminderDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("reminders")) {
        db.createObjectStore("reminders", { keyPath: "userId" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const getLastReminderDate = async (
  userId: string
): Promise<Date | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("reminders", "readonly");
    const store = transaction.objectStore("reminders");
    const request = store.get(userId);

    request.onsuccess = () => {
      resolve(request.result?.lastReminderDate || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const setLastReminderDate = async (
  userId: string,
  date: Date
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("reminders", "readwrite");
    const store = transaction.objectStore("reminders");
    const request = store.put({ userId, lastReminderDate: date });

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
