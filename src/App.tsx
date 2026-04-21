import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { LoginPage } from './pages/LoginPage'
import { StudentDashboard } from './pages/StudentDashboard'
import { ExperimentWorkbench } from './components/ExperimentWorkbench'
import { TeacherDashboard } from './pages/TeacherDashboard'
import { TeacherTaskManager } from './pages/TeacherTaskManager'
import { TeacherGrading } from './pages/TeacherGrading'
import { StudentTasks } from './pages/StudentTasks'
import { StudentReports } from './pages/StudentReports'

const queryClient = new QueryClient()

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'student' | 'teacher' }) {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />
  
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/experiment/:id" element={
            <ProtectedRoute requiredRole="student">
              <ExperimentWorkbench />
            </ProtectedRoute>
          } />
          
          <Route path="/my-tasks" element={
            <ProtectedRoute requiredRole="student">
              <StudentTasks />
            </ProtectedRoute>
          } />
          
          <Route path="/my-reports" element={
            <ProtectedRoute requiredRole="student">
              <StudentReports />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher" element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/tasks" element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherTaskManager />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/grading" element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherGrading />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
