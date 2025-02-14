"use client";

import { useEffect } from "react";

export default function ClearLocalStorage() {
  const handleClearLocalStorage = () => {
    localStorage.removeItem("players");
  };

  useEffect(() => {
    handleClearLocalStorage();
  }, []);

  return <></>;
}
