import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type Props = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className, ...props }: Props) {
  const primaryStyle =
    variant === "primary"
      ? {
          background: "var(--accent-gradient)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.18)",
        }
      : undefined;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "px-4 py-2 rounded-pill font-medium shadow-sm transition",
        variant === "secondary" && "bg-white/50 border border-border hover:bg-white/70",
        variant === "ghost" && "bg-transparent hover:bg-white/30",
        className
      )}
      style={primaryStyle}
      {...props}
    />
  );
}
