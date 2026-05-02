import { useState, useEffect, useRef } from 'react';

export default function Autocomplete({
  options,
  value,
  onChange,
  getLabel,
  getSubLabel,
  placeholder = 'Buscar...',
  clearOnSelect = false,
}) {
  const getLabelByValue = (val) => {
    const opt = options.find(o => String(o.id) === String(val));
    return opt ? getLabel(opt) : '';
  };

  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  // Sync text when value or options change (e.g. options load async)
  useEffect(() => {
    setText(getLabelByValue(value));
  }, [value, options.length]);

  const filtered = text
    ? options.filter(o => getLabel(o).toLowerCase().includes(text.toLowerCase()))
    : options;

  function handleChange(e) {
    setText(e.target.value);
    onChange('');
    setIsOpen(true);
  }

  function handleSelect(option) {
    if (clearOnSelect) {
      setText('');
    } else {
      setText(getLabel(option));
    }
    onChange(option.id);
    setIsOpen(false);
  }

  function handleBlur() {
    setTimeout(() => {
      setIsOpen(false);
      if (!clearOnSelect) setText(getLabelByValue(value));
      else setText('');
    }, 150);
  }

  const hasValue = Boolean(value);

  return (
    <div className="spa-ac-wrap">
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          className="spa-input"
          style={{ paddingRight: 26 }}
          value={text}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
        />
        {hasValue ? (
          <button
            type="button"
            style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-4)', fontSize: 15, lineHeight: 1, padding: 0, cursor: 'pointer' }}
            onMouseDown={(e) => { e.preventDefault(); setText(''); onChange(''); inputRef.current?.focus(); }}
          >
            ×
          </button>
        ) : (
          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', fontSize: 10, pointerEvents: 'none' }}>▾</span>
        )}
      </div>

      {isOpen && (
        <div className="spa-ac-dropdown">
          {filtered.length === 0 ? (
            <div className="spa-ac-item muted" style={{ textAlign: 'center' }}>
              {text ? `Sin resultados para "${text}"` : 'Sin opciones'}
            </div>
          ) : (
            filtered.map(option => (
              <div
                key={option.id}
                className={`spa-ac-item${String(option.id) === String(value) ? ' spa-ac-item-highlighted' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(option); }}
              >
                <span style={{ fontWeight: 500 }}>{getLabel(option)}</span>
                {getSubLabel && <span className="sub">{getSubLabel(option)}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
