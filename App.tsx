import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import PaymentPage from "@/pages/PaymentPage";
import PendingPage from "@/pages/PendingPage";
import TotalSalesPage from "@/pages/TotalSalesPage";
import BookingPage from "@/pages/BookingPage";
import OccupiedPage from "@/pages/OccupiedPage";
import AllEntriesPage from "@/pages/AllEntriesPage";
import TodaysEntriesPage from "@/pages/TodaysEntriesPage";
import AdminManagementPage from "@/pages/AdminManagementPage";
import WarehousePage from "@/pages/WarehousePage";
import NotepadPage from "@/pages/NotepadPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Array<"admin" | "owner"> }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardRoute><Index /></DashboardRoute>} />
            <Route path="/cash" element={<DashboardRoute><PaymentPage paymentType="Cash" title="Cash Payments" /></DashboardRoute>} />
            <Route path="/gpay" element={<DashboardRoute><PaymentPage paymentType="GPay" title="GPay Payments" /></DashboardRoute>} />
            <Route path="/pending" element={<DashboardRoute><PendingPage /></DashboardRoute>} />
            <Route path="/total-sales" element={<DashboardRoute><TotalSalesPage /></DashboardRoute>} />
            <Route path="/booking" element={<DashboardRoute><BookingPage /></DashboardRoute>} />
            <Route path="/occupied" element={<DashboardRoute><OccupiedPage /></DashboardRoute>} />
            <Route path="/warehouse" element={<DashboardRoute><WarehousePage /></DashboardRoute>} />
            <Route path="/notepad" element={<DashboardRoute><NotepadPage /></DashboardRoute>} />
            
            <Route path="/all-entries" element={<DashboardRoute allowedRoles={["owner"]}><AllEntriesPage /></DashboardRoute>} />
            <Route path="/todays-entries" element={<DashboardRoute allowedRoles={["admin", "owner"]}><TodaysEntriesPage /></DashboardRoute>} />
            <Route path="/admin-management" element={<DashboardRoute allowedRoles={["owner"]}><AdminManagementPage /></DashboardRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
