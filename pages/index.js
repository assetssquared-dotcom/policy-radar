import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { COUNTRIES as STATIC, MACRO_THEMES, THEMES } from '../data/policies';

const NAV_LINKS = [
  {
    label: 'Threads', href: 'https://www.threads.com/@asset.x2',
    color: '#e4e4e4', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)',
    icon: `<svg width="14" height="14" viewBox="0 0 192 192" fill="currentColor"><path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-43.246-41.457-43.398h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 6.987 4.676 15.997 6.95 25.379 6.432 12.359-.687 22.081-5.391 28.89-13.975 5.186-6.658 8.446-15.29 9.87-26.147 5.922 3.577 10.302 8.287 12.666 13.952 3.989 9.711 4.222 25.701-8.297 38.21-10.916 10.909-24.04 15.633-43.867 15.766-21.999-.149-38.646-7.215-49.482-21.009C37.458 134.017 32.2 115.61 32 92c.2-23.61 5.458-42.017 15.694-54.744 10.836-13.794 27.483-20.86 49.482-21.009 22.126.15 39.047 7.245 50.34 21.084 5.57 6.858 9.616 15.369 12.068 25.292l16.21-4.324c-2.999-11.607-7.861-21.666-14.578-29.963C147.166 10.246 126.354 1.176 100.086 1L99.803 1C73.587 1.176 52.994 10.274 39.371 26.607 27.366 41.005 21.2 61.565 21 92.001v.999c.2 30.435 6.366 50.996 18.371 65.394 13.623 16.333 34.216 25.431 60.432 25.607h.283c23.102-.149 39.376-6.231 52.676-19.521 17.84-17.828 17.342-40.208 11.501-53.962-4.198-10.217-12.376-18.515-22.726-23.53z"/></svg>`,
  },
  {
    label: 'YouTube', href: 'https://www.youtube.com/channel/UCpTC-SMFjA3EDRhZIKOcKuQ',
    color: '#ff4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.3)',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
  {
    label: '프로젝트방', href: 'https://t.me/+2Qw1cAZTm8FjMGNl',
    color: '#2aabee', bg: 'rgba(42,171,238,0.1)', border: 'rgba(42,171,238,0.3)',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  },
  {
    label: '구독자료', href: 'https://contents.premium.naver.com/assetx2/assetsx2',
    color: '#03c75a', bg: 'rgba(3,199,90,0.1)', border: 'rgba(3,199,90,0.3)',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>`,
  },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

function PolicyRow({ policy, color }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const statusColor = policy.status === 'active' ? '#3d9e6a' : policy.status === 'upcoming' ? '#b8924a' : '#666';
  const statusLabel = policy.status === 'active' ? 'ACTIVE' : policy.status === 'upcoming' ? 'UPCOMING' : 'PAUSED';

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '18px 0', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 2, background: color, alignSelf: 'stretch', flexShrink: 0, borderRadius: 1 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.06em', color: statusColor, border: `1px solid ${statusColor}40`, background: `${statusColor}12`, borderRadius: 2, padding: '2px 7px', flexShrink: 0 }}>{statusLabel}</span>
              {!isMobile && (policy.themes || []).slice(0, 2).map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, padding: '2px 6px' }}>{t.toUpperCase()}</span>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 17 : 20, fontWeight: 400, color: 'var(--t1)', lineHeight: 1.25 }}>{policy.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 10 : 11, color: 'var(--amber)', marginTop: 4 }}>{policy.budget}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {!isMobile && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--t2)' }}>{policy.date}</div>}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: open ? color : 'var(--t3)', transition: 'color .15s', width: 16, textAlign: 'center' }}>{open ? '▲' : '▼'}</div>
        </div>
      </div>

      {open && (
        <div style={{ padding: '0 0 24px 14px', animation: 'fadeIn .15s ease' }}>
          <p style={{ fontSize: isMobile ? 13 : 14, color: 'var(--t2)', lineHeight: 1.85, marginBottom: 20, whiteSpace: 'pre-line' }}>{policy.background}</p>

          {/* panels: 3col on desktop, 1col on mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.055)' }}>
            {/* Beneficiaries */}
            <div style={{ background: 'var(--s1)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)', letterSpacing: '.09em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.055)' }}>수혜 산업 매핑</div>
              {(policy.beneficiaries || []).map((b, i) => (
                <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < (policy.beneficiaries||[]).length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                    <div style={{ fontSize: 12, color: 'var(--t1)', fontWeight: 500, lineHeight: 1.3 }}>{b.sector}</div>
                    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                      {[1,2,3,4,5].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: 1, background: j <= Math.abs(b.impact) ? (b.pos ? '#3d9e6a' : '#b84a4a') : 'rgba(255,255,255,0.06)' }} />)}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t2)', marginBottom: 2 }}>{(b.stocks||[]).slice(0,2).join(' · ')}</div>
                  {(b.etfs||[]).length > 0 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)' }}>ETF {b.etfs.slice(0,3).join(' · ')}</div>}
                </div>
              ))}
            </div>

            {/* Budget + Risk */}
            <div style={{ background: 'var(--s1)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)', letterSpacing: '.09em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.055)' }}>규모 · 예산</div>
              {(policy.budgetData || []).map((b, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 4 }}>{b.name}</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(Math.round((b.value/(b.max||b.value*1.5))*100),100)}%`, background: color+'99', borderRadius: 2 }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{typeof b.value==='number'&&b.value<1?b.value.toFixed(2):(b.value||0).toLocaleString()}</div>
                </div>
              ))}
              {policy.risks && (
                <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(180,60,60,.04)', border: '1px solid rgba(180,60,60,.1)', borderRadius: 3 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#a04040', letterSpacing: '.07em', marginBottom: 5 }}>RISK FACTOR</div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.65 }}>{policy.risks}</div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div style={{ background: 'var(--s1)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)', letterSpacing: '.09em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.055)' }}>타임라인</div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 5, top: 6, bottom: 0, width: 1, background: 'rgba(255,255,255,0.055)' }} />
                {(policy.timeline||[]).map((t, j) => (
                  <div key={j} style={{ display: 'flex', gap: 12, marginBottom: 11, position: 'relative' }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', flexShrink: 0, background: j===(policy.timeline||[]).length-1?color:'var(--s4)', border: `1px solid ${color}50`, marginTop: 1 }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color, marginBottom: 2 }}>{t.date}</div>
                      <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>{t.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CountrySection({ country, isMobile }) {
  return (
    <section style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: isMobile ? '32px 0' : '48px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 240px', gap: isMobile ? 20 : 40, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${country.color}25` }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <span style={{ fontSize: isMobile ? 28 : 34, lineHeight: 1 }}>{country.flag}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 26 : 32, fontWeight: 400, color: country.color, lineHeight: 1 }}>{country.name}</h2>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--t2)', marginTop: 6, letterSpacing: '.03em' }}>{country.tagline}</div>
            </div>
          </div>
          <p style={{ fontSize: isMobile ? 13 : 14, color: 'var(--t2)', lineHeight: 1.85, maxWidth: 520 }}>{country.summary}</p>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, alignSelf: 'start' }}>
            {[
              { label: '분석 정책', value: country.policies.length },
              { label: '최근 업데이트', value: country.updated },
              { label: '핵심 테마', value: [...new Set(country.policies.flatMap(p=>p.themes||[]))].length+'개' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--s1)', borderLeft: `2px solid ${country.color}40` }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--t2)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: country.color }}>{value}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[...new Set(country.policies.flatMap(p=>p.themes||[]))].map(tid => {
                const t = THEMES[tid];
                return t ? <span key={tid} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: t.color, border: `1px solid ${t.color}30`, borderRadius: 2, padding: '2px 5px', background: t.color+'0d' }}>{t.label}</span> : null;
              })}
            </div>
          </div>
        )}
      </div>
      <div>
        {country.policies.map(policy => <PolicyRow key={policy.id} policy={policy} color={country.color} />)}
      </div>
    </section>
  );
}

export default function Home() {
  const [countries, setCountries] = useState(STATIC);
  const [activeCountry, setActiveCountry] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [changelog, setChangelog] = useState([]);
  const [showChangelog, setShowChangelog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetch('/api/policies').then(r=>r.json()).then(d=>{
      if(d.countries) setCountries(d.countries);
      if(d.lastUpdated) setLastUpdated(d.lastUpdated);
    }).catch(()=>{});
    fetch('/api/changelog').then(r=>r.json()).then(d=>{
      if(d.changelog) setChangelog(d.changelog.slice(0,8));
    }).catch(()=>{});
  }, []);

  const displayed = activeCountry ? countries.filter(c=>c.id===activeCountry) : countries;
  const total = countries.reduce((s,c)=>s+c.policies.length, 0);

  return (
    <>
      <Head>
        <title>Policy Radar — 자산제곱 글로벌 정책 분석</title>
        <meta name="description" content="미국·중국·유럽·한국·일본 주요 정책 분석 · 수혜 산업 매핑 · 매일 자동 업데이트" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--ink)' }}>

        {/* ── NAV ── */}
        <nav style={{
          height: 52, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          background: 'var(--ink)', position: 'sticky', top: 0, zIndex: 200,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, color: 'var(--amber)', letterSpacing: '.1em' }}>POLICY RADAR</span>
            {!isMobile && <>
              <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 12px', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '.06em' }}>자산제곱 INTELLIGENCE</span>
            </>}
          </div>

          {/* Desktop: channel links + live */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3d9e6a', display: 'inline-block', animation: 'pulse 2.5s infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3d9e6a', letterSpacing: '.06em' }}>LIVE</span>
              </div>
              {NAV_LINKS.map(({ label, href, color, bg, border, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
                  color, background: bg, border: `1px solid ${border}`,
                  borderRadius: 6, padding: '5px 11px',
                  textDecoration: 'none', transition: 'opacity .15s', whiteSpace: 'nowrap',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: icon }} />
                  {label}
                </a>
              ))}
            </div>
          )}

          {/* Mobile: live dot + hamburger */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3d9e6a', display: 'inline-block', animation: 'pulse 2.5s infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3d9e6a' }}>LIVE</span>
              </div>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4, padding: 4,
              }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.6)', display: 'block', borderRadius: 1 }} />
                ))}
              </button>
            </div>
          )}
        </nav>

        {/* Mobile menu drawer */}
        {isMobile && menuOpen && (
          <div style={{
            background: 'var(--s1)', borderBottom: '1px solid rgba(255,255,255,0.055)',
            padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10,
            animation: 'fadeIn .15s ease',
          }}>
            {NAV_LINKS.map(({ label, href, color, bg, border, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
                color, background: bg, border: `1px solid ${border}`,
                borderRadius: 8, padding: '12px 16px',
                textDecoration: 'none',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: icon }} />
                {label}
              </a>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.055)', margin: '4px 0' }} />
            <a href="https://assetx2-dashboard.vercel.app" target="_blank" rel="noopener" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Dashboard ↗</a>
            <a href="https://assetx2-geomap.vercel.app" target="_blank" rel="noopener" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>GeoMap ↗</a>
          </div>
        )}
{/* ── CHANGELOG ── */}
        {changelog.length > 0 && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.055)', background: 'var(--s1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3d9e6a', letterSpacing: '.06em' }}>LATEST UPDATES</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3d9e6a', background: 'rgba(61,158,106,.1)', border: '1px solid rgba(61,158,106,.18)', borderRadius: 2, padding: '1px 6px' }}>+{changelog.length}</span>
                {lastUpdated && !isMobile && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{new Date(lastUpdated).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
              <button onClick={() => setShowChangelog(!showChangelog)} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showChangelog ? '▲ 닫기' : '▼ 변경 내역'}
              </button>
            </div>
            {showChangelog && (
              <div style={{ padding: '0 20px 10px' }}>
                {changelog.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 13 }}>{STATIC.find(c=>c.id===e.countryId)?.flag}</span>
                    {!isMobile && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 70 }}>{new Date(e.date).toLocaleDateString('ko-KR')}</span>}
                    <span style={{ fontSize: 13, color: 'var(--t1)', flex: 1 }}>{e.policyName}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: e.status==='active'?'#3d9e6a':'#b8924a', border:'1px solid', borderColor:e.status==='active'?'rgba(61,158,106,.3)':'rgba(184,146,74,.3)', borderRadius:2, padding:'1px 5px' }}>
                      {e.status==='active'?'ACTIVE':'UPCOMING'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MAIN LAYOUT ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '196px 1fr' }}>

          {/* ── SIDEBAR (desktop only) ── */}
          {!isMobile && (
            <aside style={{
              borderRight: '1px solid rgba(255,255,255,0.055)',
              background: 'var(--s1)',
              position: 'sticky', top: 80, alignSelf: 'start',
              height: 'calc(100vh - 80px)', overflowY: 'auto',
            }}>
              {/* Stats grid */}
              <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.055)' }}>
                  {[{n:total,l:'분석 정책'},{n:'5',l:'대상 국가'},{n:MACRO_THEMES.length,l:'매크로 테마'},{n:'매일',l:'AI 업데이트'}].map(({n,l}) => (
                    <div key={l} style={{ background:'var(--s1)', padding:'10px 12px' }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:18, color:'var(--amber)', lineHeight:1 }}>{n}</div>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'rgba(255,255,255,0.22)', marginTop:3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Country nav */}
              <div style={{ padding: '10px 0' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'rgba(255,255,255,0.2)', letterSpacing:'.1em', padding:'0 16px', marginBottom:6 }}>국가 분석</div>
                <div onClick={() => setActiveCountry(null)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 16px', cursor:'pointer', background:activeCountry===null?'var(--s2)':'transparent', borderLeft:activeCountry===null?'2px solid var(--amber)':'2px solid transparent', transition:'all .12s' }}
                  onMouseEnter={e=>{if(activeCountry!==null)e.currentTarget.style.background='var(--s2)'}}
                  onMouseLeave={e=>{if(activeCountry!==null)e.currentTarget.style.background='transparent'}}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:activeCountry===null?'var(--t1)':'var(--t2)' }}>전체 보기</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--amber)' }}>{total}</span>
                </div>
                {countries.map(c => (
                  <div key={c.id} onClick={() => setActiveCountry(activeCountry===c.id?null:c.id)} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 16px', cursor:'pointer', background:activeCountry===c.id?'var(--s2)':'transparent', borderLeft:activeCountry===c.id?`2px solid ${c.color}`:'2px solid transparent', transition:'all .12s' }}
                    onMouseEnter={e=>{if(activeCountry!==c.id)e.currentTarget.style.background='var(--s2)'}}
                    onMouseLeave={e=>{if(activeCountry!==c.id)e.currentTarget.style.background='transparent'}}>
                    <span style={{ fontSize:14, flexShrink:0 }}>{c.flag}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:14, color:'var(--t1)', lineHeight:1 }}>{c.name}</div>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'rgba(255,255,255,0.22)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.tagline.split(' · ').slice(0,2).join(' · ')}</div>
                    </div>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:c.color, flexShrink:0 }}>{c.policies.length}</span>
                  </div>
                ))}
              </div>

              <div style={{ height:1, background:'rgba(255,255,255,0.055)', margin:'4px 0' }} />

              {/* Macro themes */}
              <div style={{ padding:'10px 0' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'rgba(255,255,255,0.2)', letterSpacing:'.1em', padding:'0 16px', marginBottom:6 }}>매크로 테마</div>
                {MACRO_THEMES.map(t => (
                  <Link key={t.id} href={`/theme/${t.id}`}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 16px', cursor:'pointer', transition:'background .12s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--s2)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{ width:4, height:4, borderRadius:'50%', background:t.color, flexShrink:0 }} />
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--t2)' }}>{t.name}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.055)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'#3d9e6a', display:'inline-block', animation:'pulse 2.5s infinite' }} />
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'#3d9e6a', letterSpacing:'.06em' }}>AUTO UPDATE</span>
                </div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'rgba(255,255,255,0.2)', lineHeight:1.7 }}>매일 오전 7시 자동 업데이트</div>
              </div>
            </aside>
          )}

          {/* ── CONTENT ── */}
          <main style={{ padding: isMobile ? '0 16px' : '0 40px', minWidth: 0 }}>
            {/* Mobile: country filter tabs */}
            {isMobile && (
              <div style={{ display:'flex', gap:6, padding:'16px 0 4px', overflowX:'auto', borderBottom:'1px solid rgba(255,255,255,0.055)', marginBottom:0 }}>
                <button onClick={() => setActiveCountry(null)} style={{ flexShrink:0, fontFamily:'var(--font-mono)', fontSize:10, color:activeCountry===null?'var(--ink)':'var(--t2)', background:activeCountry===null?'var(--amber)':'transparent', border:`1px solid ${activeCountry===null?'var(--amber)':'rgba(255,255,255,0.12)'}`, borderRadius:4, padding:'5px 10px', cursor:'pointer' }}>전체</button>
                {countries.map(c => (
                  <button key={c.id} onClick={() => setActiveCountry(activeCountry===c.id?null:c.id)} style={{ flexShrink:0, fontFamily:'var(--font-mono)', fontSize:10, color:activeCountry===c.id?'var(--ink)':c.color, background:activeCountry===c.id?c.color:'transparent', border:`1px solid ${activeCountry===c.id?c.color:c.color+'40'}`, borderRadius:4, padding:'5px 10px', cursor:'pointer' }}>
                    {c.flag} {c.name}
                  </button>
                ))}
              </div>
            )}

            {/* Hero */}
            <div style={{ padding: isMobile ? '28px 0 8px' : '36px 0 0' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:'.12em', marginBottom:10 }}>자산제곱 — 글로벌 정책 분석 레이더</div>
              <h1 style={{ fontFamily:'var(--font-serif)', fontSize:isMobile?32:46, fontWeight:400, color:'var(--t1)', lineHeight:1.08, marginBottom:10 }}>
                정책이 만드는<br />
                <em style={{ color:'var(--amber)', fontStyle:'italic' }}>다음 수혜주</em>
              </h1>
              <p style={{ fontSize:isMobile?13:14, color:'var(--t2)', lineHeight:1.85, maxWidth:520 }}>
                미국·중국·유럽·한국·일본 5개국의 핵심 정책과 수혜 산업을 분석합니다.
              </p>
            </div>

            {/* Country sections */}
            {displayed.map(country => <CountrySection key={country.id} country={country} isMobile={isMobile} />)}

            {/* Macro themes */}
            {!activeCountry && (
              <section style={{ padding: isMobile ? '32px 0' : '48px 0' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:'.09em', marginBottom:16 }}>GLOBAL MACRO THEMES — 크로스컨트리 분석</div>
                <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(auto-fill, minmax(200px, 1fr))', gap:1, background:'rgba(255,255,255,0.055)' }}>
                  {MACRO_THEMES.map(t => (
                    <Link key={t.id} href={`/theme/${t.id}`}>
                      <div style={{ background:'var(--s1)', padding:'14px', cursor:'pointer', transition:'background .12s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--s2)'}
                        onMouseLeave={e=>e.currentTarget.style.background='var(--s1)'}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background:t.color, flexShrink:0 }} />
                          <span style={{ fontFamily:'var(--font-serif)', fontSize:14, color:'var(--t1)' }}>{t.name}</span>
                        </div>
                        <div style={{ fontSize:11, color:'var(--t2)', lineHeight:1.65, marginBottom:8 }}>{t.description.slice(0,65)}…</div>
                        <div style={{ display:'flex', gap:3 }}>
                          {(t.countries||[]).map(cId=>{const c=STATIC.find(x=>x.id===cId);return c?<span key={cId} style={{fontSize:12}}>{c.flag}</span>:null;})}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.055)', padding:'20px 0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.18)' }}>© 자산제곱 — POLICY RADAR</span>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                {NAV_LINKS.map(({label,href}) => (
                  <a key={label} href={href} target="_blank" rel="noopener" style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.25)', textDecoration:'none', transition:'color .12s' }}
                    onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.5)'}
                    onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.25)'}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        *{box-sizing:border-box;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:var(--s1)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>
    </>
  );
}
