import Link from 'next/link';
import { COUNTRIES, MACRO_THEMES } from '../data/policies';

export default function Sidebar({ activeCountry, activeTheme }) {
  return (
    <aside style={{
      width: 200,
      borderRight: '1px solid var(--wire)',
      background: 'var(--s1)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Countries */}
      <div style={{ padding: '14px 0 8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
          letterSpacing: '.1em', padding: '0 14px', marginBottom: 6,
        }}>
          국가 분석
        </div>
        {COUNTRIES.map(c => {
          const isOn = activeCountry === c.id;
          return (
            <Link key={c.id} href={`/country/${c.id}`}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px', cursor: 'pointer',
                background: isOn ? 'var(--s2)' : 'transparent',
                position: 'relative', transition: 'background .12s',
              }}
                onMouseEnter={e => { if (!isOn) e.currentTarget.style.background = 'var(--s2)'; }}
                onMouseLeave={e => { if (!isOn) e.currentTarget.style.background = 'transparent'; }}>
                {isOn && (
                  <span style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: 2, background: c.color,
                  }} />
                )}
                <span style={{ fontSize: 14, flexShrink: 0 }}>{c.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--t1)', lineHeight: 1 }}>{c.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
                    marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{c.tagline.split(' · ').slice(0, 2).join(' · ')}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: c.color, flexShrink: 0 }}>
                  {c.policies.length}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ height: 1, background: 'var(--wire)', margin: '4px 0' }} />

      {/* Macro themes */}
      <div style={{ padding: '8px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
          letterSpacing: '.1em', padding: '0 14px', marginBottom: 6,
        }}>
          매크로 테마
        </div>
        {MACRO_THEMES.map(t => {
          const isOn = activeTheme === t.id;
          return (
            <Link key={t.id} href={`/theme/${t.id}`}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', cursor: 'pointer',
                background: isOn ? 'var(--s2)' : 'transparent',
                transition: 'background .12s',
              }}
                onMouseEnter={e => { if (!isOn) e.currentTarget.style.background = 'var(--s2)'; }}
                onMouseLeave={e => { if (!isOn) e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: isOn ? 'var(--t1)' : 'var(--t2)' }}>{t.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ height: 1, background: 'var(--wire)', margin: '4px 0' }} />

      {/* Update info */}
      <div style={{ padding: '12px 14px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2.5s infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--green)' }}>AUTO UPDATE</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', lineHeight: 1.7 }}>
          Claude AI가 매일 07:00 KST<br />
          글로벌 정책 뉴스를 스캔합니다
        </div>
      </div>
    </aside>
  );
}
