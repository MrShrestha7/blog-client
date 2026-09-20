"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";

/**
 * ThemeSwitcher component allows users to toggle between dark and light themes
 * The theme preference is stored in the 'data-theme' attribute on the HTML element
 * This component:
 * 1. Reads the current theme from the HTML element on mount
 * 2. Toggles between 'dark' and 'light' themes when clicked
 * 3. Updates the HTML element's data-theme attribute
 * 4. Persists the preference in localStorage for future visits
 */
const ThemeSwitch = () => {
  // Track the current theme - default to 'light' initially
  const [theme, setTheme] = useState<"light" | "dark">("light");
  // Track if component is mounted to avoid hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from HTML element on component mount
  useEffect(() => {
    // Get the current theme from the HTML element's data-theme attribute
    const htmlElement = document.documentElement;
    const currentTheme =
      (htmlElement.getAttribute("data-theme") as "light" | "dark") || "light";

    setTheme(currentTheme);
    setIsMounted(true);
  }, []);

  /**
   * Handle theme toggle button click
   * Switches between light and dark themes
   * Updates the HTML element's data-theme attribute
   * Saves preference to localStorage
   */
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Update the HTML element's data-theme attribute
    document.documentElement.setAttribute("data-theme", newTheme);

    // Save preference to localStorage for persistence across visits
    localStorage.setItem("theme", newTheme);
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; samesite=lax`;

    // Update component state
    setTheme(newTheme);
  };

  // Don't render until component is mounted (avoid hydration mismatch)
  if (!isMounted) {
    return null;
  }

  return (
    <Button onClick={handleThemeToggle}>
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
