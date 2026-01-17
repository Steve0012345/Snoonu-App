import { useMemo, useState } from "react";
import { Modal } from "../../design/ui/Modal";
import { Button } from "../../design/ui/Button";
import { useAppStore, type Recurrence, type ServiceVertical } from "../../store/useAppStore";

const verticals: ServiceVertical[] = ["Groceries", "Dining", "Gym", "Cinema", "Transport", "Other"];

function toLocalDatetimeValue(date: Date) {
  // format for <input type="datetime-local">
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function AddActivityModal({ selectedDay }: { selectedDay: Date }) {
  const open = useAppStore((s) => s.ui.isAddActivityOpen);
  const close = useAppStore((s) => s.closeAddActivity);
  const add = useAppStore((s) => s.addActivityWithRecurrence);

  const [title, setTitle] = useState("");
  const [vertical, setVertical] = useState<ServiceVertical>("Dining");
  const [amount, setAmount] = useState<string>("50");
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [count, setCount] = useState<string>("4");
  const [startAt, setStartAt] = useState<string>(() => {
    const d = new Date(selectedDay);
    d.setHours(18, 0, 0, 0);
    return toLocalDatetimeValue(d);
  });
  const [error, setError] = useState<string>("");

  // When selectedDay changes in the Plan screen, we want startAt to follow it.
  // But we avoid complex syncing; user can still change manually.
  const defaultStartAt = useMemo(() => {
    const d = new Date(selectedDay);
    d.setHours(18, 0, 0, 0);
    return toLocalDatetimeValue(d);
  }, [selectedDay]);

  const onSubmit = () => {
    setError("");
    const amountQAR = Number(amount);
    const recurrenceCount = Math.max(1, Number(count) || 1);

    // datetime-local returns local time string; convert to Date then ISO
    const dt = new Date(startAt);
    const res = add({
      title,
      vertical,
      startAtISO: dt.toISOString(),
      amountQAR,
      recurrence,
      recurrenceCount: recurrence === "none" ? 1 : recurrenceCount,
    });

    if (!res.ok) {
      setError(res.error);
      return;
    }

    // reset minimal fields after add
    setTitle("");
    setVertical("Dining");
    setAmount("50");
    setRecurrence("none");
    setCount("4");
    setStartAt(defaultStartAt);
    close();
  };

  return (
    <Modal open={open} title="Add activity" onClose={close}>
      <div className="space-y-3">
        {error && (
          <div className="text-sm bg-warning/20 border border-warning/40 text-text rounded-card p-2">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <div className="text-sm text-muted">Title</div>
          <input
            className="w-full border border-border rounded-card px-3 py-2 bg-bg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Dinner with friends"
          />
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted">Service</div>
          <select
            className="w-full border border-border rounded-card px-3 py-2 bg-bg"
            value={vertical}
            onChange={(e) => setVertical(e.target.value as ServiceVertical)}
          >
            {verticals.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted">Date & time</div>
          <input
            className="w-full border border-border rounded-card px-3 py-2 bg-bg"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted">Budget (QAR)</div>
          <input
            className="w-full border border-border rounded-card px-3 py-2 bg-bg"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50"
          />
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted">Recurring</div>
          <select
            className="w-full border border-border rounded-card px-3 py-2 bg-bg"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as Recurrence)}
          >
            <option value="none">No</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {recurrence !== "none" && (
          <div className="space-y-1">
            <div className="text-sm text-muted">Occurrences</div>
            <input
              className="w-full border border-border rounded-card px-3 py-2 bg-bg"
              inputMode="numeric"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="4"
            />
            <div className="text-xs text-muted">Includes the first activity.</div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" className="w-full" onClick={close}>
            Cancel
          </Button>
          <Button className="w-full" onClick={onSubmit}>
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}
