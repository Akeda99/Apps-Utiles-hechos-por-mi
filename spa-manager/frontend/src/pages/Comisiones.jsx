import { useState, useEffect } from 'react';
import { api } from '../api';
import { exportCsv } from '../utils/exportCsv';

const PERIODS = [
  { key: 'day',   label: 'Hoy' },
  { key: 'week',  label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'all',   label: 'Todo' },
];

export default function Comisiones() {
  const [data, setData]         = useState([]);
  const [period, setPeriod]     = useState('month');
  const [from, setFrom]         = useState('');
  const [to, setTo]             = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => { load(); }, [period, from, to]);

  async function load() {
    setLoading(true);
    const params = {};
    if (from && to) { params.from = from; params.to = to; }
    else params.period = period;
    setData(await api.getCommissions(params));
    setLoading(false);
  }

  function handleExport() {
    exportCsv(
      `comisiones-${rangeLabel.replace(/[^a-zA-Z0-9]/g, '_')}.csv`,
      ['Empleada', 'Especialidad', 'Atenciones', 'Ingresos (S/)', '% Comisión', 'Comisión (S/)'],
      data.map(e => [
        e.name,
        e.specialty || '',
        e.appointments_count,
        parseFloat(e.total_revenue).toFixed(2),
        e.commission_percentage,
        parseFloat(e.commission_earned).toFixed(2),
      ])
    );
  }

  const totalRevenue    = data.reduce((s, e) => s + parseFloat(e.total_revenue), 0);
  const totalComm       = data.reduce((s, e) => s + parseFloat(e.commission_earned), 0);
  const totalAppts      = data.reduce((s, e) => s + parseInt(e.appointments_count), 0);

  const rangeLabel = from && to
    ? `${from} → ${to}`
    : PERIODS.find(p => p.key === period)?.label || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">
            Comisiones
            <span className="count">{data.length}</span>
          </h1>
          <span className="spa-page-sub">{rangeLabel}</span>
        </div>
        <div className="spa-page-actions">
          {data.length > 0 && (
            <button className="spa-btn" onClick={handleExport}>⬇ Exportar CSV</button>
          )}
          {!from && (
            <div className="spa-segmented">
              {PERIODS.map(({ key, label }) => (
                <button key={key} className={period === key ? 'on' : ''} onClick={() => { setPeriod(key); setFrom(''); setTo(''); }}>
                  {label}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="date" className="spa-input" style={{ width: 140, padding: '4px 8px' }}
              value={from} onChange={e => setFrom(e.target.value)} placeholder="Desde" />
            <span className="muted tiny">—</span>
            <input type="date" className="spa-input" style={{ width: 140, padding: '4px 8px' }}
              value={to} onChange={e => setTo(e.target.value)} placeholder="Hasta" />
            {(from || to) && (
              <button className="spa-btn spa-btn-sm" onClick={() => { setFrom(''); setTo(''); }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="spa-kpi-grid-3">
        <div className="spa-stat">
          <div className="spa-stat-label">Ingresos totales</div>
          <div className="spa-stat-value">S/ {totalRevenue.toFixed(2)}</div>
          <div className="spa-stat-foot">{totalAppts} atenciones</div>
        </div>
        <div className="spa-stat">
          <div className="spa-stat-label">Comisiones totales</div>
          <div className="spa-stat-value" style={{ color: 'var(--terra)' }}>S/ {totalComm.toFixed(2)}</div>
          <div className="spa-stat-foot">
            {totalRevenue > 0 ? ((totalComm / totalRevenue) * 100).toFixed(1) : 0}% del ingreso
          </div>
        </div>
        <div className="spa-stat">
          <div className="spa-stat-label">Empleados activos</div>
          <div className="spa-stat-value">{data.filter(e => parseInt(e.appointments_count) > 0).length}</div>
          <div className="spa-stat-foot">de {data.length} en total</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '12px 18px 18px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="spa-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          {loading ? (
            <div className="spa-empty"><div className="spa-empty-title">Cargando...</div></div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="spa-table">
                <thead>
                  <tr>
                    <th>Empleada</th>
                    <th>Especialidad</th>
                    <th className="num">Atenciones</th>
                    <th className="num">Ingresos</th>
                    <th className="num">% Comisión</th>
                    <th className="num">Comisión</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(e => {
                    const revenue = parseFloat(e.total_revenue);
                    const comm    = parseFloat(e.commission_earned);
                    const pct     = parseFloat(e.commission_percentage);
                    const active  = parseInt(e.appointments_count) > 0;
                    return (
                      <tr key={e.id} style={{ opacity: active ? 1 : 0.5 }}>
                        <td style={{ fontWeight: 500 }}>{e.name}</td>
                        <td className="muted">{e.specialty || '—'}</td>
                        <td className="num tabular">{e.appointments_count}</td>
                        <td className="num tabular">S/ {revenue.toFixed(2)}</td>
                        <td className="num">
                          <span className="spa-pill spa-pill-neutral" style={{ fontFamily: 'var(--font-mono)' }}>
                            {pct}%
                          </span>
                        </td>
                        <td className="num bold tabular" style={{ color: active ? 'var(--terra)' : undefined }}>
                          S/ {comm.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className="spa-empty">
                          <div className="spa-empty-title">Sin datos para este período</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {data.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={2}>Total</td>
                      <td className="num">{totalAppts}</td>
                      <td className="num">S/ {totalRevenue.toFixed(2)}</td>
                      <td></td>
                      <td className="num">S/ {totalComm.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
