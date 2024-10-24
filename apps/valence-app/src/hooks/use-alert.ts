"use client";
import { useEffect, useState } from "react";

/***
 * show an alert only once when a condition is met
 */
export const useAlert = (condition: boolean, onAlert: () => void) => {
  const [isSeen, setIsSeen] = useState(false);

  useEffect(() => {
    if (isSeen) return;
    if (condition) {
      onAlert();
      setIsSeen(true);
    }
  }, [condition, onAlert, setIsSeen, isSeen]);
};
