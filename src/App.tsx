import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/useAuth'
import { T, body, useTheme } from './lib/theme'
import { Landing } from './pages/Landing'
import { ConnectPage } from './pages/ConnectPage'
import { UrgencyPage } from './pages/UrgencyPage'
import { AlertsPage } from './pages/AlertsPage'
import { DemoPage } from './pages/DemoPage'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Setup } from './pages/Setup'

function App() {
  const { user, loading } = useAuth()
  useTheme() // applies the saved palette on load; the toggle itself lives in the Shell header

  if (loading) {
    return <div style={{ background: T.ink, color: T.text, minHeight: '100vh', padding: 24, fontFamily: body }}>Loading…</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/connect" element={<ConnectPage />} />
      <Route path="/urgency" element={<UrgencyPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/signin" element={user ? <Navigate to="/setup" /> : <SignIn />} />
      <Route path="/signup" element={user ? <Navigate to="/setup" /> : <SignUp />} />
      <Route path="/setup" element={user ? <Setup /> : <Navigate to="/signin" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
export default App