import React from 'react';

export default function Footer({ isDark = true }) {
  const theme = {
    bg: isDark ? '#0f172a' : '#fff9f2',
    text: isDark ? '#f8fafc' : '#2d3436',
    link: isDark ? '#82aaff' : '#2563eb',
    border: isDark ? '#334155' : '#e0d5c1'
  };

  return (
    <footer
      className="app-footer"
      aria-label="Rodapé"
      style={{ background: theme.bg, color: theme.text, borderTop: `1px solid ${theme.border}` }}
    >
      <div className="footer-inner">
        <div className="footer-left">Desenvolvido por <strong>Lucas Rocha</strong></div>
        <div className="footer-right footer-links">
          <a href="https://github.com/DevLucasRocha/app-fila-livre" target="_blank" rel="noopener noreferrer" style={{ color: theme.link }}>GitHub</a>
          <span className="dot">•</span>
          <a href="https://www.linkedin.com/in/lucas-hssrs/" target="_blank" rel="noopener noreferrer" style={{ color: theme.link }}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
