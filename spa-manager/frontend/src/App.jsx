import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout       from './components/Layout';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import Employees    from './pages/Employees';
import Clients      from './pages/Clients';
import Services     from './pages/Services';
import Appointments from './pages/Appointments';
import Schedule     from './pages/Schedule';
import Reports      from './pages/Reports';
import Gastos       from './pages/Gastos';
import Comisiones   from './pages/Comisiones';
import CierreDia    from './pages/CierreDia';

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/schedule"     element={<Schedule />} />
        <Route path="/clients"      element={<Clients />} />
        <Route path="/services"     element={<RequireAdmin><Services /></RequireAdmin>} />
        <Route path="/employees"    element={<RequireAdmin><Employees /></RequireAdmin>} />
        <Route path="/reports"      element={<RequireAdmin><Reports /></RequireAdmin>} />
        <Route path="/gastos"       element={<RequireAdmin><Gastos /></RequireAdmin>} />
        <Route path="/comisiones"   element={<RequireAdmin><Comisiones /></RequireAdmin>} />
        <Route path="/cierre"       element={<RequireAdmin><CierreDia /></RequireAdmin>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
