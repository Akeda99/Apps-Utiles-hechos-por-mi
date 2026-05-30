// MamiSalud — Calculadora de semanas (FUR)

function ScreenCalc() {
  // FUR: 5 dic 2025 → semanas a hoy ~14 may 2026 = ~22w 3d
  return (
    <div className="ms-screen" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top */}
      <div className="ms-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'var(--ink-faint)', display: 'grid', placeItems: 'center', width: 32, height: 32 }}>
            <IBack size={22} stroke={2.4}/>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-faint)', letterSpacing: '0.06em' }}>HERRAMIENTA</div>
            <h2 style={{ fontSize: 19 }}>¿Cuántas semanas tengo?</h2>
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 16px 8px', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.4 }}>
        Cuéntame el primer día de tu <b>última regla</b> (FUR) y yo te digo cuántas semanas llevas 🌷
      </div>

      {/* FUR selector */}
      <div style={{ padding: '10px 16px 0' }}>
        <div className="field focused" style={{ background: 'white' }}>
          <label>Primer día de tu última regla</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div style={{ fontFamily: 'Quicksand', fontSize: 22, fontWeight: 700 }}>5 de diciembre, 2025</div>
            <div style={{ color: 'var(--pink-500)' }}><ICalendar size={22} stroke={2.2}/></div>
          </div>
        </div>
      </div>

      {/* Mini calendar */}
      <div style={{ padding: '12px 16px 0' }}>
        <div className="ms-card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ color: 'var(--ink-faint)' }}><IBack size={16} stroke={2.4}/></div>
            <div style={{ fontFamily: 'Quicksand', fontWeight: 700, fontSize: 14 }}>Diciembre 2025</div>
            <div style={{ color: 'var(--ink-faint)', transform: 'scaleX(-1)' }}><IBack size={16} stroke={2.4}/></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {['L','M','M','J','V','S','D'].map((d,i) => (
              <div key={i} style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-faint)', textAlign: 'center', padding: '4px 0' }}>{d}</div>
            ))}
            {(() => {
              // Dec 2025 starts on Monday (Dec 1 = Mon)
              const cells = [];
              for (let d = 1; d <= 31; d++) {
                const selected = d === 5;
                const inWindow = d >= 5 && d <= 11;
                cells.push(
                  <div key={d} style={{
                    aspectRatio: '1', display: 'grid', placeItems: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: selected ? 'white' : (inWindow ? 'var(--pink-500)' : 'var(--ink)'),
                    background: selected ? 'var(--pink-400)' : (inWindow ? 'var(--pink-50)' : 'transparent'),
                    borderRadius: selected ? 12 : (inWindow ? (d === 11 ? '0 12px 12px 0' : (d === 5 ? '12px 0 0 12px' : 0)) : 12),
                    boxShadow: selected ? '0 4px 10px rgba(255,126,145,0.3)' : 'none',
                  }}>{d}</div>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      </div>

      {/* Result */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{
          background: 'linear-gradient(160deg, #DEF4E8 0%, #B8E8CD 100%)',
          borderRadius: 26, padding: 18,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, bottom: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}/>
          <span className="chip" style={{ background: 'white', color: 'var(--mint-600)' }}>
            <ISparkle size={11} stroke={2.6}/> RESULTADO
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 12, position: 'relative' }}>
            <div style={{ fontFamily: 'Quicksand', fontSize: 56, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>22</div>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ fontFamily: 'Quicksand', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>semanas</div>
              <div style={{ fontSize: 11, color: 'var(--mint-600)', fontWeight: 700 }}>+ 3 días</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 6, position: 'relative' }}>
            Estás en tu <b style={{ color: 'var(--mint-600)' }}>segundo trimestre</b> 🌱
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <DetailRow icon={<ICalendar size={18} stroke={2.2}/>} label="Fecha probable de parto" value="11 de septiembre, 2026"/>
        <DetailRow icon={<IBaby size={18} stroke={2.2}/>}     label="Trimestre actual"          value="Segundo (semana 14 a 27)"/>
        <DetailRow icon={<IHeart size={18} stroke={2.2}/>}    label="Próximo control sugerido"  value="Entre semana 24 y 26"/>
      </div>

      {/* CTA */}
      <div style={{ flex: 1 }}/>
      <div style={{ padding: 14, background: 'white', borderTop: '1px solid var(--line)' }}>
        <button className="ms-pill primary" style={{ width: '100%', padding: '14px 18px', fontSize: 15 }}>
          Guardar en mi perfil
        </button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div style={{
      background: 'var(--pink-50)', borderRadius: 16, padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12, background: 'white',
        color: 'var(--pink-500)', display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontFamily: 'Quicksand', fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{value}</div>
      </div>
    </div>
  );
}

window.ScreenCalc = ScreenCalc;
