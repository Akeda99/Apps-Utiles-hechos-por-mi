// MamiSalud — friendly line icons (Lucide-inspired, simple paths)
// Drawn at 24px viewBox; scale via the `size` prop.

const Icon = ({ children, size = 24, color = 'currentColor', stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}>
    {children}
  </svg>
);

const IHeart = (p) => (
  <Icon {...p}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
  </Icon>
);

const IBaby = (p) => (
  // simple "belly" — circle + small head
  <Icon {...p}>
    <circle cx="12" cy="14" r="6" />
    <circle cx="12" cy="6" r="2.4" />
    <path d="M9.5 13.5h.01M14.5 13.5h.01" stroke={p.color || 'currentColor'} strokeWidth="2.2"/>
    <path d="M10.5 16.2c.6.6 2.4.6 3 0" />
  </Icon>
);

const ICalendar = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </Icon>
);

const IChat = (p) => (
  <Icon {...p}>
    <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <circle cx="9" cy="11" r="0.6" fill={p.color || 'currentColor'} stroke="none"/>
    <circle cx="12" cy="11" r="0.6" fill={p.color || 'currentColor'} stroke="none"/>
    <circle cx="15" cy="11" r="0.6" fill={p.color || 'currentColor'} stroke="none"/>
  </Icon>
);

const IAlert = (p) => (
  <Icon {...p}>
    <path d="M12 3.5L21 19.5H3L12 3.5z" />
    <path d="M12 10v4M12 17h.01" />
  </Icon>
);

const IDrop = (p) => (
  <Icon {...p}>
    <path d="M12 3.5C9 8 5.5 11 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 11 15 8 12 3.5z" />
  </Icon>
);

const IThermo = (p) => (
  <Icon {...p}>
    <path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0z" />
  </Icon>
);

const IEye = (p) => (
  <Icon {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
    <circle cx="12" cy="12" r="2.5" />
  </Icon>
);

const IHeadache = (p) => (
  // head profile with bolt
  <Icon {...p}>
    <path d="M5 12a7 7 0 1 1 14 0v4a3 3 0 0 1-3 3h-2v-3l-2-1 1-3h-2l-1 3"/>
  </Icon>
);

const IBellyPain = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="13" r="7"/>
    <path d="M9 11.5c.7.6 1.4.6 2 0M13 11.5c.7.6 1.4.6 2 0"/>
    <path d="M9.5 16c1-.8 4-.8 5 0"/>
  </Icon>
);

const IPulse = (p) => (
  <Icon {...p}>
    <path d="M3 12h4l2-5 4 10 2-5h6"/>
  </Icon>
);

const IScale = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
    <path d="M9 10c.8-2 4.2-2 5 0M12 8.5l-2 4h4l-2-4z" fill={p.color || 'currentColor'} stroke="none"/>
  </Icon>
);

const INote = (p) => (
  <Icon {...p}>
    <path d="M6 4h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
    <path d="M14 4v5h6M8 13h8M8 17h5"/>
  </Icon>
);

const IHome = (p) => (
  <Icon {...p}>
    <path d="M4 11l8-7 8 7v9a2 2 0 0 1-2 2h-3v-6h-6v6H6a2 2 0 0 1-2-2v-9z"/>
  </Icon>
);

const IBook = (p) => (
  <Icon {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 0-2 2V5zM20 5a2 2 0 0 0-2-2h-6v17h6a2 2 0 0 1 2 2V5z"/>
  </Icon>
);

const IUser = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/>
  </Icon>
);

const IChevron = (p) => (
  <Icon {...p}>
    <path d="M9 6l6 6-6 6"/>
  </Icon>
);

const IBack = (p) => (
  <Icon {...p}>
    <path d="M15 6l-6 6 6 6"/>
  </Icon>
);

const IPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14"/>
  </Icon>
);

const ICheck = (p) => (
  <Icon {...p}>
    <path d="M5 12.5l5 4 9-9"/>
  </Icon>
);

const ICalc = (p) => (
  <Icon {...p}>
    <rect x="5" y="3" width="14" height="18" rx="3"/>
    <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>
  </Icon>
);

const ISend = (p) => (
  <Icon {...p}>
    <path d="M5 12L20 5l-3 15-5-6-7-2z"/>
  </Icon>
);

const ISwell = (p) => (
  <Icon {...p}>
    <path d="M5 16c.5-3 2-5 4-5s2 3 5 3 3-3 5-3"/>
    <path d="M5 12c.5-3 2-5 4-5s2 3 5 3 3-3 5-3"/>
  </Icon>
);

const IFever = (p) => (
  <Icon {...p}>
    <path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0z"/>
    <circle cx="18" cy="6" r="2" fill={p.color || 'currentColor'} stroke="none" opacity="0.4"/>
  </Icon>
);

const ISparkle = (p) => (
  <Icon {...p}>
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M6.5 17.5l2.5-2.5M15 9l2.5-2.5"/>
  </Icon>
);

Object.assign(window, {
  Icon, IHeart, IBaby, ICalendar, IChat, IAlert, IDrop, IThermo, IEye,
  IHeadache, IBellyPain, IPulse, IScale, INote, IHome, IBook, IUser,
  IChevron, IBack, IPlus, ICheck, ICalc, ISend, ISwell, IFever, ISparkle,
});
