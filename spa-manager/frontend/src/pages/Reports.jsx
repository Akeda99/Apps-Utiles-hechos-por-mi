import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { api } from '../api';

const COLORS = ['#A8543B','#5C7A4E','#7E4E5C','#4E5C7A','#B89048','#C97A5F','#DCE5D2','#F0DDD2'];

const PERIODS = [
  { key: 'day',   label: 'Hoy' },
  { key: 'week',  label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'all',   label: 'Todo' },
];

export default function Reports() {
  const [period, setPeriod]       = useState('month');
  const [employees, setEmployees] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { load(); }, [period]);

  async function load() {
    setLoading(true);
    const [emps, svcs] = await Promise.all([
      api.getReportEmployees(period),
      api.getTopServices(),
    ]);
    setEmployees(emps);
    setTopServices(svcs.filter(s => parseInt(s.count) > 0));
    setLoading(false);
  }

  const totalRevenue    = employees.reduce((s, e) => s + parseFloat(e.total_revenue), 0);
  const totalAppts      = employees.reduce((s, e) => s + parseInt(e.appointments_count), 0);
  const totalCommission = employees.reduce((s, e) => s + parseFloat(e.commission_earned), 0);

  const currentPeriodLabel = PERIODS.find(p => p.key === period)?.label || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">Reportes</h1>
          <span className="spa-page-sub">{currentPeriodLabel}</span>
        </div>
        <div className="spa-page-actions">
          <div className="spa-segmented">
            {PERIODS.map(p => (
              <button key={p.key} className={period===p.key?'on':''} onClick={() => setPeriod(p.key)}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spa-empty"><div className="spa-empty-title">Cargando...</div></div>
      ) : (
        <div style={{ padding: '14px 18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div className="spa-stat">
              <div className="spa-stat-label">Ingresos totales</div>
              <div className="spa-stat-value">S/ {totalRevenue.toFixed(2)}</div>
              <div className="spa-stat-foot">{currentPeriodLabel}</div>
            </div>
            <div className="spa-stat">
              <div className="spa-stat-label">Atenciones</div>
              <div className="spa-stat-value">{totalAppts}</div>
              <div className="spa-stat-foot">{currentPeriodLabel}</div>
            </div>
            <div className="spa-stat">
              <div className="spa-stat-label">Comisiones</div>
              <div className="spa-stat-value">S/ {totalCommission.toFixed(2)}</div>
              <div className="spa-stat-foot">{currentPeriodLabel}</div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="spa-panel">
            <div className="spa-panel-header">
              <span className="spa-panel-title">Ingresos por empleado — {currentPeriodLabel}</span>
            </div>
            <div className="spa-panel-body">
              {employees.length === 0 ? (
                <div className="spa-empty"><div className="spa-empty-title">Sin datos para este período</div></div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={employees} margin={{ top: 4, right: 4, left: -10, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-3)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--ink-3)' }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bone)', border: '1px solid var(--line)', borderRadius: 5, fontSize: 12 }}
                      formatter={(v) => `S/ ${parseFloat(v).toFixed(2)}`}
                    />
                    <Bar dataKey="total_revenue"    name="Ingresos"  fill="var(--terra)" radius={[3,3,0,0]} />
                    <Bar dataKey="commission_earned" name="Comisión"  fill="var(--olive)" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Employee detail table */}
          <div className="spa-panel">
            <div className="spa-panel-header">
              <span className="spa-panel-title">Detalle por empleado</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="spa-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Empleado</th>
                    <th>Especialidad</th>
                    <th className="num">Atenciones</th>
                    <th className="num">Ingresos</th>
                    <th className="num">Comisión</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={emp.id}>
                      <td className="id-col">#{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{emp.name}</td>
                      <td className="muted">{emp.specialty || '—'}</td>
                      <td className="num">{emp.appointments_count}</td>
                      <td className="num bold" style={{ color: 'var(--terra)' }}>
                        S/ {parseFloat(emp.total_revenue).toFixed(2)}
                      </td>
                      <td className="num" style={{ color: 'var(--olive)' }}>
                        S/ {parseFloat(emp.commission_earned).toFixed(2)}
                        <span className="muted tiny" style={{ marginLeft: 4 }}>({emp.commission_percentage}%)</span>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr><td colSpan={6}><div className="spa-empty"><div className="spa-empty-title">Sin datos</div></div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Services */}
          {topServices.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="spa-panel">
                <div className="spa-panel-header"><span className="spa-panel-title">Servicios más vendidos</span></div>
                <div className="spa-panel-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={topServices} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {topServices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'var(--bone)', border: '1px solid var(--line)', borderRadius: 5, fontSize: 12 }}
                        formatter={(v, name) => [v + ' atenciones', name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="spa-panel">
                <div className="spa-panel-header"><span className="spa-panel-title">Detalle servicios</span></div>
                <div className="spa-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {topServices.map((svc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc.name}</span>
                          <span className="muted tiny" style={{ marginLeft: 8, flexShrink: 0 }}>{svc.count}×</span>
                        </div>
                        <div className="tiny" style={{ color: 'var(--terra)', fontFamily: 'JetBrains Mono, monospace' }}>
                          S/ {parseFloat(svc.total || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
