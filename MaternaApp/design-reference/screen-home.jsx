// MamiSalud — Home screen

function ScreenHome() {
  // Pregnancy progress — 22 weeks of 40
  const weeks = 22, total = 40;
  const pct = weeks / total;

  return (
    <div className="ms-screen" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div className="ms-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MSAvatar initials="LV" />
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontWeight: 700 }}>¡Buenos días, mami!</div>
            <h2 style={{ fontSize: 20 }}>Liz Valeria</h2>
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 14, background: 'var(--pink-100)',
          color: 'var(--pink-500)', display: 'grid', placeItems: 'center', position: 'relative',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/>
            <path d="M10 19a2 2 0 0 0 4 0"/>
          </svg>
          <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)' }}/>
        </div>
      </div>

      {/* Hero card — pregnancy progress */}
      <div style={{ padding: '6px 16px 0' }}>
        <div style={{
          background: 'linear-gradient(160deg, #FFE5EC 0%, #FFD0DE 60%, #FFC7DA 100%)',
          borderRadius: 28, padding: '20px 20px 22px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative blob */}
          <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.45)' }}/>
          <div style={{ position: 'absolute', right: 30, top: 40, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}/>

          <span className="chip chip-mint" style={{ position: 'relative' }}>
            <IBaby size={12} stroke={2.6}/> Segundo trimestre
          </span>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 12, position: 'relative' }}>
            <div style={{ fontFamily: 'Quicksand', fontWeight: 700, fontSize: 64, lineHeight: 1, color: 'var(--ink)' }}>22</div>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ fontFamily: 'Quicksand', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>semanas</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>+ 3 días</div>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600, position: 'relative' }}>
            Tu bebé es del tamaño de una <b style={{ color: 'var(--pink-500)' }}>papaya pequeña</b> 🌱
          </div>

          {/* progress bar */}
          <div style={{ marginTop: 16, position: 'relative' }}>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.7)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${pct*100}%`, height: '100%', background: 'linear-gradient(90deg, var(--mint-400), var(--pink-400))', borderRadius: 999 }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>
              <span>Semana 1</span>
              <span>Semana 40</span>
            </div>
          </div>
        </div>
      </div>

      {/* Próxima cita */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8, padding: '0 4px',
        }}>
          <h3 style={{ fontSize: 14 }}>Próxima cita prenatal</h3>
          <span style={{ fontSize: 12, color: 'var(--pink-500)', fontWeight: 700 }}>Ver todas</span>
        </div>

        <div className="ms-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 56, background: 'var(--mint-100)', borderRadius: 16,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '8px 0',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--mint-600)', letterSpacing: '0.06em' }}>MAY</div>
            <div style={{ fontFamily: 'Quicksand', fontSize: 24, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>14</div>
            <div style={{ fontSize: 10, color: 'var(--mint-600)', fontWeight: 700 }}>jueves</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Quicksand', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>Control prenatal #5</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 3 }}>C.S. Yarinacocha · 9:30 a.m.</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <span className="chip chip-pink">en 5 días</span>
              <span className="chip chip-mint">Obst. Rosa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hoy quick actions */}
      <div style={{ padding: '16px 16px 0' }}>
        <h3 style={{ fontSize: 14, marginBottom: 8, padding: '0 4px' }}>Hoy puedes…</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

          <ActionCard tone="mint" title="Conversa con Mami-bot" sub="Pregunta lo que quieras" icon={<IChat size={22} stroke={2.2}/>} />
          <ActionCard tone="coral" title="Señales de alarma" sub="Revisa cuándo ir al centro" icon={<IAlert size={22} stroke={2.2}/>} />
          <ActionCard tone="pink" title="Anota tu control" sub="Peso, presión, ánimo" icon={<INote size={22} stroke={2.2}/>} />
          <ActionCard tone="lilac" title="Calculadora FUR" sub="¿Cuántas semanas tengo?" icon={<ICalc size={22} stroke={2.2}/>} />

        </div>
      </div>

      {/* Tip del día */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{
          background: 'var(--sun-50)', borderRadius: 22, padding: 14,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: 'white',
            display: 'grid', placeItems: 'center', color: '#D08A1F',
            flexShrink: 0,
          }}>
            <ISparkle size={22} stroke={2.2}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#B07419', letterSpacing: '0.06em' }}>TIP DEL DÍA</div>
            <div style={{ fontFamily: 'Quicksand', fontWeight: 600, fontSize: 14, color: 'var(--ink)', lineHeight: 1.3, marginTop: 2 }}>
              Toma 8 vasos de agua hoy. Tu bebé y tú lo necesitan 💧
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <MSTabBar active="home"/>
    </div>
  );
}

function ActionCard({ tone, title, sub, icon }) {
  const map = {
    mint:  { bg: 'var(--mint-100)',  fg: 'var(--mint-600)' },
    pink:  { bg: 'var(--pink-100)',  fg: 'var(--pink-500)' },
    coral: { bg: 'var(--coral-50)',  fg: 'var(--coral)' },
    lilac: { bg: 'var(--lilac-50)',  fg: '#7A5BB0' },
  };
  const t = map[tone];
  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: 12,
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 14,
        background: t.bg, color: t.fg,
        display: 'grid', placeItems: 'center',
      }}>{icon}</div>
      <div style={{ fontFamily: 'Quicksand', fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginTop: 10, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

window.ScreenHome = ScreenHome;
