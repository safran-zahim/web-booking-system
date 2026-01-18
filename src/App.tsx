import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// --- Placeholder Components (We will build these next) ---
const LandingPage = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4">Welcome to SportBooker</h1>
    <p className="text-slate-500">The easiest way to book your game.</p>
  </div>
);

import BookingWizard from './pages/BookingWizard';




import AdminDashboard from './pages/AdminDashboard';
import AdminCourts from './pages/AdminCourts';

const UserDashboard = () => <div className="p-4 border rounded bg-white">My Bookings Component Coming Soon</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* User Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/book" element={<BookingWizard />} />
          <Route path="/my-bookings" element={<UserDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courts" element={<AdminCourts />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
