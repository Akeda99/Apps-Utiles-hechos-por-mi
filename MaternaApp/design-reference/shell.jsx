// MamiSalud — shared shell pieces (top bar, bottom tabs, etc.)

function MSTopBar({ title, subtitle, leftIcon, rightContent, accent = 'pink' }) {
  return (
    <div className="ms-topbar" style={{ paddingBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {leftIcon ? (
          <div style={{
            width: 38, height: 38, borderRadius: 14,
            background: accent === 'mint' ? 'var(--mint-100)' : 'var(--pink-100)',
            color: accent === 'mint' ? 'var(--mint-600)' : 'var(--pink-500)',
            display: 'grid', placeItems: 'center',
          }}>
            {leftIcon}
          </div>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {subtitle ? (
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{subtitle}</span>
          ) : null}
          <h2 style={{ fontSize: 19, lineHeight: '22px' }}>{title}</h2>
        </div>
      </div>
      {rightContent}
    </div>
  );
}

function MSTabBar({ active }) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: <IHome size={22} stroke={2.2}/> },
    { id: 'chat', label: 'Conversa', icon: <IChat size={22} stroke={2.2}/> },
    { id: 'controls', label: 'Controles', icon: <INote size={22} stroke={2.2}/> },
    { id: 'me', label: 'Mi perfil', icon: <IUser size={22} stroke={2.2}/> },
  ];
  return (
    <div className="ms-tabs">
      {tabs.map(t => (
        <div key={t.id} className={'ms-tab' + (t.id === active ? ' active' : '')}>
          {t.icon}
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

function MSAvatar({ initials = 'LV', size = 44, ring = true }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #FFCFE0 0%, #FFB6CC 100%)',
      color: 'white', fontFamily: 'Quicksand', fontWeight: 700, fontSize: size * 0.4,
      display: 'grid', placeItems: 'center',
      boxShadow: ring ? '0 0 0 3px white, 0 0 0 5px var(--pink-150)' : 'none',
    }}>{initials}</div>
  );
}

Object.assign(window, { MSTopBar, MSTabBar, MSAvatar });
