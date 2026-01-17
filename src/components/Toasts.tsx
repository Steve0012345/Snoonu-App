import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";

export function Toasts() {
  const toasts = useAppStore((s) => s.ui.toasts);

  return (
    <div className="fixed top-24 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-[820px] space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="glass rounded-card px-4 py-3 pointer-events-none"
            >
              <div className="text-[14px] font-semibold">{t.title}</div>
              {t.subtitle && (
                <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                  {t.subtitle}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
