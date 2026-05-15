"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-8 h-8 rounded-full flex items-center justify-center border border-border bg-background hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark"
        ? <Sun size={14} className="text-yellow-400" />
        : <Moon size={14} className="text-slate-600" />}
    </button>
  );
}
