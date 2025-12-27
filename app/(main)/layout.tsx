"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "./ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [mounted, setMounted] = useState(false);
  const [enableTransitions, setEnableTransitions] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("dashboard-theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }
    } catch {
    }
    setMounted(true);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEnableTransitions(true);
        isInitialMount.current = false;
      });
    });
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("dashboard-theme", newTheme);
  };

  const displayTheme = mounted ? theme : "light";
  
  const displayBackgroundStyle = mounted
    ? displayTheme === "light"
      ? { background: "linear-gradient(135deg, #FAF9F7 0%, #F2EEFF 100%)" }
      : { background: "linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)" }
    : { background: "transparent" };

  const pathname = usePathname();

  return (
    <ThemeProvider theme={displayTheme}>
      <div
        className={`relative h-screen overflow-hidden ${enableTransitions ? 'transition-all duration-300' : ''} ${displayTheme === "dark" ? "dark" : ""}`}
        style={displayBackgroundStyle}
        data-theme={displayTheme}
      >
        <Sidebar
          theme={displayTheme}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="w-full h-full overflow-y-auto relative">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#6366F1] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="sm:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <FaTimes className="text-gray-600 dark:text-gray-300 text-xl" />
            ) : (
              <FaBars className="text-gray-600 dark:text-gray-300 text-xl" />
            )}
          </button>
          <div className="absolute top-4 right-4 z-40">
            <ThemeToggle theme={displayTheme} onToggle={toggleTheme} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  );
}

