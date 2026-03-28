"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

function ThemeReadySignal() {
  useEffect(() => {
    document.body.classList.add("theme-ready");
  }, []);
  return null;
}

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeReadySignal />
      {children}
    </NextThemesProvider>
  );
}
