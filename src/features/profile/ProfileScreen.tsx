import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "R";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "R";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function fmtQAR(n: number) {
  return `${Math.round(n).toLocaleString()} QAR`;
}

export function ProfileScreen() {
  const nav = useNavigate();

  const walletBalance = useAppStore((s) => s.demo.walletBalance);
  const monthlyBudget = useAppStore((s) => s.demo.monthlyBudget);
  const totalAllocated = useAppStore((s) => s.totalAllocated)();
  const remaining = Math.max(0, monthlyBudget - totalAllocated);

  const family = useAppStore((s) => s.family);
  const planActive = useAppStore((s) => s.plan.isActive);
  const speed = useAppStore((s) => s.plan.speed);
  const openCalendar = useAppStore((s) => s.openCalendar);

  const userName = "Rina";
  const tier = "BRONZE";

  const heroSub = useMemo(() => {
    const members = family.members.length;
    return `${tier} • ${members} member${members === 1 ? "" : "s"}`;
  }, [family.members.length]);

  return (
    <div className="pb-24">
      {/* Background wash for iOS feel */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 0%, rgba(227,6,19,0.22) 0%, rgba(255,255,255,0.94) 55%, rgba(255,255,255,1) 100%)",
        }}
      />

      <div className="px-4 pt-4 space-y-4">
        {/* Top header like Snoonu screenshot */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-semibold text-[18px]"
              style={{
                background: "rgba(0,0,0,0.10)",
                color: "rgba(255,255,255,0.92)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              }}
            >
              {initials(userName)}
            </div>

            <div>
              <div className="text-[28px] font-semibold tracking-tight">Hi, {userName}</div>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-pill text-[12px] font-semibold"
                  style={{
                    background: "rgba(227,6,19,0.14)",
                    color: "rgba(227,6,19,0.95)",
                    border: "1px solid rgba(227,6,19,0.15)",
                  }}
                >
                  {tier}
                </span>

                <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.55)" }}>
                  {heroSub}
                </span>
              </div>
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-pill border text-[13px] font-semibold"
            style={{
              borderColor: "rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.65)",
              color: "rgba(0,0,0,0.80)",
              backdropFilter: "blur(10px)",
            }}
          >
            Edit
          </button>
        </div>

        {/* Shortcut row */}
        <div className="grid grid-cols-4 gap-3">
          <Shortcut icon="❤️" label="Favorites" onClick={() => {}} />
          <Shortcut icon="🏷️" label="Vouchers" onClick={() => {}} />
          {/* As requested earlier: calendar toggle lives here */}
          <Shortcut
            icon="📅"
            label="Calendar"
            onClick={() => {
              openCalendar();
              nav("/plan");
            }}
          />
          <Shortcut icon="💬" label="Help" onClick={() => {}} />
        </div>

        {/* Snoonu+ promo card */}
        <div
          className="rounded-[22px] border overflow-hidden"
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            background:
              "linear-gradient(90deg, rgba(227,6,19,0.20) 0%, rgba(0,0,0,0.04) 45%, rgba(255,255,255,0.70) 100%)",
            boxShadow: "0 14px 34px rgba(0,0,0,0.10)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[12px]" style={{ color: "rgba(0,0,0,0.55)" }}>
                Snoonu+
              </div>
              <div className="text-[15px] font-semibold truncate">
                Get plan insights + auto-pay simulation
              </div>
            </div>

            <button
              className="px-4 py-2 rounded-pill text-white font-semibold"
              style={{ background: "var(--accent-gradient)" }}
              onClick={() => nav("/plan")}
            >
              Open
            </button>
          </div>
        </div>

        {/* Order-ish rows (matches Snoonu list vibe) */}
        <GlassRow
          icon="🧾"
          title="Order History"
          subtitle="20+ Orders"
          onClick={() => {}}
        />
        <GlassRow
          icon="🎟️"
          title="S City Tickets"
          subtitle="Your saved tickets"
          onClick={() => {}}
        />
        <GlassRow
          icon="🛍️"
          title="Tamwin Qatar"
          subtitle="Get your items delivered"
          dot
          onClick={() => {}}
        />

        {/* Finances section (matches wireframe header + big wallet card) */}
        <div className="pt-1">
          <div className="text-[26px] font-semibold tracking-tight">Finances</div>
        </div>

        <div
          className="rounded-[26px] border p-4"
          style={{
            borderColor: "rgba(0,0,0,0.10)",
            background: "rgba(0,0,0,0.70)",
            color: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                Wallet balance
              </div>
              <div className="text-[40px] leading-tight font-semibold tracking-tight">
                {Math.round(walletBalance).toLocaleString()}
                <span className="text-[16px] ml-1" style={{ color: "rgba(255,255,255,0.75)" }}>
                  QAR
                </span>
              </div>
            </div>

            <button
              className="px-3 py-2 rounded-pill text-[12px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.82)",
              }}
              onClick={() => nav("/wallet")}
            >
              Wallet &gt;
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="h-12 rounded-[18px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.90)",
              }}
              onClick={() => nav("/wallet")}
            >
              + Top-up
            </button>
            <button
              className="h-12 rounded-[18px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.45)",
              }}
              onClick={() => {}}
              disabled
            >
              ⇄ Transfer
            </button>
          </div>
        </div>

        {/* Plan summary card */}
        <div
          className="rounded-[22px] border p-4"
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.65)",
            boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px]" style={{ color: "rgba(0,0,0,0.55)" }}>
                Life Plan
              </div>
              <div className="text-[16px] font-semibold">
                {planActive ? "Active" : "Paused"} • {speed}× speed
              </div>
              <div className="text-[12px]" style={{ color: "rgba(0,0,0,0.55)" }}>
                Remaining budget: <span className="font-semibold" style={{ color: "var(--snoonu-red)" }}>{fmtQAR(remaining)}</span>
              </div>
            </div>

            <button
              className="px-4 py-2 rounded-pill text-white font-semibold"
              style={{ background: "var(--accent-gradient)" }}
              onClick={() => nav("/plan")}
            >
              Open Plan
            </button>
          </div>
        </div>

        {/* Family card */}
        <div
          className="rounded-[22px] border p-4"
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.65)",
            boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px]" style={{ color: "rgba(0,0,0,0.55)" }}>
                Family
              </div>
              <div className="text-[16px] font-semibold">
                {family.householdName} • {family.members.length} member{family.members.length === 1 ? "" : "s"}
              </div>
              <div className="text-[12px]" style={{ color: "rgba(0,0,0,0.55)" }}>
                Split activities + approvals
              </div>
            </div>

            <button
              className="px-4 py-2 rounded-pill border text-[13px] font-semibold"
              style={{
                borderColor: "rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.75)",
                color: "rgba(0,0,0,0.85)",
              }}
              onClick={() => nav("/family")}
            >
              Manage
            </button>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-2" />
      </div>
    </div>
  );
}

