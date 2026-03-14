import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ProgramList from './components/ProgramList'
import ProgramDetails from './components/ProgramDetails'
import SubjectList from './components/SubjectList'
import StudentsEnrolled from './components/StudentsEnrolled'
import CoursesOffered from './components/CoursesOffered'
import SchoolDays from './components/SchoolDays'
import LoginPage from './components/loginpage'
import ResetPasswordPage from './components/ResetPasswordPage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function ResetPasswordRedirect() {
  const loc = useLocation()
  return <Navigate to={`/reset-password${loc.search}`} replace />
}

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset password" element={<ResetPasswordRedirect />} />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/programs" element={<ProgramList />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/students" element={<StudentsEnrolled />} />
          <Route path="/courses-offered" element={<CoursesOffered />} />
          <Route path="/school-days" element={<SchoolDays />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

