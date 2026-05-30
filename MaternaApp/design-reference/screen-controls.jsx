// MamiSalud — Registro de controles

function ScreenControls() {
  return (
    <div className="ms-screen" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top */}
      <div className="ms-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'var(--ink-faint)', display: 'grid', placeItems: 'center', width: 32, height: 32 }}>
            <IBack size={22} stroke={2.4}/>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-faint)', letterSpacing: '0.06em' }}>NUEVO CONTROL</div>
            <h2 style={{ fontSize: 19 }}>Anota tu control</h2>
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--pink-500)' }}>Paso 1/2</div>
      </div>

      <div style={{ padding: '4px 16px 8px', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>
        Solo te toma un minuto. Lo guardamos en tu historia 💕
      </div>

      {/* Form */}
      <div style={{ padding: '8px 16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Date */}
        <div className="field">
          <label>Fecha del control</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="value">Jueves, 14 de mayo</div>
            <div style={{ color: 'var(--pink-500)' }}><ICalendar size={20} stroke={2.2}/></div>
          </div>
        </div>

        {/* Peso */}
        <div className="field focused">
          <label>Tu peso hoy</label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div style={{ fontFamily: 'Quicksand', fontSize: 32, fontWeight: 700, color: 'var(--ink)' }}>54.8</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)' }}>kg</div>
            <div style={{ flex: 1 }}/>
            <span className="chip chip-mint">+0.4 kg vs último</span>
          </div>
          {/* slider */}
          <div style={{ marginTop: 10, height: 32, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 14, height: 4, background: 'var(--pink-100)', borderRadius: 999 }}/>
            <div style={{ position: 'absolute', left: 0, top: 14, height: 4, background: 'var(--pink-400)', borderRadius: 999, width: '58%' }}/>
            <div style={{ position: 'absolute', left: 'calc(58% - 14px)', top: 2, width: 28, height: 28, borderRadius: '50%', background: 'white', border: '4px solid var(--pink-400)', boxShadow: '0 4px 8px rgba(255,126,145,0.3)' }}/>
            <div style={{ position: 'absolute', top: 0, left: 0, fontSize: 10, fontWeight: 700, color: 'var(--ink-faint)' }}>40 kg</div>
            <div style={{ position: 'absolute', top: 0, right: 0, fontSize: 10, fontWeight: 700, color: 'var(--ink-faint)' }}>90 kg</div>
          </div>
        </div>

        {/* Presión */}
        <div className="field">
          <label>Presión arterial</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <div className="value">110</div>
              <div style={{ fontFamily: 'Quicksand', fontSize: 16, color: 'var(--ink-faint)', fontWeight: 600 }}>/</div>
              <div className="value">70</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700, marginLeft: 4 }}>mmHg</div>
            </div>
            <div style={{ flex: 1 }}/>
            <span className="chip chip-mint">
              <ICheck size={11} stroke={3}/> Normal
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <NumberCell value="110" label="sistólica"/>
            <NumberCell value="70"  label="diastólica"/>
          </div>
        </div>

        {/* Cómo te sientes */}
        <div className="field">
          <label>¿Cómo te sientes hoy?</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <Mood emoji="😊" label="Bien"/>
            <Mood emoji="😴" label="Cansada" active/>
            <Mood emoji="🤢" label="Náuseas"/>
            <Mood emoji="😟" label="Triste"/>
            <Mood emoji="🤕" label="Dolor"/>
          </div>
        </div>

        {/* Observaciones */}
        <div className="field">
          <label>Observaciones (opcional)</label>
          <div style={{
            background: 'white', borderRadius: 12, padding: 10,
            fontSize: 13, color: 'var(--ink-soft)', minHeight: 56,
            border: '1px dashed var(--pink-150)',
            fontStyle: 'italic',
          }}>
            “Hoy sentí más pataditas en la noche, sobre todo después de comer 💕”
          </div>
        </div>

      </div>

      {/* Action bar */}
      <div style={{ flex: 1 }}/>
      <div style={{ padding: 14, background: 'white', borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
        <button className="ms-pill ghost" style={{ flex: 1 }}>Guardar</button>
        <button className="ms-pill primary" style={{ flex: 1.4 }}>Continuar →</button>
      </div>
    </div>
  );
}

function NumberCell({ value, label }) {
  return (
    <div style={{
      background: 'white', borderRadius: 12, padding: '8px 12px', flex: 1,
      border: '1.5px solid var(--pink-100)',
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'Quicksand', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{value}</div>
    </div>
  );
}

function Mood({ emoji, label, active }) {
  return (
    <div style={{
      background: active ? 'var(--pink-400)' : 'white',
      color: active ? 'white' : 'var(--ink-soft)',
      borderRadius: 999, padding: '8px 12px',
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 12, fontWeight: 700,
      border: active ? '1.5px solid var(--pink-400)' : '1.5px solid var(--pink-100)',
    }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      {label}
    </div>
  );
}

window.ScreenControls = ScreenControls;
