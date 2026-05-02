import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { to: '/dashboard',    label: 'Dashboard',    icon: '📊', group: 'Operación' },
  { to: '/appointments', label: 'Atenciones',   icon: '✂️',  group: 'Operación' },
  { to: '/schedule',     label: 'Agenda',       icon: '📅', group: 'Operación' },
  { to: '/employees',    label: 'Empleados',    icon: '👥', group: 'Operación' },
  { to: '/clients',      label: 'Clientes',     icon: '👤', group: 'Operación' },
  { to: '/services',     label: 'Servicios',    icon: '💆', group: 'Operación' },
  { to: '/gastos',       label: 'Gastos',       icon: '💸', group: 'Finanzas' },
  { to: '/comisiones',   label: 'Comisiones',   icon: '💰', group: 'Finanzas' },
  { to: '/cierre',       label: 'Cierre del día', icon: '🔒', group: 'Finanzas' },
  { to: '/reports',      label: 'Reportes',     icon: '📈', group: 'Finanzas' },
];

const workerNav = [
  { to: '/dashboard',    label: 'Mi día',     icon: '🏠' },
  { to: '/appointments', label: 'Atenciones', icon: '✂️' },
  { to: '/schedule',     label: 'Mi agenda',  icon: '📅' },
  { to: '/clients',      label: 'Clientes',   icon: '👤' },
];

const avatarColors = ['#A8543B', '#5C7A4E', '#7E4E5C', '#4E5C7A', '#B89048'];
function avatarColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return avatarColors[Math.abs(h) % avatarColors.length];
}
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = isAdmin ? adminNav : workerNav;
  const displayName = user?.employee_name || user?.username || '';
  const roleLabel = isAdmin ? 'Administrador' : 'Empleado';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="spa-app">
      {/* Topbar */}
      <header className="spa-topbar">
        <div className="spa-brand">
          <span className="spa-brand-mark">S</span>
          <span>
            <span className="spa-brand-text">Spa Manager</span>
            <span className="spa-brand-sub">v1.0</span>
          </span>
        </div>
        <div className="spa-topbar-mid">
          <span className="muted">Sistema</span>
          <span className="spa-crumb-sep">/</span>
          <span className="spa-crumb-active">Gestión</span>
        </div>
        <div className="spa-topbar-actions">
          <div className="divider-v" style={{ margin: '0 8px' }} />
          <div className="spa-user-chip">
            <div
              className="spa-user-avatar"
              style={{ background: avatarColor(displayName) }}
            >
              {initials(displayName)}
            </div>
            <div>
              <div className="spa-user-chip-name">{displayName}</div>
              <div className="spa-user-chip-role">{roleLabel}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="spa-btn spa-btn-ghost spa-btn-sm"
            style={{ marginLeft: 4, color: 'var(--danger)' }}
            title="Cerrar sesión"
          >
            🚪
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="spa-sidebar">
        {isAdmin ? (
          ['Operación', 'Finanzas'].map(group => {
            const items = navItems.filter(i => i.group === group);
            return (
              <div key={group} className="spa-side-section">
                <div className="spa-side-label">{group}</div>
                {items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `spa-nav-item${isActive ? ' active' : ''}`}
                  >
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            );
          })
        ) : (
          <div className="spa-side-section">
            <div className="spa-side-label">Operación</div>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `spa-nav-item${isActive ? ' active' : ''}`}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        <div className="spa-side-footer">
          <div className="spa-side-footer-row">
            <span className="lbl">Usuario</span>
            <span style={{ fontWeight: 500, color: 'var(--ink-2)' }}>{user?.username}</span>
          </div>
          <div className="spa-side-footer-row">
            <span className="lbl">Rol</span>
            <span>{roleLabel}</span>
          </div>
          <div className="spa-side-footer-row" style={{ marginTop: 6 }}>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--danger)', fontSize: 11, cursor: 'pointer' }}
            >
              Cerrar sesión →
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="spa-main">
        <Outlet />
      </main>

      {/* Status bar */}
      <footer className="spa-statusbar">
        <span className="spa-statusbar-item">
          <span className="led" />
          Sistema en línea
        </span>
        <span className="spa-statusbar-item">
          {isAdmin ? 'Admin' : 'Empleado'} · {displayName}
        </span>
        <span className="spa-statusbar-spacer" />
        <span className="spa-statusbar-item">v1.0.0 · Spa Manager</span>
      </footer>
    </div>
  );
}
