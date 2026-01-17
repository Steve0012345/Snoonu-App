// src/store/useAppStore.ts
import { create } from "zustand";

export type ServiceVertical =
  | "Groceries"
  | "Dining"
  | "Gym"
  | "Cinema"
  | "Transport"
  | "Other";

export type Recurrence = "none" | "weekly" | "biweekly" | "monthly";
export type ActivityStatus = "scheduled" | "prepaid" | "completed" | "cancelled";

export type FamilyRole = "owner" | "member";

export type FamilyMember = {
  id: string;
  name: string;
  role: FamilyRole;
  avatarSeed: string;
};

export type FamilyInvite = {
  id: string;
  phoneOrEmail: string;
  status: "pending" | "accepted" | "expired";
  createdAtISO: string;
};

export type SplitMode = "me" | "equal" | "custom";

export type ActivitySplit = {
  enabled: boolean;
  mode: SplitMode;
  // per member amount in QAR (custom mode)
  customQARByMemberId: Record<string, number>;
  // who pays upfront (wallet debit) in demo
  payerMemberId: string;
  // if true, other members must approve before activation/auto-pay
  requiresApprovals: boolean;
  approvals: Record<string, "pending" | "approved" | "rejected">;
};

export type Activity = {
  id: string;
  title: string;
  vertical: ServiceVertical;
  startAtISO: string;
  amountQAR: number;
  status: ActivityStatus;
  seriesId?: string;

  // FAMILY
  split?: ActivitySplit;
};

export type Txn = {
  id: string;
  atISO: string;
  type: "topup" | "debit";
  title: string;
  amountQAR: number;
  vertical?: ServiceVertical;

  // FAMILY
  meta?: {
    activityId?: string;
    payerMemberId?: string;
    splitSummary?: string;
  };
};

type DemoState = {
  monthlyBudget: number;
  walletBalance: number;
};

type UIToast = { id: string; title: string; subtitle?: string };

type UIState = {
  isAddActivityOpen: boolean;
  isCalendarOpen: boolean;
  toasts: UIToast[];
};

type PlanState = {
  isActive: boolean;
  virtualNowISO: string;
  speed: 1 | 5 | 20;
};

type FamilyState = {
  householdName: string;
  members: FamilyMember[];
  invites: FamilyInvite[];
  activityFeed: { id: string; atISO: string; text: string }[];
};

type AddActivityParams = {
  title: string;
  vertical: ServiceVertical;
  startAtISO: string;
  amountQAR: number;
  recurrence: Recurrence;
  recurrenceCount: number;

  // optional family split
  split?: Omit<ActivitySplit, "approvals"> & {
    approvals?: Record<string, "pending" | "approved" | "rejected">;
  };
};

export type AppState = {
  demo: DemoState;
  plan: PlanState;
  ui: UIState;
  family: FamilyState;

  activities: Activity[];
  txns: Txn[];

  topUp: (amount: number) => void;

  totalAllocated: () => number;
  remainingBudget: () => number;

  // UI
  openAddActivity: () => void;
  closeAddActivity: () => void;

  toggleCalendar: () => void;
  openCalendar: () => void;
  closeCalendar: () => void;

  pushToast: (t: Omit<UIToast, "id">) => void;
  dismissToast: (id: string) => void;

  // demo controls
  setMonthlyBudget: (v: number) => void;
  setWalletBalance: (v: number) => void;

  // Wallet
  topUpPreset: (amountQAR: 100 | 200 | 500 | 1000) => { ok: true } | { ok: false; error: string };

  // Plan activation
  activatePlan: () => { ok: true } | { ok: false; error: string };
  deactivatePlan: () => void;

  setSpeed: (s: 1 | 5 | 20) => void;
  setVirtualNowISO: (iso: string) => void;

  tickScheduler: () => void;

  // Activities
  addActivityWithRecurrence: (params: AddActivityParams) => { ok: true } | { ok: false; error: string };
  approveSplit: (activityId: string, memberId: string) => void;
  rejectSplit: (activityId: string, memberId: string) => void;

  // Family
  inviteFamily: (phoneOrEmail: string) => { ok: true } | { ok: false; error: string };
  acceptInvite: (inviteId: string, name?: string) => void;
  removeMember: (memberId: string) => void;

  // Demo helpers
  loadDemo: () => void;
  reset: () => void;
};

