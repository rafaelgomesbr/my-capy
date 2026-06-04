"use client";

import { useEffect } from "react";

interface KeyboardShortcutProps {
  onTrigger: () => void;
}

export function KeyboardShortcut({ onTrigger }: KeyboardShortcutProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onTrigger();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onTrigger]);

  return null;
}
