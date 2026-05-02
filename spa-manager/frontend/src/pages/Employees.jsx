import { useState, useEffect } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { name: '', specialty: '', commission_percentage: 0 };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]     = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setEmployees(await api.getEmployees());
    setLoading(false);
  }

  function openCreate() { setEditing(null); setForm(empty); setError(''); setModal(true); }
  function openEdit(e)  { setEditing(e); setForm({ name: e.name, specialty: e.specialty || '', commission_percentage: e.commission_percentage }); setError(''); setModal(true); }

  async function save() {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    try {
      if (editing) await api.updateEmployee(editing.id, form);
      else         await api.createEmployee(form);
      setModal(false);
      load();
    } catch (err) { setError(err.message); }
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este empleado? Sus atenciones quedarán sin empleado asignado.')) return;
    await api.deleteEmployee(id);
    load();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">Empleados<span className="count">{employees.length}</span></h1>
        </div>
        <div className="spa-page-actions">
          <button className="spa-btn spa-btn-primary" onClick={openCreate}>+ Nuevo empleado</button>
        </div>
      </div>

      <div style={{ padding: '14px 18px', flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div className="spa-empty"><div className="spa-empty-title">Cargando...</div></div>
        ) : (
          <div className="spa-table-wrap">
            <table className="spa-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th className="num">Comisión</th>
                  <th style={{ width: 120 }}></th>
                </tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.name}</td>
                    <td className="muted">{e.specialty || '—'}</td>
                    <td className="num">
                      <span className="spa-pill spa-pill-terra">{e.commission_percentage}%</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="spa-btn spa-btn-sm" onClick={() => openEdit(e)}>Editar</button>
                        <button className="spa-btn spa-btn-danger-outline spa-btn-sm" onClick={() => remove(e.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan={4}><div className="spa-empty"><div className="spa-empty-title">No hay empleados registrados</div></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar empleado' : 'Nuevo empleado'}>
        <div className="col">
          {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: 13 }}>{error}</div>}
          <div className="spa-field">
            <label className="spa-label">Nombre *</label>
            <input className="spa-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
          </div>
          <div className="spa-field">
            <label className="spa-label">Especialidad</label>
            <input className="spa-input" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="Ej: Colorista, Barbero, Masajista..." />
          </div>
          <div className="spa-field">
            <label className="spa-label">Porcentaje de comisión (%)</label>
            <input className="spa-input" type="number" min="0" max="100" step="1"
              value={form.commission_percentage}
              onChange={e => setForm({ ...form, commission_percentage: parseFloat(e.target.value) || 0 })} />
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button className="spa-btn spa-btn-primary spa-btn-full" onClick={save}>Guardar</button>
            <button className="spa-btn spa-btn-full" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
