import { useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { DayAgenda } from "./DayAgenda";
import { CalendarSheet } from "./CalendarSheet";
import { AddActivityModal } from "./AddActivityModal";

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "S";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function PlanScreen() {
  const userName = "Rina";
  const tier = "BRONZE";

  const demo = useAppStore((s) => s.demo);
  const activities = useAppStore((s) => s.activities);

  const isActive = useAppStore((s) => s.plan.isActive);
  const activate = useAppStore((s) => s.activatePlan);
  const deactivate = useAppStore((s) => s.deactivatePlan);

  const virtualNowISO = useAppStore((s) => s.plan.virtualNowISO);
  const speed = useAppStore((s) => s.plan.speed);
  const setSpeed = useAppStore((s) => s.setSpeed);

  const openAdd = useAppStore((s) => s.openAddActivity);
  const openCalendar = useAppStore((s) => s.openCalendar);

  const totalAllocated = useAppStore((s) => s.totalAllocated)();
  const remaining = Math.max(0, demo.monthlyBudget - totalAllocated);

  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [month, setMonth] = useState(() => new Date());

  const todaysActivities = useMemo(() => {
    const d = selectedDay;
    return activities
      .filter((a) => {
        const ad = new Date(a.startAtISO);
        return (
          ad.getFullYear() === d.getFullYear() &&
          ad.getMonth() === d.getMonth() &&
          ad.getDate() === d.getDate() &&
          a.status !== "cancelled"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startAtISO).getTime() - new Date(b.startAtISO).getTime()
      );
  }, [activities, selectedDay]);

  return (
    <div className="pb-24 relative">
      {/* Background wash for iOS feel (MATCH Profile exactly) */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 0%, rgba(227,6,19,0.22) 0%, rgba(255,255,255,0.94) 55%, rgba(255,255,255,1) 100%)",
        }}
      />

      <div className="px-4 pt-4 space-y-4">
        {/* Top greeting row like your Snoonu screenshot */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
              style={{ background: "rgba(0,0,0,0.06)", color: "var(--text)" }}
            >
              {initials(userName)}
            </div>

            <div>
              <div className="text-[22px] font-semibold tracking-tight">
                Hi, {userName}
              </div>
              <div
                className="mt-1 inline-flex items-center px-2.5 py-1 rounded-pill text-[12px] font-semibold"
                style={{
                  background: "rgba(227,6,19,0.10)",
                  color: "var(--snoonu-red)",
                }}
              >
                {tier}
              </div>
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-pill border text-[13px] font-semibold"
            style={{
              borderColor: "var(--border)",
              background: "rgba(255,255,255,0.65)",
              color: "var(--text)",
            }}
          >
            Edit
          </button>
        </div>

        {/* 4 shortcut icons row (Favorites/Vouchers/Royal/Get Help vibe) */}
        <div className="grid grid-cols-4 gap-3">
          <Shortcut icon="❤️" label="Favorites" />
          <Shortcut icon="🏷️" label="Vouchers" />
          <Shortcut icon="📅" label="Calendar" onClick={openCalendar} />
          <Shortcut icon="💬" label="Help" />
        </div>

        {/* Promo card (super-app vibe) */}
        <div
          className="rounded-[22px] border overflow-hidden"
          style={{
            borderColor: "var(--border)",
            background:
              "linear-gradient(90deg, rgba(227,6,19,0.18) 0%, rgba(255,255,255,0.62) 45%, rgba(255,255,255,0.82) 100%)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                Snoonu+
              </div>
              <div className="text-[15px] font-semibold truncate">
                Activate your Life Plan for auto-pay + insights
              </div>
            </div>
            <button
              className="px-4 py-2 rounded-pill text-white font-semibold"
              style={{ background: "var(--accent-gradient)" }}
              onClick={() => openCalendar()}
            >
              Open Plan
            </button>
          </div>
        </div>

        {/* PLAN MODULE — but presented like “Finances” section in the wireframe */}
        <div className="text-[22px] font-semibold tracking-tight mt-2">Plan</div>

        {/* Budget card with actions (this sits above everything like in your schematic) */}
        <div
          className="rounded-[22px] border p-4"
          style={{
            borderColor: "var(--border)",
            background: "rgba(255,255,255,0.70)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                Monthly Budget
              </div>
              <div className="text-[30px] font-semibold tracking-tight mt-1">
                QAR {demo.monthlyBudget}
              </div>
              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                Allocated: QAR {totalAllocated}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                Remaining
              </div>
              <div
                className="text-[22px] font-semibold tracking-tight"
                style={{ color: "var(--snoonu-red)" }}
              >
                QAR {remaining}
              </div>
            </div>
          </div>

          {/* Primary action row like “Top-up / Transfer” bar */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="h-12 rounded-[18px] border font-semibold"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.75)",
                color: "var(--text)",
              }}
              onClick={openAdd}
            >
              + Add activity
            </button>

            <button
              className="h-12 rounded-[18px] font-semibold text-white"
              style={{
                background: "var(--accent-gradient)",
                opacity: isActive ? 0.65 : 1,
              }}
              onClick={() => (isActive ? deactivate() : activate())}
            >
              {isActive ? "Pause Plan" : "Activate Plan"}
            </button>
          </div>

          {/* Speed pills (iOS feel) */}
          <div className="mt-3 flex gap-2">
            {[1, 5, 20].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s as 1 | 5 | 20)}
                className="flex-1 h-10 rounded-pill border text-[13px] font-semibold transition"
                style={{
                  borderColor: "var(--border)",
                  background:
                    speed === s
                      ? "rgba(255,255,255,0.90)"
                      : "rgba(255,255,255,0.55)",
                  color: speed === s ? "var(--text)" : "var(--muted)",
                }}
              >
                {s}×
              </button>
            ))}
          </div>

          <div className="mt-2 text-[12px]" style={{ color: "var(--muted)" }}>
            Virtual time: {new Date(virtualNowISO).toLocaleTimeString()} • Tap the{" "}
            <b>Plan</b> tab to open calendar
          </div>
        </div>

        {/* Agenda (the “content surface”, calendar hidden until toggled) */}
        <DayAgenda
          day={selectedDay}
          activities={todaysActivities}
          onAdd={openAdd}
        />

        {/* Calendar sheet (opened by bottom tab toggle) */}
        <CalendarSheet
          month={month}
          setMonth={setMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        <AddActivityModal selectedDay={selectedDay} />
      </div>
    </div>
  );
}

function Shortcut(props: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button className="flex flex-col items-center gap-2" onClick={props.onClick}>
      <div
        className="w-14 h-14 rounded-[18px] border flex items-center justify-center text-[22px]"
        style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.65)" }}
      >
        {props.icon}
      </div>
      <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
        {props.label}
      </div>
    </button>
  );
}
