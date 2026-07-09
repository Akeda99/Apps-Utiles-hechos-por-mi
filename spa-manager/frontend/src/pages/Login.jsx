import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.login(form);
      login(user, token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--bone)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 360, overflow: 'hidden' }}>
        <div style={{ background: 'var(--terra)', padding: '28px 32px', textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'grid', placeItems: 'center', margin: '0 auto 12px', color: 'var(--cream)' }}><Sparkles size={20} /></div>
          <h1 style={{ margin: 0, color: 'var(--cream)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Spa Manager</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Sistema de gestión</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(176,70,58,0.3)', color: 'var(--danger)', fontSize: 13, padding: '8px 12px', borderRadius: 'var(--radius)' }}>
              {error}
            </div>
          )}

          <div className="spa-field" style={{ marginBottom: 0 }}>
            <label className="spa-label">Usuario</label>
            <input
              className="spa-input"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Tu usuario"
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="spa-field" style={{ marginBottom: 0 }}>
            <label className="spa-label">Contraseña</label>
            <input
              className="spa-input"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="spa-btn spa-btn-primary spa-btn-full"
            style={{ marginTop: 4 }}
            disabled={loading || !form.username || !form.password}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
