import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { ToastProvider } from './components/Toast'
import Home            from './pages/Home'
import Pricing         from './pages/Pricing'
import Login           from './pages/Login'
import Signup          from './pages/Signup'
import Onboarding      from './pages/Onboarding'
import Dashboard       from './pages/Dashboard'
import DataSources     from './pages/DataSources'
import BRSRReport      from './pages/BRSRReport'
import CBAMReport      from './pages/CBAMReport'
import EmissionsTracker from './pages/EmissionsTracker'
import Suppliers       from './pages/Suppliers'
import Documents       from './pages/Documents'
import Settings        from './pages/Settings'
import NotFound        from './pages/NotFound'

function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth()
  const location = useLocation()
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

/** Keeps logged-in users off the auth pages. */
function PublicOnly({ children }) {
  const { isAuthed } = useAuth()
  if (isAuthed) return <Navigate to="/app" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/pricing"  element={<Pricing />} />
          <Route path="/login"    element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/signup"   element={<PublicOnly><Signup /></PublicOnly>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          {/* App — requires a session token */}
          <Route path="/app"               element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/app/data-sources"  element={<ProtectedRoute><DataSources /></ProtectedRoute>} />
          <Route path="/app/brsr"          element={<ProtectedRoute><BRSRReport /></ProtectedRoute>} />
          <Route path="/app/cbam"          element={<ProtectedRoute><CBAMReport /></ProtectedRoute>} />
          <Route path="/app/emissions"     element={<ProtectedRoute><EmissionsTracker /></ProtectedRoute>} />
          <Route path="/app/suppliers"     element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
          <Route path="/app/documents"     element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/app/settings"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
