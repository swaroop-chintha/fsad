import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import StudentLayout from './layouts/StudentLayout';
import StudentCourses from './pages/StudentCourses';
import StudentChapters from './pages/StudentChapters';
import StudentHelp from './pages/StudentHelp';
import StudentSettings from './pages/StudentSettings';

function App() {
  return (
    <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

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
        </WebSocketProvider>
      </AuthProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
