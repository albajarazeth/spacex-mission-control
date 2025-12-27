"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaBars, FaTimes, FaFileAlt } from "react-icons/fa";
import { SiSimpleanalytics } from "react-icons/si";

interface SidebarProps {
  theme: "light" | "dark";
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ theme, isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: SiSimpleanalytics },
    { href: "/launches", label: "Launches", icon: FaRocket },
    { href: "/reports", label: "Reports", icon: FaFileAlt },
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onToggle]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm sm:hidden"
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        className="sm:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-50 shadow-2xl flex flex-col"
      >
        <div className="p-4 relative flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration: 0.2 }}
            className="flex justify-center w-full"
          >
            <Image
              src="/white-logo.png"
              alt="SpaceX Logo"
              width={100}
              height={50}
              className="object-contain mx-auto"
              priority
            />
          </motion.div>

          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 cursor-pointer absolute top-4 right-4"
            aria-label="Close sidebar"
            aria-expanded={isOpen}
          >
            <FaTimes className="text-gray-600 dark:text-gray-300 text-xl" />
          </button>
        </div>

        <ul className="space-y-2 flex-1 px-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={item.href}
                    onClick={() => onToggle()}
                    className="flex items-center gap-3 rounded-lg hover:bg-[#A78BFA]/25 dark:hover:bg-[#8B5CF6]/35 transition-colors cursor-pointer p-3"
                  >
                    <Icon className="text-gray-600 dark:text-gray-300 flex-shrink-0 text-xl" />
                    <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          width: isOpen ? 256 : 48, 
          x: isOpen ? 0 : -8, 
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        className="bg-white dark:bg-gray-800 rounded-3xl ml-8 mt-3 mb-4 flex flex-col absolute left-0 top-0 bottom-0 z-50 shadow-2xl hidden sm:flex"
      >
        <div className={`p-4 relative flex items-center ${isOpen ? "justify-center" : "justify-center"} mb-6`}>
          <motion.div
            animate={{
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className={isOpen ? "flex justify-center w-full" : "hidden"}
          >
            <Image
              src="/white-logo.png"
              alt="SpaceX Logo"
              width={100}
              height={50}
              className="object-contain mx-auto"
              priority
            />
          </motion.div>

          <button
            onClick={onToggle}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 cursor-pointer ${
              isOpen ? "absolute top-4 right-4" : "w-full flex justify-center"
            }`}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isOpen}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <FaTimes className="text-gray-600 dark:text-gray-300 text-xl" />
              ) : (
                <FaBars className="text-gray-600 dark:text-gray-300 text-xl" />
              )}
            </motion.div>
          </button>
      </div>

        <ul className={`space-y-2 flex-1 ${isOpen ? "px-2" : "px-0"}`}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isOpen ? 1 : 0.8,
                  x: isOpen ? 0 : 0,
                }}
                transition={{
                  delay: isOpen ? index * 0.05 : 0,
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={item.href}
                    onClick={() => isOpen && onToggle()}
                    className={`flex items-center gap-3 rounded-lg hover:bg-[#A78BFA]/25 dark:hover:bg-[#8B5CF6]/35 transition-colors cursor-pointer ${
                      !isOpen
                        ? "justify-center p-2 w-full"
                        : "p-3"
                    }`}
                    title={!isOpen ? item.label : undefined}
                  >
                  <Icon className={`text-gray-600 dark:text-gray-300 flex-shrink-0 text-xl ${
                    !isOpen ? "mx-auto" : ""
                  }`} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                </motion.div>
              </motion.li>
            );
          })}
      </ul>
      </motion.div>
    </>
  );
};

export default Sidebar;