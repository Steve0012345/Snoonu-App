import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export function SchedulerRunner() {
  const isActive = useAppStore((s) => s.plan.isActive);
  const tick = useAppStore((s) => s.tickScheduler);

  useEffect(() => {
    if (!isActive) return;

    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isActive, tick]);

  return null;
}
