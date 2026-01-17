import { Outlet } from "react-router-dom";
import { BottomTabs } from "../components/BottomTabs";
import { TopBar } from "../components/TopBar";
import { SchedulerRunner } from "./SchedulerRunner";
import { Toasts } from "../components/Toasts";


export function AppLayout() {
  return (
    <div className="min-h-screen pb-16">
      <TopBar />
      <main className="p-4 pt-6">
        <Outlet />
        <SchedulerRunner />
        <Toasts />
      </main>
      <BottomTabs />
      

    </div>
  );
}
