"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}) => {
  const [active, setActive] = useState(propTabs[0]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* ── Botones ── */}
      <div
        className={cn(
          "relative z-10 flex shrink-0 flex-row items-center justify-start overflow-auto no-visible-scrollbar max-w-full w-full gap-1",
          containerClassName
        )}
      >
        {propTabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => setActive(tab)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className={cn(
                  "absolute inset-0 rounded-full bg-zinc-800",
                  activeTabClassName
                )}
              />
            )}
            <span className="relative block">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* ── Contenido ── */}
      <div className={cn("mt-3 w-full", contentClassName)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.value}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full"
          >
            {active.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
