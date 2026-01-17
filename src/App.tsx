import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { PlanScreen } from "./features/plan/PlanScreen";
import { WalletScreen } from "./features/wallet/WalletScreen";
import { TemplatesScreen } from "./features/templates/TemplatesScreen";
import { FamilyScreen } from "./features/family/FamilyScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import { useAppStore } from "./store/useAppStore";

function DemoLoader() {
  const loadDemo = useAppStore((s) => s.loadDemo);
  loadDemo();
  return <Navigate to="/plan" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/plan" />} />
          <Route path="/plan" element={<PlanScreen />} />
          <Route path="/wallet" element={<WalletScreen />} />
          <Route path="/templates" element={<TemplatesScreen />} />
          <Route path="/family" element={<FamilyScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>
        <Route path="/demo" element={<DemoLoader />} />
      </Routes>
    </BrowserRouter>
  );
}