function Shortcut(props: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button onClick={props.onClick} className="flex flex-col items-center gap-2">
      <div
        className="w-14 h-14 rounded-[18px] border flex items-center justify-center text-[22px]"
        style={{
          borderColor: "rgba(0,0,0,0.08)",
          background: "rgba(0,0,0,0.75)",
          color: "rgba(255,255,255,0.92)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
        }}
      >
        {props.icon}
      </div>
      <div className="text-[12px] font-semibold" style={{ color: "rgba(0,0,0,0.55)" }}>
        {props.label}
      </div>
    </button>
  );
}

function GlassRow(props: {
  icon: string;
  title: string;
  subtitle: string;
  dot?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={props.onClick}
      className="w-full rounded-[22px] border px-4 py-4 flex items-center justify-between"
      style={{
        borderColor: "rgba(0,0,0,0.08)",
        background: "rgba(0,0,0,0.78)",
        color: "rgba(255,255,255,0.92)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.10)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[18px]"
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {props.icon}
        </div>

        <div className="min-w-0 text-left">
          <div className="font-semibold text-[16px] truncate">{props.title}</div>
          <div className="text-[12px] truncate" style={{ color: "rgba(255,255,255,0.60)" }}>
            {props.subtitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {props.dot && (
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--snoonu-red)" }}
          />
        )}
        <span style={{ color: "rgba(255,255,255,0.50)" }}>›</span>
      </div>
    </button>
  );
}
