import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./components/DashboardLayout";

/* INTERNAL AUTH */
import InternalLogin from "./pages/InternalLogin";
import InternalRegister from "./pages/InternalRegister";

/* DASHBOARDS */
import AdminDashboard from "./pages/AdminDashboard";
import PlannerDashboard from "./pages/PlannerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Production from "./pages/Production";
import WastageReport from "./pages/Waste";
import SummaryReport from "./pages/SummaryReport";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import ProductionRealDashboard from "./pages/ProductionTrack";
import DispatchManagement from "./pages/DispatchManagement";
import ProductionReport from "./pages/ProductionReport";

/* PROTECTED ROUTE */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <> 
      <Toaster position="top-right" />

      <Routes>

        {/* 🔐 LOGIN ROUTES */}
        <Route path="/" element={<InternalLogin />} />
        <Route path="/internal/register" element={<InternalRegister />} />

        {/* 🧭 DASHBOARD LAYOUT ROUTES */}
        <Route element={<DashboardLayout />}>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* PLANNER */}
          <Route
            path="/planner"
            element={
              <ProtectedRoute allowedRoles={["PLANNER", "ADMIN"]}>
                <PlannerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/production-real" element={<ProductionRealDashboard/>}/>
          <Route path="/dispatch" element={<DispatchManagement/>}/>

          {/* PURCHASE ORDERS */}
          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["PLANNER", "ADMIN", "OPERATOR"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* PRODUCTION */}
          <Route
            path="/production"
            element={
              <ProtectedRoute allowedRoles={["PRODUCTION", "ADMIN"]}>
                <Production />
              </ProtectedRoute>
            }
          />

          {/* WASTE */}
          <Route
            path="/waste"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "PRODUCTION"]}>
                <WastageReport />
              </ProtectedRoute>
            }
          />

          {/* REPORTS */}
          <Route
            path="/summary"
            element={
              <ProtectedRoute allowedRoles={["ADMIN","PRODUCTION"]}>
                <SummaryReport />
              </ProtectedRoute>
            }
          />

          {/* SUPERVISOR */}
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
  path="/production-report"
  element={
    <ProtectedRoute allowedRoles={["ADMIN","PRODUCTION","SUPERVISOR"]}>
      <ProductionReport />
    </ProtectedRoute>
  }
/>

        </Route>

      </Routes>
    </>
  );
}

export default App;