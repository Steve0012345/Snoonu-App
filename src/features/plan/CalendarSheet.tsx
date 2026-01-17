import { Modal } from "../../design/ui/Modal";
import { MonthCalendar } from "../../components/MonthCalendar";
import { useAppStore } from "../../store/useAppStore";

export function CalendarSheet(props: {
  month: Date;
  setMonth: (d: Date) => void;
  selectedDay: Date;
  setSelectedDay: (d: Date) => void;
}) {
  const { month, setMonth, selectedDay, setSelectedDay } = props;

  const activities = useAppStore((s) => s.activities);
  const open = useAppStore((s) => s.ui.isCalendarOpen);
  const close = useAppStore((s) => s.closeCalendar);

  const prevMonth = () => {
    const m = new Date(month);
    m.setMonth(m.getMonth() - 1);
    setMonth(m);
  };

  const nextMonth = () => {
    const m = new Date(month);
    m.setMonth(m.getMonth() + 1);
    setMonth(m);
  };

  return (
    <Modal open={open} title="Calendar" onClose={close}>
      <div className="space-y-3">
        <div className="text-[12px]" style={{ color: "var(--muted)" }}>
          Tap a day to update your agenda. (Plan tab toggles this view.)
        </div>

        <MonthCalendar
          month={month}
          activities={activities}
          selectedDay={selectedDay}
          onSelectDay={(d) => {
            setSelectedDay(d);
            close(); // feels native: pick date -> return to agenda
          }}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />
      </div>
    </Modal>
  );
}
