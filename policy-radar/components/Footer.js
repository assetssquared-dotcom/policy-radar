export default function Footer() {
  const links = [
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCpTC-SMFjA3EDRhZIKOcKuQ' },
    { label: 'Threads', href: 'https://www.threads.com/@asset.x2' },
    { label: 'Telegram', href: 'https://t.me/+2Qw1cAZTm8FjMGNl' },
    { label: '네이버 프리미엄', href: 'https://contents.premium.naver.com/assetx2/assetsx2' },
    { label: 'Dashboard', href: 'https://assetx2-dashboard.vercel.app' },
    { label: 'GeoMap', href: 'https://assetx2-geomap.vercel.app' },
  ];
  return (
    <footer style={{
      borderTop: '1px solid var(--wire)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--s1)',
      flexWrap: 'wrap',
      gap: 8,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.04em' }}>
        © 자산제곱 — POLICY RADAR v1.0 · 투자 교육은 선택이 아닌 필수
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {links.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', transition: 'color .12s' }}
            onMouseEnter={e => e.target.style.color = 'var(--t2)'}
            onMouseLeave={e => e.target.style.color = 'var(--t3)'}>
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
