import { useState, useEffect } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';
import { exportCsv } from '../utils/exportCsv';

const CATEGORIES = ['general', 'insumos', 'servicios', 'alquiler', 'sueldos', 'otro'];
const CAT_LABEL  = { general: 'General', insumos: 'Insumos', servicios: 'Servicios', alquiler: 'Alquiler', sueldos: 'Sueldos', otro: 'Otro' };

function fechaCorta(iso) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

const makeEmpty = () => ({
  amount: '',
  description: '',
  category: 'general',
  date: new Date().toISOString().slice(0, 10),
});

export default function Gastos() {
  const [expenses, setExpenses]     = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(makeEmpty());
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => { load(); }, [filterDate]);

  async function load() {
    setLoading(true);
    const params = {};
    if (filterDate) params.date = filterDate;
    setExpenses(await api.getExpenses(params));
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(makeEmpty());
    setError('');
    setModal(true);
  }

  function openEdit(exp) {
    setEditing(exp.id);
    setForm({
      amount:      exp.amount,
      description: exp.description,
      category:    exp.category || 'general',
      date:        exp.date ? exp.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setError('');
    setModal(true);
  }

  async function save() {
    if (!form.amount || !form.description) {
      setError('Monto y descripción son obligatorios');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.updateExpense(editing, form);
      } else {
        await api.createExpense(form);
      }
      setModal(false);
      load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este gasto?')) return;
    await api.deleteExpense(id);
    load();
  }

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  const porCategoria = CATEGORIES.map(cat => ({
    key: cat,
    label: CAT_LABEL[cat],
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + parseFloat(e.amount), 0),
    count: expenses.filter(e => e.category === cat).length,
  })).filter(c => c.count > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">
            Gastos
            <span className="count">{expenses.length}</span>
          </h1>
          <span className="spa-page-sub">
            {filterDate ? `Fecha: ${filterDate}` : 'Todos los gastos registrados'}
          </span>
        </div>
        <div className="spa-page-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="date" className="spa-input"
              style={{ width: 150, padding: '4px 8px' }}
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button className="spa-btn spa-btn-sm" onClick={() => setFilterDate('')}>✕</button>
            )}
          </div>
          {expenses.length > 0 && (
            <button className="spa-btn" onClick={() => exportCsv(
              `gastos${filterDate ? '-' + filterDate : ''}.csv`,
              ['Fecha', 'Descripción', 'Categoría', 'Monto (S/)'],
              expenses.map(e => [
                e.date ? e.date.slice(0, 10) : '',
                e.description,
                e.category,
                parseFloat(e.amount).toFixed(2),
              ])
            )}>⬇ Exportar CSV</button>
          )}
          <button className="spa-btn spa-btn-primary" onClick={openCreate}>
            + Registrar gasto
          </button>
        </div>
      </div>

      {/* KPI + breakdown */}
      <div className="spa-kpi-grid">
        <div className="spa-stat">
          <div className="spa-stat-label">Total gastos</div>
          <div className="spa-stat-value" style={{ color: 'var(--danger)' }}>S/ {total.toFixed(2)}</div>
          <div className="spa-stat-foot">{expenses.length} registros</div>
        </div>
        {porCategoria.slice(0, 3).map(c => (
          <div key={c.key} className="spa-stat">
            <div className="spa-stat-label">{c.label}</div>
            <div className="spa-stat-value">S/ {c.total.toFixed(2)}</div>
            <div className="spa-stat-foot">{c.count} gastos</div>
          </div>
        ))}
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
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th className="num">Monto</th>
                    <th style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td className="muted tabular">{fechaCorta(e.date)}</td>
                      <td style={{ fontWeight: 500 }}>{e.description}</td>
                      <td>
                        <span className="spa-pill spa-pill-neutral">
                          {CAT_LABEL[e.category] || e.category}
                        </span>
                      </td>
                      <td className="num bold" style={{ color: 'var(--danger)' }}>
                        S/ {parseFloat(e.amount).toFixed(2)}
                      </td>
                      <td style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="spa-btn spa-btn-sm"
                          onClick={() => openEdit(e)}
                        >
                          Editar
                        </button>
                        <button
                          className="spa-btn spa-btn-danger-outline spa-btn-sm"
                          onClick={() => remove(e.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="spa-empty">
                          <div className="spa-empty-title">Sin gastos registrados</div>
                          {filterDate ? 'No hay gastos para esta fecha.' : 'Registra el primer gasto.'}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {expenses.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={3}>{expenses.length} gastos</td>
                      <td className="num">S/ {total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar gasto' : 'Registrar gasto'}>
        <div className="col">
          {error && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div className="spa-field-row">
            <div className="spa-field" style={{ marginBottom: 0 }}>
              <label className="spa-label">Monto (S/) *</label>
              <input
                className="spa-input" type="number" min="0.01" step="0.5"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                autoFocus
              />
            </div>
            <div className="spa-field" style={{ marginBottom: 0 }}>
              <label className="spa-label">Fecha</label>
              <input
                className="spa-input" type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="spa-field">
            <label className="spa-label">Descripción *</label>
            <input
              className="spa-input"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Ej: Compra de insumos, pago de alquiler..."
            />
          </div>

          <div className="spa-field">
            <label className="spa-label">Categoría</label>
            <select
              className="spa-select"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CAT_LABEL[c]}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button
              className="spa-btn spa-btn-primary spa-btn-full"
              onClick={save}
              disabled={saving || !form.amount || !form.description}
            >
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Registrar gasto'}
            </button>
            <button className="spa-btn spa-btn-full" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
