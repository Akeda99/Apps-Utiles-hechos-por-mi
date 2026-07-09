import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Autocomplete from '../components/Autocomplete';

const payLabel = { cash: 'Efectivo', yape: 'Yape', card: 'Tarjeta' };
const payPill   = { cash: 'spa-pill-success', yape: 'spa-pill-terra', card: 'spa-pill-info' };

function fechaCorta(iso) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
function horaCorta(iso) {
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export default function Appointments() {
  const { user, isAdmin } = useAuth();

  const makeEmptyForm = () => ({
    employee_id:    isAdmin ? '' : (user?.employee_id || ''),
    client_id:      '',
    services:       [],
    final_price:    '',
    payment_method: 'cash',
    date:           new Date().toISOString().slice(0, 16),
    notes:          '',
  });

  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees]       = useState([]);
  const [clients, setClients]           = useState([]);
  const [servicesCatalog, setServicesCatalog] = useState([]);
  const [modal, setModal]               = useState(false);
  const [editing, setEditing]           = useState(null);
  const [form, setForm]                 = useState(makeEmptyForm);
  const [svcQuery, setSvcQuery]         = useState('');
  const [range, setRange]               = useState('hoy');
  const [filterDate, setFilterDate]     = useState('');
  const [showDateTime, setShowDateTime] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');
  const priceOverridden = useRef(false);

  useEffect(() => {
    Promise.all([api.getEmployees(), api.getClients(), api.getServices()])
      .then(([e, c, s]) => { setEmployees(e); setClients(c); setServicesCatalog(s); });
    load();
  }, []);

  useEffect(() => { load(); }, [filterDate]);

  async function load() {
    setLoading(true);
    const params = {};
    if (filterDate) params.date = filterDate;
    setAppointments(await api.getAppointments(params));
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(makeEmptyForm());
    setSvcQuery('');
    setShowDateTime(false);
    priceOverridden.current = false;
    setError('');
    setModal(true);
  }

  function openEdit(a) {
    setEditing(a.id);
    const svcs = Array.isArray(a.services)
      ? a.services.map(s => ({ id: s.id, name: s.name, price: parseFloat(s.price) }))
      : [];
    setForm({
      employee_id:    a.employee_id || '',
      client_id:      a.client_id || '',
      services:       svcs,
      final_price:    parseFloat(a.final_price).toFixed(2),
      payment_method: a.payment_method || 'cash',
      date:           new Date(a.date).toISOString().slice(0, 16),
      notes:          a.notes || '',
    });
    setSvcQuery('');
    setShowDateTime(true);
    priceOverridden.current = true;
    setError('');
    setModal(true);
  }

  function addService(id) {
    const svc = servicesCatalog.find(s => String(s.id) === String(id));
    if (!svc) return;
    if (form.services.some(s => s.id === svc.id)) return;
    const updated = [...form.services, { id: svc.id, name: svc.name, price: parseFloat(svc.base_price) || 0 }];
    setSvcQuery('');
    const sum = updated.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);
    setForm(f => ({
      ...f,
      services: updated,
      final_price: priceOverridden.current ? f.final_price : sum.toFixed(2),
    }));
  }

  function removeService(idx) {
    const updated = form.services.filter((_, i) => i !== idx);
    const sum = updated.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);
    setForm(f => ({
      ...f,
      services: updated,
      final_price: priceOverridden.current ? f.final_price : sum.toFixed(2),
    }));
  }

  function updateSvcPrice(idx, val) {
    const updated = form.services.map((s, i) => i === idx ? { ...s, price: val } : s);
    const sum = updated.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);
    setForm(f => ({
      ...f,
      services: updated,
      final_price: priceOverridden.current ? f.final_price : sum.toFixed(2),
    }));
  }

  function handleFinalPriceChange(val) {
    const sum = form.services.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);
    priceOverridden.current = parseFloat(val).toFixed(2) !== sum.toFixed(2);
    setForm(f => ({ ...f, final_price: val }));
  }

  async function save() {
    if (!form.client_id || form.services.length === 0 ||
        (isAdmin && !form.employee_id)) {
      setError('Completa todos los campos obligatorios (empleado, cliente y al menos un servicio)');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        employee_id:    form.employee_id,
        client_id:      form.client_id,
        services:       form.services.map(s => ({ id: s.id, price: parseFloat(s.price) })),
        final_price:    form.final_price !== '' ? form.final_price : undefined,
        payment_method: form.payment_method,
        date:           form.date,
        notes:          form.notes,
      };
      if (editing) await api.updateAppointment(editing, payload);
      else         await api.createAppointment(payload);
      setModal(false);
      load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm('¿Eliminar esta atención?')) return;
    await api.deleteAppointment(id);
    load();
  }

  const rangeFiltered = filterDate ? appointments : appointments.filter(a => {
    const d = new Date(a.date);
    const now = new Date();
    if (range === 'hoy') return d.toDateString() === now.toDateString();
    if (range === 'semana') { const x = new Date(now); x.setDate(x.getDate() - 7); return d >= x; }
    if (range === 'mes') { const x = new Date(now); x.setDate(x.getDate() - 30); return d >= x; }
    return true;
  });

  const totalIngresos = rangeFiltered.reduce((s, a) => s + parseFloat(a.final_price), 0);
  const ticketProm = rangeFiltered.length ? totalIngresos / rangeFiltered.length : 0;

  const porMetodo = ['cash', 'yape', 'card'].map(m => ({
    key: m,
    label: payLabel[m],
    total: rangeFiltered.filter(a => a.payment_method === m).reduce((s, a) => s + parseFloat(a.final_price), 0),
    count: rangeFiltered.filter(a => a.payment_method === m).length,
  }));

  const rangeLabel = filterDate
    ? `Fecha: ${filterDate}`
    : range === 'hoy' ? 'Hoy'
    : range === 'semana' ? 'Últimos 7 días'
    : range === 'mes' ? 'Últimos 30 días'
    : 'Todo el historial';

  const availableServices = servicesCatalog.filter(s => !form.services.some(fs => fs.id === s.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page header */}
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">
            {isAdmin ? 'Atenciones' : 'Mis atenciones'}
            <span className="count">{rangeFiltered.length}</span>
          </h1>
          <span className="spa-page-sub">{rangeLabel}</span>
        </div>
        <div className="spa-page-actions">
          {!filterDate && (
            <div className="spa-segmented">
              {[['hoy','Hoy'],['semana','Semana'],['mes','Mes'],['todo','Todo']].map(([k,l]) => (
                <button key={k} className={range===k?'on':''} onClick={() => setRange(k)}>{l}</button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="date"
              className="spa-input"
              style={{ width: 150, padding: '4px 8px' }}
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button className="spa-btn spa-btn-sm" onClick={() => setFilterDate('')}><X size={14} /></button>
            )}
          </div>
          <button className="spa-btn spa-btn-primary" onClick={openCreate}>
            + Registrar atención
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="spa-kpi-grid">
        <div className="spa-stat">
          <div className="spa-stat-label">Ingresos</div>
          <div className="spa-stat-value">S/ {totalIngresos.toFixed(2)}</div>
          <div className="spa-stat-foot">Ticket prom. S/ {ticketProm.toFixed(2)}</div>
        </div>
        <div className="spa-stat">
          <div className="spa-stat-label">Atenciones</div>
          <div className="spa-stat-value">{rangeFiltered.length}</div>
          <div className="spa-stat-foot">{rangeLabel}</div>
        </div>
        {porMetodo.slice(0, 2).map(m => (
          <div key={m.key} className="spa-stat">
            <div className="spa-stat-label">{m.label}</div>
            <div className="spa-stat-value">S/ {m.total.toFixed(2)}</div>
            <div className="spa-stat-foot">{m.count} atenciones</div>
          </div>
        ))}
      </div>

      {/* Main content: table + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, padding: '12px 14px 18px', flex: 1, minHeight: 0 }} className="spa-appointments-layout">
        <div className="spa-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="spa-panel-header" style={{ padding: '8px 10px' }}>
            <span className="tiny muted">{rangeFiltered.length} de {appointments.length} registros</span>
          </div>
          {loading ? (
            <div className="spa-empty"><div className="spa-empty-title">Cargando...</div></div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="spa-table">
                <thead>
                  <tr>
                    <th>Fecha / Hora</th>
                    <th>Cliente</th>
                    {isAdmin && <th>Empleado</th>}
                    <th>Servicios</th>
                    <th>Método</th>
                    <th className="num">Total</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rangeFiltered.map(a => (
                    <tr key={a.id}>
                      <td>
                        <span style={{ fontWeight: 500 }}>{fechaCorta(a.date)}</span>
                        {' '}
                        <span className="muted tiny">{horaCorta(a.date)}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{a.client_name}</td>
                      {isAdmin && <td className="muted">{a.employee_name}</td>}
                      <td className="muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.service_name || '—'}
                      </td>
                      <td>
                        <span className={`spa-pill ${payPill[a.payment_method]}`}>
                          {payLabel[a.payment_method]}
                        </span>
                      </td>
                      <td className="num bold" style={{ color: 'var(--terra)' }}>
                        S/ {parseFloat(a.final_price).toFixed(2)}
                      </td>
                      <td style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="spa-btn spa-btn-sm"
                          onClick={() => openEdit(a)}
                        >
                          Editar
                        </button>
                        <button
                          className="spa-btn spa-btn-danger-outline spa-btn-sm"
                          onClick={() => remove(a.id)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rangeFiltered.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6}>
                        <div className="spa-empty">
                          <div className="spa-empty-title">Sin atenciones en este período</div>
                          Cambia el filtro o registra una nueva atención.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {rangeFiltered.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4}>{rangeFiltered.length} atenciones</td>
                      <td className="num">S/ {totalIngresos.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>

        {/* Right sidebar: payment breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="spa-panel">
            <div className="spa-panel-header" style={{ padding: '8px 12px' }}>
              <span className="spa-panel-title" style={{ fontSize: 12 }}>Por método de pago</span>
            </div>
            <div className="spa-panel-body" style={{ padding: '10px 12px' }}>
              {porMetodo.map(m => {
                const pct = totalIngresos > 0 ? (m.total / totalIngresos * 100) : 0;
                return (
                  <div key={m.key} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span>{m.label} <span className="tiny muted">· {m.count}</span></span>
                      <span className="tabular">S/ {m.total.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--paper)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`, height: '100%',
                        background: m.key === 'yape' ? 'var(--terra)' : m.key === 'card' ? 'var(--slate)' : 'var(--olive)',
                        transition: 'width 300ms'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar atención' : 'Registrar atención'}>
        <div className="col">
          {error && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: 13 }}>
              {error}
            </div>
          )}

          {isAdmin && (
            <div className="spa-field">
              <label className="spa-label">Empleado *</label>
              <Autocomplete
                options={employees}
                value={form.employee_id}
                onChange={(id) => setForm(f => ({ ...f, employee_id: id }))}
                getLabel={(e) => e.name}
                getSubLabel={(e) => e.specialty || 'General'}
                placeholder="Buscar empleado..."
              />
            </div>
          )}

          <div className="spa-field">
            <label className="spa-label">Cliente *</label>
            <Autocomplete
              options={clients}
              value={form.client_id}
              onChange={(id) => setForm(f => ({ ...f, client_id: id }))}
              getLabel={(c) => c.name}
              getSubLabel={(c) => c.phone || ''}
              placeholder="Buscar cliente..."
            />
          </div>

          {/* Multi-service picker */}
          <div className="spa-field">
            <label className="spa-label">Servicios * <span className="muted tiny">(uno o más)</span></label>

            {/* Added services list */}
            {form.services.length > 0 && (
              <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {form.services.map((s, i) => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--paper)', borderRadius: 'var(--radius)',
                    padding: '5px 8px', border: '1px solid var(--border)',
                  }}>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                    <span className="muted tiny">S/</span>
                    <input
                      type="number" min="0" step="0.5"
                      style={{
                        width: 70, padding: '2px 6px', fontSize: 13,
                        border: '1px solid var(--border)', borderRadius: 4,
                        background: 'var(--cream)', textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                      }}
                      value={s.price}
                      onChange={e => updateSvcPrice(i, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeService(i)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--danger)', fontWeight: 700, fontSize: 14, lineHeight: 1,
                        padding: '0 2px',
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Add service autocomplete */}
            <Autocomplete
              options={availableServices}
              value=""
              onChange={addService}
              getLabel={(s) => s.name}
              getSubLabel={(s) => `S/ ${parseFloat(s.base_price).toFixed(2)}`}
              placeholder="+ Agregar servicio..."
              clearOnSelect
            />
          </div>

          <div className="spa-field-row">
            <div className="spa-field" style={{ marginBottom: 0 }}>
              <label className="spa-label">
                Precio final (S/)
                {!priceOverridden.current && form.services.length > 0 && (
                  <span className="muted tiny" style={{ marginLeft: 4 }}>auto</span>
                )}
              </label>
              <input
                className="spa-input" type="number" min="0" step="0.5"
                value={form.final_price}
                onChange={e => handleFinalPriceChange(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="spa-field" style={{ marginBottom: 0 }}>
              <label className="spa-label">Método de pago</label>
              <select
                className="spa-select"
                value={form.payment_method}
                onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
              >
                <option value="cash">Efectivo</option>
                <option value="yape">Yape</option>
                <option value="card">Tarjeta</option>
              </select>
            </div>
          </div>

          <div className="spa-field">
            <button
              type="button"
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--terra)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => setShowDateTime(v => !v)}
            >
              {showDateTime ? '▲ Ocultar fecha/hora' : '▼ Cambiar fecha/hora'}
              <span className="muted tiny" style={{ marginLeft: 4 }}>(por defecto: ahora)</span>
            </button>
            {showDateTime && (
              <div style={{ marginTop: 6 }}>
                <input
                  className="spa-input"
                  type="datetime-local"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="spa-field">
            <label className="spa-label">Notas (opcional)</label>
            <textarea
              className="spa-textarea" rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Observaciones del servicio..."
            />
          </div>

          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button
              className="spa-btn spa-btn-primary spa-btn-full"
              onClick={save}
              disabled={saving || !form.client_id || form.services.length === 0 || (isAdmin && !form.employee_id)}
            >
              {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Registrar atención'}
            </button>
            <button className="spa-btn spa-btn-full" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
