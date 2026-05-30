// MamiSalud — Señales de alarma

function ScreenAlerts() {
  const signals = [
    { icon: <IDrop size={28} stroke={2.2}/>,      tone: 'coral', emoji: '🩸', title: 'Sangrado vaginal', desc: 'Aunque sea poquito, no esperes.' },
    { icon: <IBellyPain size={28} stroke={2.2}/>, tone: 'coral', emoji: '😣', title: 'Dolor fuerte de barriga', desc: 'Que no se quita al descansar.' },
    { icon: <IHeadache size={28} stroke={2.2}/>,  tone: 'sun',   emoji: '🤕', title: 'Dolor de cabeza intenso', desc: 'Sobre todo si ves luces o manchas.' },
    { icon: <IEye size={28} stroke={2.2}/>,       tone: 'sun',   emoji: '👁️', title: 'Visión borrosa', desc: 'O ver “lucecitas” de repente.' },
    { icon: <ISwell size={28} stroke={2.2}/>,     tone: 'sun',   emoji: '🦶', title: 'Hinchazón en cara o manos', desc: 'Especialmente al despertar.' },
    { icon: <IFever size={28} stroke={2.2}/>,     tone: 'coral', emoji: '🌡️', title: 'Fiebre alta (más de 38°)', desc: 'Con escalofríos o malestar.' },
    { icon: <IDrop size={28} stroke={2.2}/>,      tone: 'sun',   emoji: '💧', title: 'Pérdida de líquido', desc: 'Como si te orinaras sin querer.' },
    { icon: <IBaby size={28} stroke={2.2}/>,      tone: 'coral', emoji: '👶', title: 'El bebé no se mueve', desc: 'Después de las 20 semanas.' },
  ];

  const toneMap = {
    coral: { bg: 'var(--coral-50)', fg: 'var(--coral)' },
    sun:   { bg: 'var(--sun-50)',   fg: '#C18620' },
  };

  return (
    <div className="ms-screen" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top */}
      <div className="ms-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'var(--ink-faint)', display: 'grid', placeItems: 'center', width: 32, height: 32 }}>
            <IBack size={22} stroke={2.4}/>
          </div>
          <h2 style={{ fontSize: 19 }}>Señales de alarma</h2>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ padding: '6px 16px 0' }}>
        <div style={{
          background: 'linear-gradient(150deg, #FFE2E6 0%, #FFCBD3 100%)',
          borderRadius: 24, padding: 16,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: 16,
            background: 'white', color: 'var(--coral)',
            display: 'grid', placeItems: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(255,126,145,0.3)',
          }}>
            <IAlert size={26} stroke={2.4}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Quicksand', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Si sientes algo así, ve YA al centro de salud</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, fontWeight: 600 }}>No esperes a la próxima cita. Cuidarte es cuidar a tu bebé 💖</div>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 16px 6px', overflowX: 'auto' }}>
        <FilterChip active>Todas</FilterChip>
        <FilterChip>🩸 Urgente</FilterChip>
        <FilterChip>⚠️ Avisa pronto</FilterChip>
      </div>

      {/* Cards grid */}
      <div style={{ padding: '6px 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {signals.map((s, i) => {
          const t = toneMap[s.tone];
          return (
            <div key={i} style={{
              background: 'white', borderRadius: 22, padding: 12,
              boxShadow: 'var(--shadow-card)', position: 'relative',
              border: s.tone === 'coral' ? '1.5px solid var(--coral-50)' : '1.5px solid var(--sun-50)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: t.bg, color: t.fg,
                display: 'grid', placeItems: 'center',
                fontSize: 26,
              }}>{s.emoji}</div>
              <div style={{
                position: 'absolute', top: 12, right: 12,
                fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
                color: t.fg, background: t.bg, padding: '3px 7px', borderRadius: 999,
              }}>
                {s.tone === 'coral' ? 'URGENTE' : 'AVISA'}
              </div>
              <div style={{ fontFamily: 'Quicksand', fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginTop: 10, lineHeight: 1.25 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 3, fontWeight: 600, lineHeight: 1.35 }}>{s.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Emergency CTA */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          background: 'var(--coral)', borderRadius: 22, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 20px rgba(255,126,145,0.35)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.25)',
            color: 'white', display: 'grid', placeItems: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <div style={{ flex: 1, color: 'white' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', opacity: 0.9 }}>EMERGENCIA</div>
            <div style={{ fontFamily: 'Quicksand', fontWeight: 700, fontSize: 15 }}>Llamar al 106 / SAMU</div>
          </div>
          <IChevron size={22} color="white" stroke={2.4}/>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ children, active }) {
  return (
    <div style={{
      background: active ? 'var(--pink-400)' : 'white',
      color: active ? 'white' : 'var(--ink-soft)',
      padding: '8px 14px', borderRadius: 999,
      fontSize: 12, fontWeight: 700,
      whiteSpace: 'nowrap',
      boxShadow: active ? 'none' : 'var(--shadow-card)',
    }}>{children}</div>
  );
}

window.ScreenAlerts = ScreenAlerts;
