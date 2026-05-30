// MamiSalud — Chatbot screen (Mami-bot)

function ScreenChat() {
  return (
    <div className="ms-screen" style={{ display: 'flex', flexDirection: 'column', background: 'var(--cream-2)' }}>
      {/* Top bar */}
      <div className="ms-topbar" style={{ paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'var(--ink-faint)', display: 'grid', placeItems: 'center', width: 32, height: 32 }}>
            <IBack size={22} stroke={2.4}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #DEF4E8, #B8E8CD)',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 0 2px white, 0 0 0 4px var(--mint-200)',
              color: 'var(--mint-600)',
            }}>
              <IBaby size={20} stroke={2.4}/>
            </div>
            <div>
              <div style={{ fontFamily: 'Quicksand', fontWeight: 700, fontSize: 15 }}>Mami-bot</div>
              <div style={{ fontSize: 11, color: 'var(--mint-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mint-400)' }}/>
                en línea, listo para ti
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div style={{ flex: 1, padding: '14px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>

        <DateChip>Hoy</DateChip>

        {/* Bot opener */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <BotAvatar/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="bubble bot">
              ¡Hola Liz! 💕 Soy Mami-bot. Estoy aquí para acompañarte en tu embarazo.
            </div>
            <div className="bubble bot">
              ¿Sobre qué te gustaría conversar hoy?
            </div>
          </div>
        </div>

        {/* Decision-tree options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 38, marginTop: 2 }}>
          <OptionChip icon="🌱">¿Cómo va mi bebé esta semana?</OptionChip>
          <OptionChip icon="🥗">¿Qué debo comer?</OptionChip>
          <OptionChip icon="💪">Cambios en mi cuerpo</OptionChip>
        </div>

        {/* User reply */}
        <div className="bubble me" style={{ marginTop: 4 }}>
          ¿Qué debo comer? 🥗
        </div>

        {/* Bot answer */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <BotAvatar/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="bubble bot">
              ¡Buenísima pregunta! Tu cuerpo necesita más nutrientes ahora 🤗
            </div>
            <div className="bubble bot" style={{ background: 'white', boxShadow: 'var(--shadow-card)', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px 4px' }}>
                <div style={{ fontFamily: 'Quicksand', fontWeight: 700, fontSize: 14, color: 'var(--mint-600)' }}>3 alimentos imprescindibles</div>
              </div>
              <div style={{ padding: '4px 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FoodLine emoji="🥬" name="Verduras verdes" desc="Espinaca, brócoli — ácido fólico"/>
                <FoodLine emoji="🥚" name="Huevos y pescado" desc="Hierro y proteína para tu bebé"/>
                <FoodLine emoji="🥛" name="Lácteos" desc="Calcio para los huesitos"/>
              </div>
            </div>
          </div>
        </div>

        {/* Next options branch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 38, marginTop: 4 }}>
          <OptionChip icon="📋">Ver lista completa</OptionChip>
          <OptionChip icon="❓">¿Y qué NO debo comer?</OptionChip>
          <OptionChip icon="↩">Volver al menú</OptionChip>
        </div>

      </div>

      {/* Composer */}
      <div style={{ padding: '8px 12px 14px', background: 'white', borderTop: '1px solid var(--line)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--pink-50)', borderRadius: 999, padding: '6px 6px 6px 16px',
        }}>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-faint)' }}>Escribe tu pregunta…</span>
          <button style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none',
            background: 'var(--pink-400)', color: 'white',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <ISend size={18} stroke={2.4}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function BotAvatar() {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: '50%',
      background: 'var(--mint-100)', color: 'var(--mint-600)',
      display: 'grid', placeItems: 'center', flexShrink: 0,
    }}>
      <IBaby size={16} stroke={2.4}/>
    </div>
  );
}

function DateChip({ children }) {
  return (
    <div style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: 'var(--ink-faint)' }}>
      {children}
    </div>
  );
}

function OptionChip({ icon, children }) {
  return (
    <div style={{
      background: 'white', border: '1.5px solid var(--mint-200)',
      borderRadius: 999, padding: '10px 14px',
      fontSize: 13, fontWeight: 700, color: 'var(--mint-600)',
      display: 'flex', alignItems: 'center', gap: 8,
      alignSelf: 'flex-start',
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      {children}
    </div>
  );
}

function FoodLine({ emoji, name, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--mint-100)', display: 'grid', placeItems: 'center', fontSize: 20 }}>{emoji}</div>
      <div>
        <div style={{ fontFamily: 'Quicksand', fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>{desc}</div>
      </div>
    </div>
  );
}

window.ScreenChat = ScreenChat;
