import { motion, AnimatePresence } from "framer-motion";

export function Modal(props: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { open, title, onClose, children } = props;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* iOS dim */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed left-0 right-0 bottom-0 z-50 mx-auto w-full max-w-[820px] rounded-t-[28px] p-4"
            style={{ background: "var(--surface-strong)" }}
            initial={{ y: 520 }}
            animate={{ y: 0 }}
            exit={{ y: 520 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            {/* drag handle */}
            <div className="flex justify-center pb-2">
              <div className="w-12 h-1.5 rounded-pill bg-black/15" />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-[17px] font-semibold">{title}</div>
              <button
                className="w-9 h-9 rounded-full border flex items-center justify-center"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
