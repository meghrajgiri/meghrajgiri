"use client";

import { ThemeContext } from "@/providers/ThemeProvider";
import { useContext } from "react";

const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return { theme, toggleTheme };
};

export default useTheme;
