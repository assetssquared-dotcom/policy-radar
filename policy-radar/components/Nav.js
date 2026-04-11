import Link from 'next/link';

const TICKERS = [
  { label: 'S&P 500', val: '5,431', chg: '▼ 1.24%', up: false },
  { label: 'NASDAQ',  val: '17,032', chg: '▼ 1.67%', up: false },
  { label: 'KOSPI',   val: '2,432',  chg: '▼ 0.89%', up: false },
  { label: 'GOLD',    val: '3,238',  chg: '▲ 0.44%', up: true  },
  { label: 'DXY',     val: '100.2',  chg: '▼ 0.31%', up: false },
  { label: 'USD/KRW', val: '1,428',  chg: '▲ 0.18%', up: false },
  { label: 'WTI',     val: '60.4',   chg: '▼ 2.11%', up: false },
  { label: 'BTC',     val: '79,201', chg: '▼ 3.44%', up: false },
  { label: 'VIX',     val: '38.2',   chg: '▲ HIGH',  up: false, warn: true },
];

export default function Nav({ lastUpdated }) {
  return (
    <>
      {/* Top nav */}
      <nav style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid var(--wire)',
        background: 'var(--ink)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: 'var(--amber)', letterSpacing: '.1em' }}>
            POLICY RADAR
          </span>
          <span style={{ width: 1, height: 14, background: 'var(--wire2)', margin: '0 10px', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--t3)', letterSpacing: '.06em' }}>
            자산제곱 INTELLIGENCE
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { label: '국가 분석', href: '/' },
            { label: '매크로 테마', href: '/theme/dollar_hegemony' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--t3)',
              padding: '4px 10px',
              borderRadius: 'var(--r)',
              letterSpacing: '.05em',
              transition: 'all .12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--t2)'; e.currentTarget.style.background = 'var(--s3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'transparent'; }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2.5s infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--green)', letterSpacing: '.06em' }}>
              LIVE · 07:00 KST
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { label: 'Dashboard', href: 'https://assetx2-dashboard.vercel.app' },
              { label: 'GeoMap', href: 'https://assetx2-geomap.vercel.app' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener" style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--t3)', letterSpacing: '.04em', transition: 'color .12s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--t2)'}
                onMouseLeave={e => e.target.style.color = 'var(--t3)'}>
                {label} ↗
              </a>
            ))}
          </div>
          <a href="https://www.threads.com/@asset.x2" target="_blank" rel="noopener" style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)',
            border: '1px solid rgba(184,146,74,.22)',
            borderRadius: 'var(--r)', padding: '4px 10px', letterSpacing: '.05em',
          }}>
            @asset.x2
          </a>
        </div>
      </nav>

      {/* Ticker strip */}
      <div style={{
        height: 30,
        borderBottom: '1px solid var(--wire)',
        background: 'var(--s1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 20,
        overflowX: 'auto',
      }}>
        {TICKERS.map((tk, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {i > 0 && <span style={{ width: 1, height: 12, background: 'var(--wire2)', display: 'inline-block', marginRight: 14 }} />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--t3)', letterSpacing: '.04em' }}>{tk.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, color: 'var(--t2)' }}>{tk.val}</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: tk.warn ? '#c09020' : tk.up ? 'var(--green)' : 'var(--red)',
            }}>{tk.chg}</span>
          </div>
        ))}
      </div>
    </>
  );
}
