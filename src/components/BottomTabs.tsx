import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

const tabs = [
  { to: "/plan", label: "Plan", icon: "📅" },
  { to: "/wallet", label: "Wallet", icon: "💳" },
  { to: "/family", label: "Family", icon: "👨‍👩‍👧" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export function BottomTabs() {
  const loc = useLocation();
  const nav = useNavigate();
  const toggleCalendar = useAppStore((s) => s.toggleCalendar);

  return (
    <div className="fixed left-0 right-0 bottom-5 z-30 flex justify-center px-4">
      <nav className="glass rounded-pill px-3 py-2 w-full max-w-[860px]">
        <div className="flex items-center justify-between">
          {tabs.map((t) => {
            const isActive = loc.pathname === t.to;

            // special behavior: tapping Plan while already on /plan toggles calendar sheet
            const onClick = (e: React.MouseEvent) => {
              if (t.to === "/plan" && isActive) {
                e.preventDefault();
                toggleCalendar();
                return;
              }
              if (!isActive) nav(t.to);
            };

            return (
              <NavLink
                key={t.to}
                to={t.to}
                onClick={onClick}
                className={[
                  "flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-pill transition",
                  isActive ? "text-white" : "text-[color:var(--muted)]",
                ].join(" ")}
                style={isActive ? { background: "var(--accent-gradient)" } : undefined}
              >
                <div className="text-base leading-none">{t.icon}</div>
                <div className="text-[11px] font-medium">{t.label}</div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
