"use client";

import { createContext, useContext, ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light" });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({
  theme,
  children,
}: {
  theme: "light" | "dark";
  children: ReactNode;
}) => {
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

