import type { Activity, ServiceVertical } from "../../store/useAppStore";

function colorForVertical(v: ServiceVertical) {
  // iOS-ish tones (kept subtle)
  if (v === "Groceries") return "rgba(52,199,89,0.9)";
  if (v === "Dining") return "rgba(255,149,0,0.9)";
  if (v === "Gym") return "rgba(10,132,255,0.9)";
  if (v === "Cinema") return "rgba(175,82,222,0.9)";
  if (v === "Transport") return "rgba(142,142,147,0.9)";
  return "rgba(255,59,48,0.85)";
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DayAgenda(props: {
  day: Date;
  activities: Activity[];
  onAdd: () => void;
}) {
  const { day, activities, onAdd } = props;

  return (
    <div className="glass rounded-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[17px] font-semibold">
            {day.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-[12px]" style={{ color: "var(--muted)" }}>
            {activities.length === 0
              ? "No activities scheduled"
              : `${activities.length} scheduled`}
          </div>
        </div>

        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-pill text-white text-[13px] font-semibold"
          style={{
            background: "var(--accent-gradient)",
            boxShadow: "0 10px 24px rgba(227, 6, 19, 0.18)",
          }}
        >
          Add
        </button>
      </div>

      {activities.length === 0 ? (
        <div
          className="rounded-card p-4 border"
          style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.55)", color: "var(--muted)" }}
        >
          Tip: add recurring plans like gym or groceries so Snoonu can forecast your month.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => {
            const chip = colorForVertical(a.vertical);
            return (
              <div key={a.id} className="flex gap-3">
                {/* Timeline */}
                <div className="w-14 shrink-0 text-right">
                  <div className="text-[12px] font-semibold">{timeLabel(a.startAtISO)}</div>
                  <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                    {a.vertical}
                  </div>
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-card border p-3 flex items-center justify-between gap-3"
                  style={{
                    borderColor: "var(--border)",
                    background: "rgba(255,255,255,0.62)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-1.5 h-10 rounded-pill"
                      style={{ background: chip }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-[14px] truncate">
                        {a.title}
                      </div>
                      <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                        Tap later for “Pay now”, “Split”, “Invite family”
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-[14px]">QAR {a.amountQAR}</div>
                    <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                      {a.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
