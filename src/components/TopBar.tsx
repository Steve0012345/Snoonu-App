import { SnoonuLogo } from "./SnoonuLogo";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="glass mx-4 mt-4 rounded-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{ background: "var(--accent-gradient)" }}>
              <SnoonuLogo size={20} />
            </div>

            <div className="leading-tight">
              <div className="text-[17px] font-semibold">Snoonu</div>
              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                Life Planner
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center px-3 py-2 rounded-pill border"
                 style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.55)" }}>
              <span className="text-[13px]" style={{ color: "var(--muted)" }}>Search…</span>
            </div>

            <button
              className="w-10 h-10 rounded-full border flex items-center justify-center"
              style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.55)", color: "var(--muted)" }}
              aria-label="Profile"
            >
              👤
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
