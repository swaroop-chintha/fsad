import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import StudentLayout from './layouts/StudentLayout';
import StudentCourses from './pages/StudentCourses';
import StudentChapters from './pages/StudentChapters';
import StudentHelp from './pages/StudentHelp';
import StudentSettings from './pages/StudentSettings';
import { useAuth } from './context/AuthContext';

const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/teacher" replace />;
  return <Navigate to="/student" replace />;
};

function App() {
  return (
    <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<DashboardRouter />} />

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/teacher" element={<TeacherDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                <Route path="/student" element={<StudentLayout />}>
                  <Route index element={<StudentDashboard />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="chapters" element={<StudentChapters />} />
                  <Route path="help" element={<StudentHelp />} />
                  <Route path="settings" element={<StudentSettings />} />
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
      </AuthProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
