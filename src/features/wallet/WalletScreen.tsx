import { useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

function fmtQAR(n: number) {
  return `QAR ${Math.round(n).toLocaleString()}`;
}

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "S";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function WalletScreen() {
  const balance = useAppStore((s) => s.demo.walletBalance);
  const txns = useAppStore((s) => s.txns);
  const topUp = useAppStore((s) => s.topUp);

  const [filter, setFilter] = useState<"all" | "debit" | "topup">("all");

  const rows = useMemo(() => {
    const base = txns.slice(0, 30);
    if (filter === "all") return base;
    return base.filter((t) => t.type === filter);
  }, [txns, filter]);

  const userName = "Rina"; // demo label (matches your screenshot vibe)
  const cardName = "SNOONU LIFE";
  const masked = "•••• 3144";

  const quickPeople = [
    { name: "Mark R.", color: "rgba(10,132,255,0.18)" },
    { name: "Kris", color: "rgba(255,149,0,0.18)" },
    { name: "Helen T.", color: "rgba(52,199,89,0.18)" },
    { name: "Tony Gym", color: "rgba(175,82,222,0.18)" },
  ];

  return (
    <div className="pb-24">
      {/* Header row like app */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-semibold"
            style={{ background: "rgba(0,0,0,0.06)", color: "var(--text)" }}
          >
            {initials(userName)}
          </div>
          <div>
            <div className="text-[13px]" style={{ color: "var(--muted)" }}>
              Wallet
            </div>
            <div className="text-[18px] font-semibold tracking-tight">
              Hi, {userName}
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

      <div className="px-4 mt-4 space-y-4">
        {/* HERO CREDIT CARD (matches wireframe) */}
        <div
          className="rounded-[26px] border overflow-hidden"
          style={{
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-soft)",
            background:
              "radial-gradient(1200px 420px at 10% 0%, rgba(227,6,19,0.22) 0%, rgba(255,255,255,0.78) 58%, rgba(255,255,255,0.92) 100%)",
          }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                  Balance
                </div>
                <div className="text-[28px] font-semibold tracking-tight mt-1">
                  {fmtQAR(balance)}
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-pill text-[12px] font-semibold border"
                   style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.55)" }}>
                Main card
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                  {cardName}
                </div>
                <div className="text-[13px] font-semibold mt-1" style={{ letterSpacing: "0.04em" }}>
                  {masked}
                </div>
              </div>

              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                08/26
              </div>
            </div>

            {/* Quick actions row (Deposit / Send / More) */}
            <div className="mt-4 flex gap-2">
              <ActionPill label="Deposit" onClick={() => {}}  />
              <ActionPill label="Send" onClick={() => topUp(0)}  />
              <ActionPill label="More" onClick={() => {}} />
            </div>
          </div>
        </div>

                {/* TOP-UP PRESETS (realistic) */}
        <div
          className="rounded-[22px] border p-4"
          style={{
            borderColor: "var(--border)",
            background: "rgba(255,255,255,0.65)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                Top-up
              </div>
              <div className="text-[14px] font-semibold">Choose an amount</div>
            </div>

            <div
              className="px-3 py-1.5 rounded-pill border text-[12px] font-semibold"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.60)",
                color: "var(--muted)",
              }}
            >
              Card • {masked}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[100, 200, 500, 1000].map((amt) => (
              <button
                key={amt}
                className="h-11 rounded-[16px] border font-semibold text-[13px]"
                style={{
                  borderColor: "rgba(0,0,0,0.06)",
                  background: "rgba(255,255,255,0.75)",
                  color: "var(--text)",
                }}
                onClick={() => topUp(amt)}
              >
                +{amt}
              </button>
            ))}
          </div>

          <div className="mt-3 text-[12px]" style={{ color: "var(--muted)" }}>
            Demo rule: top-ups are fixed presets (like real wallets).
          </div>
        </div>


        {/* Quick transfer row (matches wireframe) */}
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold">Quick transfer</div>
          <button className="text-[13px] font-semibold" style={{ color: "var(--muted)" }}>
            View all
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {quickPeople.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-1 shrink-0">
              <div
                className="w-12 h-12 rounded-full border flex items-center justify-center font-semibold"
                style={{
                  borderColor: "var(--border)",
                  background: p.color,
                  color: "var(--text)",
                }}
              >
                {initials(p.name)}
              </div>
              <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                {p.name}
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              className="w-12 h-12 rounded-full border flex items-center justify-center text-[20px] font-semibold"
              style={{
                borderColor: "var(--border)",
                background: "rgba(255,255,255,0.65)",
                color: "var(--snoonu-red)",
              }}
              onClick={() => topUp(500)}
            >
              +
            </button>
            <div className="text-[12px]" style={{ color: "var(--muted)" }}>
              Add
            </div>
          </div>
        </div>

        {/* Transactions section (matches wireframe: filter pills + list) */}
        <div className="flex items-center justify-between mt-2">
          <div className="text-[16px] font-semibold">Transactions</div>
          <button className="text-[13px] font-semibold" style={{ color: "var(--muted)" }}>
            Filter
          </button>
        </div>

        <div className="flex gap-2">
          <Segment active={filter === "all"} onClick={() => setFilter("all")} label="All" />
          <Segment active={filter === "debit"} onClick={() => setFilter("debit")} label="Spendings" />
          <Segment active={filter === "topup"} onClick={() => setFilter("topup")} label="Earnings" />
        </div>

        <div className="space-y-2">
          {rows.slice(0, 10).length === 0 ? (
            <div
              className="rounded-[18px] border p-4"
              style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.65)" }}
            >
              <div className="text-[13px]" style={{ color: "var(--muted)" }}>
                No transactions yet. Top-up to test the demo.
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-4 py-2 rounded-pill text-white font-semibold"
                  style={{ background: "var(--accent-gradient)" }}
                  onClick={() => topUp(200)}
                >
                  +200
                </button>
                <button
                  className="px-4 py-2 rounded-pill text-white font-semibold"
                  style={{ background: "var(--accent-gradient)" }}
                  onClick={() => topUp(500)}
                >
                  +500
                </button>
              </div>
            </div>
          ) : (
            rows.slice(0, 10).map((t) => (
              <div
                key={t.id}
                className="rounded-[18px] border px-4 py-3 flex items-center justify-between"
                style={{
                  borderColor: "var(--border)",
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                <div className="min-w-0">
                  <div className="font-semibold text-[14px] truncate">{t.title}</div>
                  <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                    {new Date(t.atISO).toLocaleString()}
                  </div>
                </div>

                <div
                  className="font-semibold text-[14px]"
                  style={{
                    color: t.type === "topup" ? "rgba(52,199,89,0.95)" : "var(--text)",
                  }}
                >
                  {t.type === "topup" ? `+QAR ${t.amountQAR}` : `-QAR ${t.amountQAR}`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ActionPill(props: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className="flex-1 h-10 rounded-pill border text-[13px] font-semibold"
      style={{
        borderColor: "rgba(0,0,0,0.06)",
        background: props.disabled ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.62)",
        color: props.disabled ? "rgba(0,0,0,0.25)" : "var(--text)",
      }}
    >
      {props.label}
    </button>
  );
}

function Segment(props: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className="flex-1 h-10 rounded-pill border text-[13px] font-semibold transition"
      style={{
        borderColor: "var(--border)",
        background: props.active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.55)",
        color: props.active ? "var(--text)" : "var(--muted)",
      }}
    >
      {props.label}
    </button>
  );
}
