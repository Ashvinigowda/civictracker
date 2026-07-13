import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ReportIssue from "./pages/ReportIssue";
import TrackComplaint from "./pages/TrackComplaint";
import IssuesMap from "./pages/IssuesMap";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MemberDashboard from "./pages/MemberDashboard";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/map" element={<IssuesMap />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member"
              element={
                <ProtectedRoute roles={["BBMP", "BWSSB", "BESOM"]}>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
