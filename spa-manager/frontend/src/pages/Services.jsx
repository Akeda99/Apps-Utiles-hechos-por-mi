import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { name: '', base_price: '' };

export default function Services() {
  const [services, setServices] = useState([]);
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]     = useState(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setServices(await api.getServices());
    setLoading(false);
  }

  function openCreate() { setEditing(null); setForm(empty); setModal(true); }
  function openEdit(s)  { setEditing(s); setForm({ name: s.name, base_price: s.base_price }); setModal(true); }

  async function save() {
    if (!form.name.trim() || !form.base_price) return;
    if (editing) await api.updateService(editing.id, form);
    else         await api.createService(form);
    setModal(false);
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este servicio?')) return;
    await api.deleteService(id);
    load();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="spa-page-header">
        <div className="spa-page-title-block">
          <h1 className="spa-page-title">Servicios<span className="count">{services.length}</span></h1>
        </div>
        <div className="spa-page-actions">
          <button className="spa-btn spa-btn-primary" onClick={openCreate}>+ Nuevo servicio</button>
        </div>
      </div>

      <div style={{ padding: '14px 18px', flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div className="spa-empty"><div className="spa-empty-title">Cargando...</div></div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {services.map(s => (
                <div key={s.id} className="spa-panel" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    <div className="tabular" style={{ fontSize: 20, fontWeight: 700, color: 'var(--terra)', marginTop: 2, letterSpacing: '-0.02em' }}>
                      S/ {parseFloat(s.base_price).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button className="spa-btn spa-btn-sm" onClick={() => openEdit(s)}><Pencil size={14} /></button>
                    <button className="spa-btn spa-btn-danger-outline spa-btn-sm" onClick={() => remove(s.id)}>×</button>
                  </div>
                </div>
              ))}
            </div>
            {services.length === 0 && (
              <div className="spa-empty"><div className="spa-empty-title">No hay servicios registrados</div></div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar servicio' : 'Nuevo servicio'}>
        <div className="col">
          <div className="spa-field">
            <label className="spa-label">Nombre del servicio *</label>
            <input className="spa-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Corte de cabello, Masaje relajante..." />
          </div>
          <div className="spa-field">
            <label className="spa-label">Precio base (S/) *</label>
            <input className="spa-input" type="number" min="0" step="0.5"
              value={form.base_price}
              onChange={e => setForm({ ...form, base_price: e.target.value })}
              placeholder="0.00" />
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button className="spa-btn spa-btn-primary spa-btn-full" onClick={save} disabled={!form.name.trim() || !form.base_price}>
              Guardar
            </button>
            <button className="spa-btn spa-btn-full" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
