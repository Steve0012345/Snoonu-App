import { useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "S";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FamilyScreen() {
  const family = useAppStore((s) => s.family);
  const activities = useAppStore((s) => s.activities);

  const inviteFamily = useAppStore((s) => s.inviteFamily);
  const acceptInvite = useAppStore((s) => s.acceptInvite);
  const removeMember = useAppStore((s) => s.removeMember);

  const approveSplit = useAppStore((s) => s.approveSplit);
  const rejectSplit = useAppStore((s) => s.rejectSplit);

  const [invite, setInvite] = useState("");

  const pendingApprovals = useMemo(() => {
    return activities
      .filter((a) => a.split?.enabled && a.split.requiresApprovals)
      .filter((a) => {
        const approvals = a.split!.approvals;
        return Object.values(approvals).some((v) => v === "pending");
      })
      .sort((a, b) => new Date(a.startAtISO).getTime() - new Date(b.startAtISO).getTime());
  }, [activities]);

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px]" style={{ color: "var(--muted)" }}>
              Household
            </div>
            <div className="text-[22px] font-semibold tracking-tight">{family.householdName}</div>
          </div>

          <div
            className="px-3 py-2 rounded-pill border text-[13px] font-semibold"
            style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.65)" }}
          >
            {family.members.length} members
          </div>
        </div>

        {/* Invite card */}
        <div
          className="rounded-[22px] border p-4"
          style={{
            borderColor: "var(--border)",
            background: "rgba(255,255,255,0.65)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="font-semibold text-[16px]">Invite family</div>
          <div className="text-[12px] mt-1" style={{ color: "var(--muted)" }}>
            Send an invite link (demo: instant accept from this screen).
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              className="flex-1 border rounded-pill px-4 py-2 bg-white/70"
              style={{ borderColor: "var(--border)" }}
              placeholder="Phone or email"
            />
            <button
              className="px-4 py-2 rounded-pill text-white font-semibold"
              style={{ background: "var(--accent-gradient)" }}
              onClick={() => {
                const res = inviteFamily(invite);
                if (res.ok) setInvite("");
              }}
            >
              Send
            </button>
          </div>

          {family.invites.length > 0 && (
            <div className="mt-3 space-y-2">
              {family.invites.slice(0, 3).map((i) => (
                <div
                  key={i.id}
                  className="rounded-[18px] border px-3 py-3 flex items-center justify-between"
                  style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.60)" }}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-[14px] truncate">{i.phoneOrEmail}</div>
                    <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                      {i.status} • {fmtTime(i.createdAtISO)}
                    </div>
                  </div>

                  {i.status === "pending" ? (
                    <button
                      className="px-3 py-2 rounded-pill border text-[13px] font-semibold"
                      style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.75)" }}
                      onClick={() => acceptInvite(i.id)}
                    >
                      Accept
                    </button>
                  ) : (
                    <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
                      Joined
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div
          className="rounded-[22px] border p-4"
          style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.65)" }}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-[16px]">Members</div>
            <div className="text-[12px]" style={{ color: "var(--muted)" }}>
              Owner can remove members
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {family.members.map((m) => (
              <div
                key={m.id}
                className="rounded-[18px] border px-3 py-3 flex items-center justify-between"
                style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.60)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  >
                    {initials(m.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[14px] truncate">{m.name}</div>
                    <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                      {m.role}
                    </div>
                  </div>
                </div>

                {m.id !== "me" && (
                  <button
                    className="px-3 py-2 rounded-pill border text-[13px] font-semibold"
                    style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.75)" }}
                    onClick={() => removeMember(m.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending approvals */}
        <div
          className="rounded-[22px] border p-4"
          style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.65)" }}
        >
          <div className="font-semibold text-[16px]">Approvals</div>
          <div className="text-[12px] mt-1" style={{ color: "var(--muted)" }}>
            Split activities can require family approval before auto-pay.
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="mt-3 text-[13px]" style={{ color: "var(--muted)" }}>
              No pending approvals right now.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {pendingApprovals.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  className="rounded-[18px] border px-3 py-3"
                  style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.60)" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-[14px] truncate">{a.title}</div>
                      <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                        {new Date(a.startAtISO).toLocaleString()} • QAR {a.amountQAR} • Split: {a.split?.mode}
                      </div>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-pill text-[12px] font-semibold"
                      style={{ background: "rgba(227,6,19,0.10)", color: "var(--snoonu-red)" }}
                    >
                      Needs approval
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 rounded-pill text-white font-semibold"
                      style={{ background: "var(--accent-gradient)" }}
                      onClick={() => approveSplit(a.id, "m1")}
                    >
                      Approve (John)
                    </button>
                    <button
                      className="flex-1 px-3 py-2 rounded-pill border font-semibold"
                      style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.75)" }}
                      onClick={() => rejectSplit(a.id, "m1")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div
          className="rounded-[22px] border p-4"
          style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.65)" }}
        >
          <div className="font-semibold text-[16px]">Family activity</div>
          <div className="mt-3 space-y-2">
            {family.activityFeed.length === 0 ? (
              <div className="text-[13px]" style={{ color: "var(--muted)" }}>
                No activity yet. Try inviting a member or adding a split activity.
              </div>
            ) : (
              family.activityFeed.slice(0, 10).map((f) => (
                <div
                  key={f.id}
                  className="rounded-[18px] border px-3 py-3"
                  style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.60)" }}
                >
                  <div className="text-[13px] font-semibold">{f.text}</div>
                  <div className="text-[12px]" style={{ color: "var(--muted)" }}>
                    {fmtTime(f.atISO)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
