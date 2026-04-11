import Link from 'next/link';
import { COUNTRIES, MACRO_THEMES } from '../data/policies';

const NAV_SECTIONS = [
  { id: 'screener',  label: '수혜주 스크리너',    href: '/screener',  icon: '◈' },
  { id: 'heatmap',   label: '정책 강도 히트맵',   href: '/heatmap',   icon: '▦' },
  { id: 'calendar',  label: '정책 이벤트 캘린더', href: '/calendar',  icon: '◷' },
  { id: 'macro',     label: '매크로 지표 연결',   href: '/macro',     icon: '↗' },
  { id: 'risk',      label: '리스크 레이더',      href: '/risk',      icon: '⚠' },
  { id: 'flow',      label: '정책 연결고리 맵',   href: '/flow',      icon: '⬡' },
];

export default function Sidebar({ activeCountry, activeTheme, activePage }) {
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

      {/* Tools */}
      <div style={{ height: 1, background: 'var(--wire)', margin: '4px 0' }} />
      <div style={{ padding: '10px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
          letterSpacing: '.1em', padding: '0 14px', marginBottom: 6,
        }}>분석 도구</div>
        {NAV_SECTIONS.map(item => {
          const isOn = activePage === item.id;
          return (
            <Link key={item.id} href={item.href}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 14px', cursor: 'pointer',
                background: isOn ? 'var(--s2)' : 'transparent',
                borderLeft: isOn ? '2px solid var(--amber)' : '2px solid transparent',
                transition: 'background .12s',
              }}
                onMouseEnter={e => { if (!isOn) e.currentTarget.style.background = 'var(--s2)'; }}
                onMouseLeave={e => { if (!isOn) e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isOn ? 'var(--amber)' : 'var(--t3)', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: isOn ? 'var(--t1)' : 'var(--t2)' }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      
      </aside>
  );
}
