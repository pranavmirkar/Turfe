import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import AuthModal from './components/AuthModal/AuthModal'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import HistoryPage from './pages/HistoryPage'
import RulesPage from './pages/RulesPage'

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        {/* Auth modal — rendered once, above all pages */}
        <AuthModal />

        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/rules" element={<RulesPage />} />

          {/* Protected (AppShell handles redirect if not logged in) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BookingProvider>
    </AuthProvider>
  )
}
