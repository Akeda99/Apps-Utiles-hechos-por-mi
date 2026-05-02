import { useState, useEffect } from 'react';
import { api } from '../api';
import { exportCsv } from '../utils/exportCsv';

const payLabel = { cash: 'Efectivo', yape: 'Yape', card: 'Tarjeta' };

function fechaCorta(iso) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
function horaCorta(iso) {
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function CierreDia() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate]       = useState(today);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [date]);

  async function load() {
    setLoading(true);
    setData(await api.getDayClosing(date));
    setLoading(false);
  }

  function handlePrint() {
    window.print();
  }

  function handleExport() {
    const { appointments = [], expenses = [], income = {}, expenses_total = 0, net_cash = 0 } = data || {};
    exportCsv(`cierre-${date}.csv`, ['Tipo', 'Hora', 'Descripción', 'Empleada', 'Pago', 'Monto (S/)'], [
      ...appointments.map(a => [
        'Atención',
        new Date(a.date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        `${a.client_name} — ${a.service_name}`,
        a.employee_name || '',
        { cash: 'Efectivo', yape: 'Yape', card: 'Tarjeta' }[a.payment_method] || a.payment_method,
        parseFloat(a.final_price).toFixed(2),
      ]),
      ...expenses.map(e => ['Gasto', '', e.description, '', e.category, `-${parseFloat(e.amount).toFixed(2)}`]),
      [],
      ['', '', 'TOTAL INGRESOS', '', '', parseFloat(income.total || 0).toFixed(2)],
      ['', '', 'TOTAL GASTOS',   '', '', `-${parseFloat(expenses_total).toFixed(2)}`],
      ['', '', 'CAJA NETA',      '', '', parseFloat(net_cash).toFixed(2)],
    ]);
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-empty" style={{ margin: 'auto' }}>
        <div className="spa-empty-title">Cargando cierre del día...</div>
      </div>
    </div>
  );

  const { appointments = [], expenses = [], income = {}, expenses_total = 0, net_cash = 0 } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="spa-page-header no-print">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">Cierre del día</h1>
          <span className="spa-page-sub" style={{ textTransform: 'capitalize' }}>{fmtDate(date)}</span>
        </div>
        <div className="spa-page-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="spa-btn spa-btn-sm" onClick={() => {
              const d = new Date(date + 'T12:00:00');
              d.setDate(d.getDate() - 1);
              setDate(d.toISOString().slice(0, 10));
            }}>‹ Anterior</button>
            <input
              type="date" className="spa-input"
              style={{ width: 150, padding: '4px 8px' }}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <button className="spa-btn spa-btn-sm" disabled={date >= today} onClick={() => {
              const d = new Date(date + 'T12:00:00');
              d.setDate(d.getDate() + 1);
              setDate(d.toISOString().slice(0, 10));
            }}>Siguiente ›</button>
          </div>
          <button className="spa-btn" onClick={handleExport}>
            ⬇ Exportar CSV
          </button>
          <button className="spa-btn spa-btn-primary" onClick={handlePrint}>
            🖨 Imprimir / PDF
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 18px' }}>

        {/* Print header (only visible when printing) */}
        <div className="print-only" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Cierre del día</h2>
          <p style={{ margin: '4px 0 0', color: '#555', textTransform: 'capitalize' }}>{fmtDate(date)}</p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16, marginTop: 14 }}>
          <div className="spa-stat">
            <div className="spa-stat-label">Efectivo</div>
            <div className="spa-stat-value">S/ {parseFloat(income.cash || 0).toFixed(2)}</div>
            <div className="spa-stat-foot">{appointments.filter(a => a.payment_method === 'cash').length} atenciones</div>
          </div>
          <div className="spa-stat">
            <div className="spa-stat-label">Yape</div>
            <div className="spa-stat-value">S/ {parseFloat(income.yape || 0).toFixed(2)}</div>
            <div className="spa-stat-foot">{appointments.filter(a => a.payment_method === 'yape').length} atenciones</div>
          </div>
          <div className="spa-stat">
            <div className="spa-stat-label">Tarjeta</div>
            <div className="spa-stat-value">S/ {parseFloat(income.card || 0).toFixed(2)}</div>
            <div className="spa-stat-foot">{appointments.filter(a => a.payment_method === 'card').length} atenciones</div>
          </div>
          <div className="spa-stat">
            <div className="spa-stat-label">Total ingresos</div>
            <div className="spa-stat-value" style={{ color: 'var(--olive)' }}>
              S/ {parseFloat(income.total || 0).toFixed(2)}
            </div>
            <div className="spa-stat-foot">{appointments.length} atenciones</div>
          </div>
        </div>

        {/* Net cash banner */}
        <div style={{
          background: net_cash >= 0 ? 'var(--olive-bg, #f0f4ec)' : 'var(--danger-bg)',
          border: `1px solid ${net_cash >= 0 ? 'var(--olive)' : 'var(--danger)'}`,
          borderRadius: 'var(--radius)',
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>CAJA NETA (Efectivo − Gastos)</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              S/ {parseFloat(net_cash).toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12 }}>
            <div>Ingresos efectivo: <strong>S/ {parseFloat(income.cash || 0).toFixed(2)}</strong></div>
            <div>Gastos: <strong style={{ color: 'var(--danger)' }}>− S/ {parseFloat(expenses_total).toFixed(2)}</strong></div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
          {/* Appointments */}
          <div className="spa-panel">
            <div className="spa-panel-header" style={{ padding: '8px 12px' }}>
              <span className="spa-panel-title" style={{ fontSize: 12 }}>
                Atenciones del día <span className="muted" style={{ fontWeight: 400 }}>· {appointments.length}</span>
              </span>
            </div>
            {appointments.length === 0 ? (
              <div className="spa-empty">
                <div className="spa-empty-title">Sin atenciones</div>
              </div>
            ) : (
              <table className="spa-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>Empleada</th>
                    <th>Servicio</th>
                    <th>Pago</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td className="muted tabular">{horaCorta(a.date)}</td>
                      <td style={{ fontWeight: 500 }}>{a.client_name || '—'}</td>
                      <td className="muted">{a.employee_name || '—'}</td>
                      <td className="muted" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.service_name || '—'}
                      </td>
                      <td className="tiny muted">{payLabel[a.payment_method] || a.payment_method}</td>
                      <td className="num tabular bold">S/ {parseFloat(a.final_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5}>{appointments.length} atenciones</td>
                    <td className="num">S/ {parseFloat(income.total || 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Expenses */}
          <div className="spa-panel">
            <div className="spa-panel-header" style={{ padding: '8px 12px' }}>
              <span className="spa-panel-title" style={{ fontSize: 12 }}>
                Gastos del día <span className="muted" style={{ fontWeight: 400 }}>· {expenses.length}</span>
              </span>
            </div>
            {expenses.length === 0 ? (
              <div className="spa-empty">
                <div className="spa-empty-title">Sin gastos</div>
              </div>
            ) : (
              <table className="spa-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th className="num">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{e.description}</div>
                        <div className="muted tiny">{e.category}</div>
                      </td>
                      <td className="num tabular" style={{ color: 'var(--danger)' }}>
                        S/ {parseFloat(e.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>{expenses.length} gastos</td>
                    <td className="num" style={{ color: 'var(--danger)' }}>S/ {parseFloat(expenses_total).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>

        {/* Print footer */}
        <div className="print-only" style={{ marginTop: 20, borderTop: '1px solid #ccc', paddingTop: 10, fontSize: 12, color: '#777' }}>
          Impreso el {new Date().toLocaleDateString('es-PE')} a las {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
        }
        .print-only { display: none; }
      `}</style>
    </div>
  );
}
