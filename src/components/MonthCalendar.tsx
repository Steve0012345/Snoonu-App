import type { Activity } from "../store/useAppStore";
import clsx from "clsx";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function countOnDay(acts: Activity[], d: Date) {
  let c = 0;
  for (const a of acts) {
    if (a.status === "cancelled") continue;
    const ad = new Date(a.startAtISO);
    if (sameDay(ad, d)) c++;
  }
  return c;
}

export function MonthCalendar(props: {
  month: Date;
  activities: Activity[];
  selectedDay: Date;
  onSelectDay: (d: Date) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}) {
  const { month, activities, selectedDay, onSelectDay, onPrevMonth, onNextMonth } =
    props;

  const first = startOfMonth(month);
  const last = endOfMonth(month);
  const startWeekday = (first.getDay() + 6) % 7; // Monday-first (iOS-like)

  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= last.getDate(); day++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="glass rounded-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-[17px]">
          {month.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="w-9 h-9 rounded-full border flex items-center justify-center"
            style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.55)", color: "var(--muted)" }}
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            onClick={onNextMonth}
            className="w-9 h-9 rounded-full border flex items-center justify-center"
            style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.55)", color: "var(--muted)" }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday row */}
      <div className="grid grid-cols-7 gap-2 text-[11px] mb-2" style={{ color: "var(--muted)" }}>
        {weekDays.map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((d, idx) => {
          if (!d) return <div key={idx} className="h-11" />;

          const isSelected = sameDay(d, selectedDay);
          const isToday = sameDay(d, today);

          const eventCount = countOnDay(activities, d);
          const dots = clamp(eventCount, 0, 3);

          return (
            <button
              key={idx}
              onClick={() => onSelectDay(d)}
              className={clsx(
                "h-11 rounded-[14px] flex flex-col items-center justify-center relative transition",
                "border",
                isSelected ? "text-white" : "text-[color:var(--text)]"
              )}
              style={{
                borderColor: isSelected ? "transparent" : "var(--border)",
                background: isSelected
                  ? "var(--accent-gradient)"
                  : "rgba(255,255,255,0.55)",
                boxShadow: isSelected ? "0 10px 24px rgba(227, 6, 19, 0.18)" : "none",
              }}
            >
              <div className={clsx("text-[14px] font-semibold", isSelected ? "text-white" : "")}>
                {d.getDate()}
              </div>

              {/* iOS style: today indicator */}
              {isToday && !isSelected && (
                <div
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: "var(--snoonu-red)" }}
                />
              )}

              {/* Event dots (max 3) */}
              {dots > 0 && (
                <div className="absolute bottom-1.5 flex items-center gap-1">
                  {Array.from({ length: dots }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: isSelected ? "rgba(255,255,255,0.85)" : "rgba(52,199,89,0.9)",
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
