import { useState, useEffect } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { name: '', phone: '', notes: '' };

export default function Clients() {
  const [clients, setClients]   = useState([]);
  const [modal, setModal]       = useState(false);
  const [histModal, setHistModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [history, setHistory]   = useState([]);
  const [selClient, setSelClient] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setClients(await api.getClients());
    setLoading(false);
  }

  function openCreate() { setEditing(null); setForm(empty); setModal(true); }
  function openEdit(c)  { setEditing(c); setForm({ name: c.name, phone: c.phone || '', notes: c.notes || '' }); setModal(true); }

  async function viewHistory(c) {
    setSelClient(c);
    setHistory(await api.getClientHistory(c.id));
    setHistModal(true);
  }

  async function save() {
    if (!form.name.trim()) return;
    if (editing) await api.updateClient(editing.id, form);
    else         await api.createClient(form);
    setModal(false);
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este cliente?')) return;
    await api.deleteClient(id);
    load();
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">Clientes<span className="count">{filtered.length}</span></h1>
        </div>
        <div className="spa-page-actions">
          <input
            className="spa-input"
            style={{ width: 220, padding: '4px 8px' }}
            placeholder="Buscar nombre o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="spa-btn spa-btn-primary" onClick={openCreate}>+ Nuevo cliente</button>
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
                  <th>Teléfono</th>
                  <th>Notas</th>
                  <th style={{ width: 160 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td className="muted">{c.phone || '—'}</td>
                    <td className="muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.notes || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="spa-btn spa-btn-sm" onClick={() => viewHistory(c)}>Historial</button>
                        <button className="spa-btn spa-btn-sm" onClick={() => openEdit(c)}>Editar</button>
                        <button className="spa-btn spa-btn-danger-outline spa-btn-sm" onClick={() => remove(c.id)}>×</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4}><div className="spa-empty"><div className="spa-empty-title">No hay clientes</div></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar cliente' : 'Nuevo cliente'}>
        <div className="col">
          <div className="spa-field">
            <label className="spa-label">Nombre *</label>
            <input className="spa-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
          </div>
          <div className="spa-field">
            <label className="spa-label">Teléfono</label>
            <input className="spa-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="999-000-000" />
          </div>
          <div className="spa-field">
            <label className="spa-label">Notas</label>
            <textarea className="spa-textarea" rows={3} value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Alergias, preferencias, descuentos..." />
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button className="spa-btn spa-btn-primary spa-btn-full" onClick={save} disabled={!form.name.trim()}>Guardar</button>
            <button className="spa-btn spa-btn-full" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={histModal} onClose={() => setHistModal(false)} title={`Historial — ${selClient?.name}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
          {history.length === 0 ? (
            <div className="spa-empty"><div className="spa-empty-title">Sin atenciones registradas</div></div>
          ) : (
            history.map(h => (
              <div key={h.id} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{h.service_name}</span>
                  <span className="tabular bold" style={{ color: 'var(--terra)', fontSize: 13 }}>S/ {parseFloat(h.final_price).toFixed(2)}</span>
                </div>
                <p className="tiny muted" style={{ marginTop: 3 }}>
                  {h.employee_name} · {new Date(h.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