function uid(prefix = "x") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function expandRecurrence(startAtISO: string, recurrence: Recurrence, count: number) {
  const base = new Date(startAtISO);
  if (recurrence === "none") return [new Date(base)];

  const n = Math.max(1, count);
  const out: Date[] = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) out.push(new Date(base));
    else if (recurrence === "weekly") out.push(addDays(base, 7 * i));
    else if (recurrence === "biweekly") out.push(addDays(base, 14 * i));
    else out.push(addMonths(base, i));
  }
  return out;
}

function pushFeed(setFn: any, text: string, atISO: string) {
  setFn((s: AppState) => ({
    family: {
      ...s.family,
      activityFeed: [{ id: uid("feed"), atISO, text }, ...s.family.activityFeed].slice(0, 20),
    },
  }));
}

export const useAppStore = create<AppState>((set, get) => ({
  demo: { monthlyBudget: 2500, walletBalance: 1800 },
  plan: { isActive: false, virtualNowISO: new Date().toISOString(), speed: 1 },
  ui: { isAddActivityOpen: false, isCalendarOpen: false, toasts: [] },

  family: {
    householdName: "Rina's Family",
    members: [
      { id: "me", name: "You", role: "owner", avatarSeed: "you" },
      { id: "m1", name: "Ahmed", role: "member", avatarSeed: "ahmed" },
      { id: "m2", name: "Chris", role: "member", avatarSeed: "chris" }
    ],
    invites: [],
    activityFeed: [],
  },

  activities: [],
  txns: [],

  totalAllocated: () => {
    let sum = 0;
    for (const a of get().activities) if (a.status !== "cancelled") sum += a.amountQAR;
    return sum;
  },
  remainingBudget: () => Math.max(0, get().demo.monthlyBudget - get().totalAllocated()),

  openAddActivity: () => set((s) => ({ ui: { ...s.ui, isAddActivityOpen: true } })),
  closeAddActivity: () => set((s) => ({ ui: { ...s.ui, isAddActivityOpen: false } })),

  toggleCalendar: () => set((s) => ({ ui: { ...s.ui, isCalendarOpen: !s.ui.isCalendarOpen } })),
  openCalendar: () => set((s) => ({ ui: { ...s.ui, isCalendarOpen: true } })),
  closeCalendar: () => set((s) => ({ ui: { ...s.ui, isCalendarOpen: false } })),

  pushToast: (t) => {
    const id = uid("toast");
    set((s) => ({ ui: { ...s.ui, toasts: [...s.ui.toasts, { id, ...t }] } }));
    setTimeout(() => get().dismissToast(id), 2600);
  },
  dismissToast: (id) =>
    set((s) => ({
      ui: {
        ...s.ui,
        toasts: s.ui.toasts.filter((x) => x.id !== id),
      },
    })),

  topUp: (amount: number) =>
      set((s) => ({ demo: { ...s.demo, walletBalance: s.demo.walletBalance + amount } })),
    

  setMonthlyBudget: (v) => set((s) => ({ demo: { ...s.demo, monthlyBudget: v } })),
  setWalletBalance: (v) => set((s) => ({ demo: { ...s.demo, walletBalance: v } })),

  topUpPreset: (amountQAR) => {
    if (![100, 200, 500, 1000].includes(amountQAR)) return { ok: false, error: "Invalid preset." };

    set((s) => ({
      demo: { ...s.demo, walletBalance: s.demo.walletBalance + amountQAR },
      txns: [
        { id: uid("txn"), atISO: get().plan.virtualNowISO, type: "topup", title: "Wallet top-up", amountQAR },
        ...s.txns,
      ],
    }));
    get().pushToast({ title: "Top-up successful", subtitle: `+QAR ${amountQAR}` });
    pushFeed(set, `Wallet topped up by QAR ${amountQAR}.`, get().plan.virtualNowISO);
    return { ok: true };
  },

  activatePlan: () => {
    if (get().plan.isActive) return { ok: true };
    if (get().activities.length === 0) return { ok: false, error: "Add at least one activity first." };

    // If any activity requires approvals and not fully approved, block activation
    const members = get().family.members.map((m) => m.id);
    const pending = get().activities.find((a) => {
      const sp = a.split;
      if (!sp?.enabled || !sp.requiresApprovals) return false;
      const approvals = sp.approvals;
      return members.some((mid) => approvals[mid] === "pending");
    });

    if (pending) return { ok: false, error: "Some split activities still need family approval." };

    set((s) => ({ plan: { ...s.plan, isActive: true } }));
    get().pushToast({ title: "Plan activated", subtitle: "Auto-pay simulation enabled." });
    pushFeed(set, "Plan activated.", get().plan.virtualNowISO);
    return { ok: true };
  },

  deactivatePlan: () => {
    set((s) => ({ plan: { ...s.plan, isActive: false } }));
    pushFeed(set, "Plan paused.", get().plan.virtualNowISO);
  },

  setSpeed: (speed) => set((s) => ({ plan: { ...s.plan, speed } })),
  setVirtualNowISO: (iso) => set((s) => ({ plan: { ...s.plan, virtualNowISO: iso } })),

  tickScheduler: () => {
    const { plan } = get();
    if (!plan.isActive) return;

    const now = new Date(plan.virtualNowISO);
    const advanced = new Date(now.getTime() + 1000 * plan.speed);
    set((s) => ({ plan: { ...s.plan, virtualNowISO: advanced.toISOString() } }));

    const current = advanced;
    const acts = get().activities;

    let wallet = get().demo.walletBalance;
    const txnsToAdd: Txn[] = [];

    const updated: Activity[] = acts.map((a): Activity => {
      if (a.status === "cancelled") return a;

      const eventMs = new Date(a.startAtISO).getTime();
      const nowMs = current.getTime();
      const minsTo = (eventMs - nowMs) / 60000;

      // must have approvals if required
      if (a.split?.enabled && a.split.requiresApprovals) {
        const approvals = a.split.approvals;
        const members = get().family.members.map((m) => m.id);
        const pending = members.some((mid) => approvals[mid] === "pending");
        const rejected = members.some((mid) => approvals[mid] === "rejected");
        if (rejected) return { ...a, status: "cancelled" as ActivityStatus };
        if (pending) return a;
      }

      if (a.status === "scheduled" && minsTo <= 30) {
        const payer = a.split?.enabled ? a.split.payerMemberId : "me";
        // demo rule: payer must be "me" wallet. If payer isn't me, we still log it but don't touch wallet.
        if (payer === "me") {
          if (wallet >= a.amountQAR) {
            wallet -= a.amountQAR;
            txnsToAdd.push({
              id: uid("txn"),
              atISO: current.toISOString(),
              type: "debit",
              title: a.title,
              amountQAR: a.amountQAR,
              vertical: a.vertical,
              meta: { activityId: a.id, payerMemberId: payer, splitSummary: a.split?.enabled ? a.split.mode : "me" },
            });
            get().pushToast({ title: "Auto-paid", subtitle: `${a.title} • QAR ${a.amountQAR}` });
            pushFeed(set, `Auto-paid: ${a.title} (QAR ${a.amountQAR}).`, current.toISOString());
            return { ...a, status: "prepaid" as ActivityStatus };
          } else {
            get().pushToast({ title: "Wallet low", subtitle: `Top up to auto-pay: ${a.title}` });
            return a;
          }
        } else {
          // simulated external payer
          txnsToAdd.push({
            id: uid("txn"),
            atISO: current.toISOString(),
            type: "debit",
            title: `${a.title} (paid by family)`,
            amountQAR: a.amountQAR,
            vertical: a.vertical,
            meta: { activityId: a.id, payerMemberId: payer, splitSummary: "family" },
          });
          pushFeed(set, `${a.title} paid by ${get().family.members.find((m) => m.id === payer)?.name ?? "family"}.`, current.toISOString());
          return { ...a, status: "prepaid" as ActivityStatus };
        }
      }

      if ((a.status === "prepaid" || a.status === "scheduled") && nowMs - eventMs >= 10 * 60 * 1000) {
        return { ...a, status: "completed" as ActivityStatus };
      }

      return a;
    });

    if (txnsToAdd.length > 0) {
      set((s) => ({
        demo: { ...s.demo, walletBalance: wallet },
        txns: [...txnsToAdd, ...s.txns],
        activities: updated,
      }));
    } else {
      set((_) => ({ activities: updated }));
    }
  },

  addActivityWithRecurrence: (params) => {
    const { title, vertical, startAtISO, amountQAR, recurrence, recurrenceCount, split } = params;

    if (!title.trim()) return { ok: false, error: "Please enter a title." };
    if (!Number.isFinite(amountQAR) || amountQAR <= 0) return { ok: false, error: "Amount must be > 0." };
    if (!startAtISO) return { ok: false, error: "Please pick a date/time." };

    const dates = expandRecurrence(startAtISO, recurrence, recurrenceCount);
    const totalNewCost = dates.length * amountQAR;

    if (get().totalAllocated() + totalNewCost > get().demo.monthlyBudget) {
      return { ok: false, error: "Budget exceeded. Reduce amount or recurrence." };
    }

    const seriesId = dates.length > 1 ? uid("series") : undefined;

    const members = get().family.members;

    const baseSplit: ActivitySplit | undefined = split?.enabled
      ? {
          enabled: true,
          mode: split.mode,
          customQARByMemberId: split.customQARByMemberId ?? {},
          payerMemberId: split.payerMemberId ?? "me",
          requiresApprovals: !!split.requiresApprovals,
          approvals:
            split.approvals ??
            Object.fromEntries(members.map((m) => [m.id, m.id === "me" ? "approved" : "pending"])),
        }
      : undefined;

    const newActs: Activity[] = dates.map((d): Activity => ({
      id: uid("act"),
      title,
      vertical,
      startAtISO: d.toISOString(),
      amountQAR,
      status: "scheduled" as ActivityStatus,
      seriesId,
      split: baseSplit ? { ...baseSplit } : undefined,
    }));

    set((s) => ({ activities: [...s.activities, ...newActs] }));

    pushFeed(set, `Added activity: ${title} (QAR ${amountQAR}).`, get().plan.virtualNowISO);
    return { ok: true };
  },

  approveSplit: (activityId, memberId) => {
    set((s) => ({
      activities: s.activities.map((a) => {
        if (a.id !== activityId || !a.split?.enabled) return a;
        return { ...a, split: { ...a.split, approvals: { ...a.split.approvals, [memberId]: "approved" } } };
      }),
    }));
    pushFeed(set, `${get().family.members.find((m) => m.id === memberId)?.name ?? "Member"} approved a split.`, get().plan.virtualNowISO);
  },

  rejectSplit: (activityId, memberId) => {
    set((s) => ({
      activities: s.activities.map((a) => {
        if (a.id !== activityId || !a.split?.enabled) return a;
        return { ...a, split: { ...a.split, approvals: { ...a.split.approvals, [memberId]: "rejected" } } };
      }),
    }));
    pushFeed(set, `${get().family.members.find((m) => m.id === memberId)?.name ?? "Member"} rejected a split.`, get().plan.virtualNowISO);
  },

  inviteFamily: (phoneOrEmail) => {
    const v = phoneOrEmail.trim();
    if (v.length < 6) return { ok: false, error: "Enter a valid phone/email." };

    const inv: FamilyInvite = { id: uid("inv"), phoneOrEmail: v, status: "pending", createdAtISO: get().plan.virtualNowISO };
    set((s) => ({ family: { ...s.family, invites: [inv, ...s.family.invites] } }));
    pushFeed(set, `Invite sent to ${v}.`, get().plan.virtualNowISO);
    get().pushToast({ title: "Invite sent", subtitle: v });
    return { ok: true };
  },

  acceptInvite: (inviteId, name) => {
    const inv = get().family.invites.find((i) => i.id === inviteId);
    if (!inv) return;

    const memberName = (name?.trim() || inv.phoneOrEmail.split("@")[0] || "New member").slice(0, 18);
    const newMember: FamilyMember = { id: uid("mem"), name: memberName, role: "member", avatarSeed: memberName };

    set((s) => ({
      family: {
        ...s.family,
        invites: s.family.invites.map((i) => (i.id === inviteId ? { ...i, status: "accepted" } : i)),
        members: [...s.family.members, newMember],
      },
    }));

    pushFeed(set, `${memberName} joined your Family.`, get().plan.virtualNowISO);
    get().pushToast({ title: "Member added", subtitle: memberName });
  },

  removeMember: (memberId) => {
    if (memberId === "me") return;
    const name = get().family.members.find((m) => m.id === memberId)?.name ?? "Member";

    set((s) => ({
      family: { ...s.family, members: s.family.members.filter((m) => m.id !== memberId) },
    }));

    pushFeed(set, `${name} removed from Family.`, get().plan.virtualNowISO);
    get().pushToast({ title: "Removed", subtitle: name });
  },

  loadDemo: () => {
    const now = new Date();
    const a1 = new Date(now.getTime() + 15 * 60 * 1000);
    const a2 = new Date(now.getTime() + 75 * 60 * 1000);

    set({
      demo: { monthlyBudget: 2500, walletBalance: 1800 },
      plan: { isActive: false, virtualNowISO: now.toISOString(), speed: 1 },
      ui: { isAddActivityOpen: false, isCalendarOpen: false, toasts: [] },
      family: {
        householdName: "Nday Family",
        members: [
          { id: "me", name: "You", role: "owner", avatarSeed: "you" },
          { id: "m1", name: "Ahmed", role: "member", avatarSeed: "ahmed" },
        ],
        invites: [],
        activityFeed: [],
      },
      txns: [],
      activities: [
        {
          id: uid("act"),
          title: "Groceries run",
          vertical: "Groceries",
          startAtISO: a1.toISOString(),
          amountQAR: 220,
          status: "scheduled" as ActivityStatus,
          split: {
            enabled: true,
            mode: "equal",
            customQARByMemberId: {},
            payerMemberId: "me",
            requiresApprovals: true,
            approvals: { me: "approved", m1: "pending" },
          },
        },
        {
          id: uid("act"),
          title: "Dinner with friends",
          vertical: "Dining",
          startAtISO: a2.toISOString(),
          amountQAR: 140,
          status: "scheduled" as ActivityStatus,
        },
      ],
    });

    get().pushToast({ title: "Demo loaded", subtitle: "Family + approvals enabled." });
  },

  reset: () =>
    set({
      activities: [],
      txns: [],
      ui: { isAddActivityOpen: false, isCalendarOpen: false, toasts: [] },
      plan: { isActive: false, virtualNowISO: new Date().toISOString(), speed: 1 },
      family: {
        householdName: "Rina's Family",
        members: [{ id: "me", name: "You", role: "owner", avatarSeed: "you" }],
        invites: [],
        activityFeed: [],
      },
    }),
}));
