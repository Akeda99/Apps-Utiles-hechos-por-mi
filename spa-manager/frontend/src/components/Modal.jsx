import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="spa-modal-backdrop" onClick={onClose}>
      <div
        className="spa-modal"
        style={{ width: 480 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="spa-modal-header">
          <h2 className="spa-modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="spa-btn spa-btn-ghost spa-btn-sm"
            style={{ fontSize: 18, lineHeight: 1, padding: '2px 8px' }}
          >
            ×
          </button>
        </div>
        <div className="spa-modal-body">{children}</div>
      </div>
    </div>
  );
}
