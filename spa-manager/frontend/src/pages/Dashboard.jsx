import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const payLabel = { cash: 'Efectivo', yape: 'Yape', card: 'Tarjeta' };
const payPill  = { cash: 'spa-pill-success', yape: 'spa-pill-terra', card: 'spa-pill-info' };

const PERIODS = [
  { key: 'day',    label: 'Hoy' },
  { key: 'week',   label: 'Semana' },
  { key: 'month',  label: 'Mes' },
  { key: 'custom', label: 'Personalizado' },
];

function KPI({ label, value, foot }) {
  return (
    <div className="spa-stat">
      <div className="spa-stat-label">{label}</div>
      <div className="spa-stat-value">{value}</div>
      {foot && <div className="spa-stat-foot">{foot}</div>}
    </div>
  );
}

// ─── Vista ADMIN ──────────────────────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod]     = useState('day');
  const [from, setFrom]         = useState('');
  const [to, setTo]             = useState('');
  const [summary, setSummary]   = useState(null);
  const [employees, setEmployees] = useState([]);
  const [dailyIncome, setDailyIncome] = useState([]);
  const [todayAppts, setTodayAppts]   = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const isCustom = period === 'custom' && from && to;

    try {
      const summaryParams = isCustom ? { from, to } : { period };
      const incomeParams  = isCustom ? { from, to } : {};

      const [sum, emps, daily, appts] = await Promise.all([
        api.getSummary(summaryParams),
        api.getReportEmployees(isCustom ? { from, to } : { period }),
        api.getDailyIncome(incomeParams),
        api.getAppointments({ date: today }),
      ]);
      setSummary(sum);
      setEmployees(emps.slice(0, 5));
      setDailyIncome(daily.map(d => ({
        day:   new Date(d.day).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }),
        total: parseFloat(d.total),
      })));
      setTodayAppts(appts);
    } finally { setLoading(false); }
  }, [period, from, to]);

  useEffect(() => {
    if (period !== 'custom' || (from && to)) load();
  }, [load]);

  const periodLabel = PERIODS.find(p => p.key === period)?.label || '';
  const mainValue   = period === 'custom' && summary?.custom != null
    ? `S/ ${parseFloat(summary.custom).toFixed(2)}`
    : period === 'day'   ? `S/ ${parseFloat(summary?.today || 0).toFixed(2)}`
    : period === 'week'  ? `S/ ${parseFloat(summary?.week  || 0).toFixed(2)}`
    : `S/ ${parseFloat(summary?.month || 0).toFixed(2)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">Dashboard</h1>
          <span className="spa-page-sub">
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="spa-page-actions">
          <div className="spa-segmented">
            {PERIODS.map(p => (
              <button key={p.key} className={period===p.key?'on':''} onClick={() => setPeriod(p.key)}>{p.label}</button>
            ))}
          </div>
          {period === 'custom' && (
            <>
              <input type="date" className="spa-input" style={{ width: 140, padding: '4px 8px' }} value={from} onChange={e => setFrom(e.target.value)} />
              <span className="muted">→</span>
              <input type="date" className="spa-input" style={{ width: 140, padding: '4px 8px' }} value={to} onChange={e => setTo(e.target.value)} />
            </>
          )}
          <button className="spa-btn spa-btn-primary" onClick={() => navigate('/appointments')}>
            + Registrar atención
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spa-empty"><div className="spa-empty-title">Cargando...</div></div>
      ) : (
        <div style={{ padding: '14px 18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="spa-kpi-grid" style={{ padding: 0 }}>
            <KPI label={`Ingresos — ${periodLabel}`} value={mainValue} />
            <KPI label="Ingresos mes" value={`S/ ${parseFloat(summary?.month || 0).toFixed(2)}`} />
            <KPI label="Atenciones hoy" value={summary?.appointments_today || 0} />
            <KPI label="Empleados" value={employees.length} />
          </div>

          <div className="spa-two-col">
            <div className="spa-panel">
              <div className="spa-panel-header">
                <span className="spa-panel-title">Ingresos diarios</span>
              </div>
              <div className="spa-panel-body">
                {dailyIncome.length === 0 ? (
                  <div className="spa-empty"><div className="spa-empty-title">Sin datos</div></div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailyIncome} margin={{ top: 4, right: 4, left: -10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                      <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--ink-3)' }} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--ink-3)' }} />
                      <Tooltip
                        contentStyle={{ background: 'var(--bone)', border: '1px solid var(--line)', borderRadius: 5, fontSize: 12 }}
                        formatter={(v) => [`S/ ${v.toFixed(2)}`, 'Total']}
                      />
                      <Bar dataKey="total" fill="var(--terra)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="spa-panel">
              <div className="spa-panel-header">
                <span className="spa-panel-title">Ranking — {periodLabel}</span>
              </div>
              <div className="spa-panel-body" style={{ padding: '6px 4px' }}>
                {employees.length === 0 && <div className="spa-empty"><div className="spa-empty-title">Sin datos</div></div>}
                {employees.map((emp, i) => (
                  <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px' }}>
                    <span className="tabular muted tiny" style={{ width: 16 }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name}</span>
                        <span className="tabular bold" style={{ color: 'var(--terra)', marginLeft: 8, flexShrink: 0 }}>
                          S/ {parseFloat(emp.total_revenue).toFixed(2)}
                        </span>
                      </div>
                      <div className="tiny muted">{emp.appointments_count} atenciones</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="spa-panel">
            <div className="spa-panel-header">
              <span className="spa-panel-title">Atenciones de hoy <span className="muted" style={{ fontWeight: 400 }}>({todayAppts.length})</span></span>
            </div>
            {todayAppts.length === 0 ? (
              <div className="spa-empty"><div className="spa-empty-title">No hay atenciones hoy</div></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="spa-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Cliente</th>
                      <th>Empleado</th>
                      <th>Servicio</th>
                      <th>Pago</th>
                      <th className="num">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppts.map(a => (
                      <tr key={a.id}>
                        <td className="muted tiny">
                          {new Date(a.date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ fontWeight: 500 }}>{a.client_name}</td>
                        <td className="muted">{a.employee_name}</td>
                        <td className="muted">{a.service_name}</td>
                        <td><span className={`spa-pill ${payPill[a.payment_method]}`}>{payLabel[a.payment_method]}</span></td>
                        <td className="num bold" style={{ color: 'var(--terra)' }}>
                          S/ {parseFloat(a.final_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Vista WORKER ─────────────────────────────────────────────────────────────

function WorkerDashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [summary, setSummary]   = useState(null);
  const [todayAppts, setTodayAppts] = useState([]);
  const [upcoming, setUpcoming]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const from  = new Date().toISOString();
    const to    = new Date(Date.now() + 7 * 86400000).toISOString();
    Promise.all([
      api.getMySummary(),
      api.getAppointments({ date: today }),
      api.getSchedule({ from, to }),
    ]).then(([sum, appts, sched]) => {
      setSummary(sum);
      setTodayAppts(appts);
      setUpcoming(sched.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spa-empty" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spa-empty-title">Cargando...</div></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">
            Hola, {user?.employee_name?.split(' ')[0] || user?.username}
          </h1>
          <span className="spa-page-sub">
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <div className="spa-page-actions">
          <button className="spa-btn spa-btn-primary" onClick={() => navigate('/appointments')}>
            + Registrar atención
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="spa-kpi-grid" style={{ padding: 0 }}>
          <KPI label="Mis ingresos hoy" value={`S/ ${parseFloat(summary?.today || 0).toFixed(2)}`} />
          <KPI label="Esta semana" value={`S/ ${parseFloat(summary?.week || 0).toFixed(2)}`} />
          <KPI label="Atenciones hoy" value={summary?.appointments_today || 0} />
          <KPI label="Mi comisión hoy" value={`S/ ${parseFloat(summary?.commission_today || 0).toFixed(2)}`} foot="según tu porcentaje" />
        </div>

        <div className="spa-two-col">
          <div className="spa-panel">
            <div className="spa-panel-header">
              <span className="spa-panel-title">Mis atenciones de hoy <span className="muted" style={{ fontWeight: 400 }}>({todayAppts.length})</span></span>
            </div>
            <div className="spa-panel-body" style={{ padding: 0 }}>
              {todayAppts.length === 0 ? (
                <div className="spa-empty"><div className="spa-empty-title">Sin atenciones hoy</div></div>
              ) : (
                todayAppts.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line-soft)' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{a.client_name}</div>
                      <div className="tiny muted">
                        {a.service_name} · {new Date(a.date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className="tabular bold" style={{ color: 'var(--terra)', fontSize: 13 }}>
                      S/ {parseFloat(a.final_price).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="spa-panel">
            <div className="spa-panel-header">
              <span className="spa-panel-title">Próximas citas (7 días)</span>
            </div>
            <div className="spa-panel-body" style={{ padding: 0 }}>
              {upcoming.length === 0 ? (
                <div className="spa-empty"><div className="spa-empty-title">Sin citas programadas</div></div>
              ) : (
                upcoming.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--line-soft)' }}>
                    <div style={{ textAlign: 'center', width: 36, flexShrink: 0 }}>
                      <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--terra)', lineHeight: 1 }}>
                        {new Date(item.scheduled_date).getDate()}
                      </div>
                      <div className="tiny muted">
                        {new Date(item.scheduled_date).toLocaleDateString('es-PE', { month: 'short' })}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.client_name}</div>
                      <div className="tiny muted">
                        {item.service_name} · {new Date(item.scheduled_date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <WorkerDashboard />;
}
