"use client";

import { FaSun, FaMoon } from "react-icons/fa";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-300"
      }`}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <FaMoon className="text-gray-800 text-xs" />
        ) : (
          <FaSun className="text-yellow-500 text-xs" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;

