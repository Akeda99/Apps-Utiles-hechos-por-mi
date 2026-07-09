import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { api } from '../api';
import Modal from '../components/Modal';
import Autocomplete from '../components/Autocomplete';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const statusLabels = {
  pending:   'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const emptyForm = { employee_id: '', client_id: '', service_id: '', scheduled_date: '', notes: '' };

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients]     = useState([]);
  const [services, setServices]   = useState([]);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([api.getEmployees(), api.getClients(), api.getServices()])
      .then(([e, c, s]) => { setEmployees(e); setClients(c); setServices(s); });
    load();
  }, []);

  async function load() {
    setLoading(true);
    const from = new Date().toISOString();
    const to   = new Date(Date.now() + 30 * 86400000).toISOString();
    setSchedule(await api.getSchedule({ from, to }));
    setLoading(false);
  }

  async function save() {
    if (!form.employee_id || !form.client_id || !form.service_id || !form.scheduled_date) return;
    await api.createSchedule(form);
    setModal(false);
    load();
  }

  async function updateStatus(item, status) {
    await api.updateSchedule(item.id, {
      status,
      employee_id:    item.employee_id,
      client_id:      item.client_id,
      service_id:     item.service_id,
      scheduled_date: item.scheduled_date,
      notes:          item.notes,
    });
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar esta cita?')) return;
    await api.deleteSchedule(id);
    load();
  }

  const statusPill = {
    pending:   'spa-pill-warning',
    confirmed: 'spa-pill-info',
    completed: 'spa-pill-success',
    cancelled: 'spa-pill-danger',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">Agenda<span className="count">{schedule.length}</span></h1>
          <span className="spa-page-sub">Próximos 30 días</span>
        </div>
        <div className="spa-page-actions">
          <button className="spa-btn spa-btn-primary" onClick={() => { setForm(emptyForm); setModal(true); }}>
            + Nueva cita
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div className="spa-empty"><div className="spa-empty-title">Cargando...</div></div>
        ) : schedule.length === 0 ? (
          <div className="spa-empty">
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center', color: 'var(--ink-3)' }}><CalendarDays size={32} /></div>
            <div className="spa-empty-title">No hay citas programadas</div>
            para los próximos 30 días
          </div>
        ) : (
          schedule.map(item => {
            const d = new Date(item.scheduled_date);
            return (
              <div key={item.id} className="spa-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'center', width: 48, flexShrink: 0 }}>
                  <div className="tabular" style={{ fontSize: 24, fontWeight: 700, color: 'var(--terra)', lineHeight: 1 }}>{d.getDate()}</div>
                  <div className="tiny muted" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>
                    {d.toLocaleDateString('es-PE', { month: 'short' })}
                  </div>
                  <div className="tiny muted" style={{ marginTop: 2 }}>
                    {d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.client_name}</div>
                  <div className="tiny muted">{item.service_name} · {item.employee_name}</div>
                  <div className="tabular" style={{ color: 'var(--terra)', fontWeight: 600, fontSize: 12, marginTop: 2 }}>
                    S/ {parseFloat(item.base_price).toFixed(2)}
                  </div>
                  {item.notes && <div className="tiny muted" style={{ marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.notes}</div>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span className={`spa-pill ${statusPill[item.status]}`}>{statusLabels[item.status]}</span>
                  <select
                    className="spa-select"
                    style={{ width: 130, padding: '3px 22px 3px 8px', fontSize: 12 }}
                    value={item.status}
                    onChange={e => updateStatus(item, e.target.value)}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                  <button
                    className="spa-btn spa-btn-danger-outline spa-btn-sm"
                    onClick={() => remove(item.id)}
                  >×</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nueva cita">
        <div className="col">
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
          <div className="spa-field">
            <label className="spa-label">Servicio *</label>
            <Autocomplete
              options={services}
              value={form.service_id}
              onChange={(id) => setForm(f => ({ ...f, service_id: id }))}
              getLabel={(s) => s.name}
              getSubLabel={(s) => `S/ ${parseFloat(s.base_price).toFixed(2)}`}
              placeholder="Buscar servicio..."
            />
          </div>
          <div className="spa-field">
            <label className="spa-label">Fecha y hora *</label>
            <input className="spa-input" type="datetime-local" value={form.scheduled_date}
              onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
          </div>
          <div className="spa-field">
            <label className="spa-label">Notas (opcional)</label>
            <textarea className="spa-textarea" rows={2} value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button
              className="spa-btn spa-btn-primary spa-btn-full"
              onClick={save}
              disabled={!form.client_id || !form.employee_id || !form.service_id || !form.scheduled_date}
            >
              Crear cita
            </button>
            <button className="spa-btn spa-btn-full" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
