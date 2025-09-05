import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Login from "./pages/Login";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentPapers from "./pages/teacher/StudentPapers";
import ParentDashboard from "./pages/parent/ParentDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Dashboard Router Component
function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // Route based on user role
  switch (user.role) {
    case 'teacher':
      return (
        <Routes>
          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="/papers" element={<StudentPapers />} />
          <Route path="/feedback" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">AI Feedback Reports</h2><p className="text-muted-foreground">Coming soon - Comprehensive AI-powered analytics and insights.</p></div>} />
          <Route path="/students" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Students Management</h2><p className="text-muted-foreground">Coming soon - Detailed student profiles and progress tracking.</p></div>} />
          <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-muted-foreground">Coming soon - Customize your teaching preferences.</p></div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    case 'parent':
      return (
        <Routes>
          <Route path="/dashboard" element={<ParentDashboard />} />
          <Route path="/progress" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Detailed Progress</h2><p className="text-muted-foreground">Coming soon - In-depth progress analytics and trends.</p></div>} />
          <Route path="/messages" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Messages</h2><p className="text-muted-foreground">Coming soon - Direct communication with teachers.</p></div>} />
          <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-muted-foreground">Coming soon - Manage your account preferences.</p></div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    case 'student':
      return (
        <Routes>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/my-progress" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">My Progress</h2><p className="text-muted-foreground">Coming soon - Track your learning journey in detail.</p></div>} />
          <Route path="/assignments" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Assignments</h2><p className="text-muted-foreground">Coming soon - View and submit your assignments.</p></div>} />
          <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-muted-foreground">Coming soon - Personalize your learning experience.</p></div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    default:
      return <Navigate to="/login" replace />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardRouter />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
