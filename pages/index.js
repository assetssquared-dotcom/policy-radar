import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { COUNTRIES as STATIC, MACRO_THEMES, THEMES } from '../data/policies';

function PolicyRow({ policy, color }) {
  const [open, setOpen] = useState(false);
  const statusColor = policy.status === 'active' ? '#3d9e6a' : policy.status === 'upcoming' ? '#b8924a' : '#666';
  const statusLabel = policy.status === 'active' ? 'ACTIVE' : policy.status === 'upcoming' ? 'UPCOMING' : 'PAUSED';

  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.055)',
    }}>
      {/* Row header - always visible */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 20,
          padding: '16px 0',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          {/* Color accent line */}
          <div style={{ width: 2, background: color, alignSelf: 'stretch', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '.06em',
                color: statusColor, border: `1px solid ${statusColor}40`,
                background: `${statusColor}12`, borderRadius: 2, padding: '2px 6px',
              }}>{statusLabel}</span>
              {(policy.themes || []).slice(0, 2).map(t => (
                <span key={t} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '.04em',
                  color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2, padding: '2px 6px',
                }}>{t.toUpperCase()}</span>
              ))}
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 400,
              color: 'var(--t1)', lineHeight: 1.2,
            }}>{policy.name}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--amber)',
              marginTop: 3,
            }}>{policy.budget}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', textAlign: 'right' }}>
            {policy.date}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: open ? color : 'var(--t3)',
            transition: 'color .15s', width: 16, textAlign: 'center',
          }}>
            {open ? '▲' : '▼'}
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{
          padding: '0 0 24px 16px',
          animation: 'fadeIn .15s ease',
        }}>
          {/* Background */}
          <p style={{
            fontSize: 12, color: 'var(--t2)', lineHeight: 1.85,
            maxWidth: 660, marginBottom: 24, whiteSpace: 'pre-line',
          }}>{policy.background}</p>

          {/* 3 col panels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.055)' }}>
            {/* Beneficiaries */}
            <div style={{ background: 'var(--s1)', padding: '14px 16px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'var(--t3)',
                letterSpacing: '.09em', marginBottom: 12, paddingBottom: 8,
                borderBottom: '1px solid rgba(255,255,255,0.055)',
              }}>수혜 산업 매핑</div>
              {(policy.beneficiaries || []).map((b, i) => (
                <div key={i} style={{
                  marginBottom: 10, paddingBottom: 10,
                  borderBottom: i < policy.beneficiaries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                    <div style={{ fontSize: 10, color: 'var(--t1)', fontWeight: 500, lineHeight: 1.3 }}>{b.sector}</div>
                    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                      {[1,2,3,4,5].map(j => (
                        <div key={j} style={{
                          width: 5, height: 5, borderRadius: 1,
                          background: j <= Math.abs(b.impact)
                            ? (b.pos ? '#3d9e6a' : '#b84a4a')
                            : 'rgba(255,255,255,0.06)',
                        }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t2)', marginBottom: 1 }}>
                    {(b.stocks || []).slice(0, 2).join(' · ')}
                  </div>
                  {(b.etfs || []).length > 0 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--amber)' }}>
                      ETF {b.etfs.slice(0,3).join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Budget bars + Risk */}
            <div style={{ background: 'var(--s1)', padding: '14px 16px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'var(--t3)',
                letterSpacing: '.09em', marginBottom: 12, paddingBottom: 8,
                borderBottom: '1px solid rgba(255,255,255,0.055)',
              }}>규모 · 예산</div>
              {(policy.budgetData || []).map((b, i) => (
                <div key={i} style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 9, color: 'var(--t2)', marginBottom: 3 }}>{b.name}</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(Math.round((b.value / (b.max || b.value * 1.5)) * 100), 100)}%`,
                      background: color + '99', borderRadius: 2,
                    }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', marginTop: 2 }}>
                    {typeof b.value === 'number' && b.value < 1 ? b.value.toFixed(2) : (b.value || 0).toLocaleString()}
                  </div>
                </div>
              ))}
              {policy.risks && (
                <div style={{
                  marginTop: 12, padding: '8px 10px',
                  background: 'rgba(180,60,60,.04)',
                  border: '1px solid rgba(180,60,60,.1)', borderRadius: 3,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: '#a04040', letterSpacing: '.07em', marginBottom: 4 }}>RISK FACTOR</div>
                  <div style={{ fontSize: 10, color: 'var(--t2)', lineHeight: 1.65 }}>{policy.risks}</div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div style={{ background: 'var(--s1)', padding: '14px 16px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'var(--t3)',
                letterSpacing: '.09em', marginBottom: 12, paddingBottom: 8,
                borderBottom: '1px solid rgba(255,255,255,0.055)',
              }}>타임라인</div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 5, top: 6, bottom: 0,
                  width: 1, background: 'rgba(255,255,255,0.055)',
                }} />
                {(policy.timeline || []).map((t, j) => (
                  <div key={j} style={{ display: 'flex', gap: 11, marginBottom: 10, position: 'relative' }}>
                    <div style={{
                      width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
                      background: j === (policy.timeline || []).length - 1 ? color : 'var(--s4)',
                      border: `1px solid ${color}50`, marginTop: 1,
                    }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color, marginBottom: 1 }}>{t.date}</div>
                      <div style={{ fontSize: 10, color: 'var(--t2)', lineHeight: 1.45 }}>{t.event}</div>
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

function CountrySection({ country }) {
  return (
    <section style={{
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '48px 0',
    }}>
      {/* Country header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: 40,
        marginBottom: 32,
        paddingBottom: 24,
        borderBottom: `1px solid ${country.color}25`,
      }}>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12,
          }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>{country.flag}</span>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400,
                color: country.color, lineHeight: 1,
              }}>{country.name}</h2>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 8,
                color: 'var(--t3)', marginTop: 4, letterSpacing: '.04em',
              }}>{country.tagline}</div>
            </div>
          </div>
          <p style={{
            fontSize: 12, color: 'var(--t2)', lineHeight: 1.85,
            maxWidth: 520,
          }}>{country.summary}</p>
        </div>

        {/* Country stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, alignSelf: 'start' }}>
          {[
            { label: '분석 정책', value: country.policies.length },
            { label: '최근 업데이트', value: country.updated },
            { label: '핵심 테마', value: [...new Set(country.policies.flatMap(p => p.themes || []))].length + '개' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px',
              background: 'var(--s1)',
              borderLeft: `2px solid ${country.color}40`,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: country.color }}>{value}</span>
            </div>
          ))}
          {/* Theme tags */}
          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[...new Set(country.policies.flatMap(p => p.themes || []))].map(tid => {
              const t = THEMES[tid];
              return t ? (
                <span key={tid} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '.04em',
                  color: t.color, border: `1px solid ${t.color}30`,
                  borderRadius: 2, padding: '2px 6px', background: t.color + '0d',
                }}>{t.label}</span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Policy rows */}
      <div>
        {country.policies.map(policy => (
          <PolicyRow key={policy.id} policy={policy} color={country.color} />
        ))}
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

  useEffect(() => {
    fetch('/api/policies').then(r => r.json()).then(d => {
      if (d.countries) setCountries(d.countries);
      if (d.lastUpdated) setLastUpdated(d.lastUpdated);
    }).catch(() => {});
    fetch('/api/changelog').then(r => r.json()).then(d => {
      if (d.changelog) setChangelog(d.changelog.slice(0, 8));
    }).catch(() => {});
  }, []);

  const displayed = activeCountry ? countries.filter(c => c.id === activeCountry) : countries;
  const total = countries.reduce((s, c) => s + c.policies.length, 0);

  return (
    <>
      <Head>
        <title>Policy Radar — 자산제곱 글로벌 정책 분석</title>
        <meta name="description" content="미국·중국·유럽·한국·일본 주요 정책 분석 · 수혜 산업 매핑 · 매일 자동 업데이트" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--ink)' }}>
        {/* ── NAV ── */}
        <nav style={{
          height: 48, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 40px',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          background: 'var(--ink)', position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: 'var(--amber)', letterSpacing: '.1em' }}>POLICY RADAR</span>
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 12px', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '.06em' }}>자산제곱 INTELLIGENCE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3d9e6a', display: 'inline-block', animation: 'pulse 2.5s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3d9e6a', letterSpacing: '.06em' }}>LIVE · 07:00 KST</span>
            </div>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)', display: 'inline-block' }} />
            {[
              { label: 'Dashboard', href: 'https://assetx2-dashboard.vercel.app' },
              { label: 'GeoMap', href: 'https://assetx2-geomap.vercel.app' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener" style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.25)',
                letterSpacing: '.04em', transition: 'color .12s',
              }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}>
                {label} ↗
              </a>
            ))}
            <a href="https://www.threads.com/@asset.x2" target="_blank" rel="noopener" style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)',
              border: '1px solid rgba(184,146,74,.22)', borderRadius: 3, padding: '3px 10px',
            }}>@asset.x2</a>
          </div>
        </nav>

        {/* ── TICKER ── */}
        <div style={{
          height: 28, borderBottom: '1px solid rgba(255,255,255,0.055)',
          background: 'var(--s1)', display: 'flex', alignItems: 'center',
          padding: '0 40px', gap: 0, overflowX: 'auto',
        }}>
          {[
            { l: 'S&P 500', v: '5,431', c: '▼1.24%', up: false },
            { l: 'NASDAQ', v: '17,032', c: '▼1.67%', up: false },
            { l: 'KOSPI', v: '2,432', c: '▼0.89%', up: false },
            { l: 'GOLD', v: '3,238', c: '▲0.44%', up: true },
            { l: 'DXY', v: '100.2', c: '▼0.31%', up: false },
            { l: 'USD/KRW', v: '1,428', c: '▲0.18%', up: false },
            { l: 'WTI', v: '60.4', c: '▼2.11%', up: false },
            { l: 'BTC', v: '79,201', c: '▼3.44%', up: false },
            { l: 'VIX', v: '38.2', c: '▲ HIGH', warn: true },
          ].map((tk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
              {i > 0 && <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.07)', margin: '0 16px', display: 'inline-block' }} />}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(255,255,255,0.28)', marginRight: 6, letterSpacing: '.03em' }}>{tk.l}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(255,255,255,0.55)', marginRight: 5, fontWeight: 500 }}>{tk.v}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: tk.warn ? '#c09020' : tk.up ? '#3d9e6a' : '#b84a4a' }}>{tk.c}</span>
            </div>
          ))}
        </div>

        {/* ── LIVE CHANGELOG ── */}
        {changelog.length > 0 && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.055)', background: 'var(--s1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#3d9e6a', letterSpacing: '.06em' }}>LATEST UPDATES</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#3d9e6a', background: 'rgba(61,158,106,.1)', border: '1px solid rgba(61,158,106,.18)', borderRadius: 2, padding: '1px 6px' }}>+{changelog.length}</span>
                {lastUpdated && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{new Date(lastUpdated).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
              <button onClick={() => setShowChangelog(!showChangelog)} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showChangelog ? '▲ 닫기' : '▼ 변경 내역'}
              </button>
            </div>
            {showChangelog && (
              <div style={{ padding: '0 40px 10px' }}>
                {changelog.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 12 }}>{STATIC.find(c => c.id === e.countryId)?.flag}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.2)', minWidth: 70 }}>{new Date(e.date).toLocaleDateString('ko-KR')}</span>
                    <span style={{ fontSize: 11, color: 'var(--t1)', flex: 1 }}>{e.policyName}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: e.status === 'active' ? '#3d9e6a' : '#b8924a', border: '1px solid', borderColor: e.status === 'active' ? 'rgba(61,158,106,.3)' : 'rgba(184,146,74,.3)', borderRadius: 2, padding: '1px 5px' }}>
                      {e.status === 'active' ? 'ACTIVE' : 'UPCOMING'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MAIN LAYOUT ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 76px)' }}>

          {/* ── SIDEBAR ── */}
          <aside style={{
            borderRight: '1px solid rgba(255,255,255,0.055)',
            background: 'var(--s1)',
            position: 'sticky', top: 76, alignSelf: 'start', height: 'calc(100vh - 76px)',
            overflowY: 'auto',
          }}>
            {/* Stats */}
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.055)' }}>
                {[
                  { n: total, l: '분석 정책' },
                  { n: '5', l: '대상 국가' },
                  { n: MACRO_THEMES.length, l: '매크로 테마' },
                  { n: '매일', l: 'AI 업데이트' },
                ].map(({ n, l }) => (
                  <div key={l} style={{ background: 'var(--s1)', padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--amber)', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.22)', marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Country nav */}
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '.1em', padding: '0 16px', marginBottom: 6 }}>국가 분석</div>
              <div
                onClick={() => setActiveCountry(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 16px', cursor: 'pointer',
                  background: activeCountry === null ? 'var(--s2)' : 'transparent',
                  borderLeft: activeCountry === null ? '2px solid var(--amber)' : '2px solid transparent',
                  transition: 'all .12s',
                }}
                onMouseEnter={e => { if (activeCountry !== null) e.currentTarget.style.background = 'var(--s2)'; }}
                onMouseLeave={e => { if (activeCountry !== null) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: activeCountry === null ? 'var(--t1)' : 'var(--t2)' }}>전체 보기</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--amber)' }}>{total}</span>
              </div>
              {countries.map(c => (
                <div
                  key={c.id}
                  onClick={() => setActiveCountry(activeCountry === c.id ? null : c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px',
                    cursor: 'pointer',
                    background: activeCountry === c.id ? 'var(--s2)' : 'transparent',
                    borderLeft: activeCountry === c.id ? `2px solid ${c.color}` : '2px solid transparent',
                    transition: 'all .12s',
                  }}
                  onMouseEnter={e => { if (activeCountry !== c.id) e.currentTarget.style.background = 'var(--s2)'; }}
                  onMouseLeave={e => { if (activeCountry !== c.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{c.flag}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--t1)', lineHeight: 1 }}>{c.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.22)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.tagline.split(' · ').slice(0, 2).join(' · ')}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: c.color, flexShrink: 0 }}>{c.policies.length}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.055)', margin: '4px 0' }} />

            {/* Macro themes */}
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '.1em', padding: '0 16px', marginBottom: 6 }}>매크로 테마</div>
              {MACRO_THEMES.map(t => (
                <Link key={t.id} href={`/theme/${t.id}`}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px',
                    cursor: 'pointer', transition: 'background .12s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--t2)' }}>{t.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Auto update info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.055)', background: 'var(--s1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#3d9e6a', display: 'inline-block', animation: 'pulse 2.5s infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, color: '#3d9e6a', letterSpacing: '.06em' }}>AUTO UPDATE</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', lineHeight: 1.7 }}>
                Claude AI · 매일 07:00 KST
              </div>
            </div>
          </aside>

          {/* ── CONTENT ── */}
          <main style={{ padding: '0 48px', maxWidth: 960 }}>
            {/* Page header */}
            <div style={{ padding: '36px 0 0' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '.12em', marginBottom: 10 }}>
                자산제곱 — 글로벌 정책 분석 레이더
              </div>
              <h1 style={{
                fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 400,
                color: 'var(--t1)', lineHeight: 1.08, marginBottom: 10,
              }}>
                정책이 만드는<br />
                <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>다음 수혜주</em>
              </h1>
              <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.85, marginBottom: 0, maxWidth: 480 }}>
                미국·중국·유럽·한국·일본 5개국의 핵심 정책과 수혜 산업을 분석합니다.
              </p>
            </div>

            {/* Country sections */}
            {displayed.map(country => (
              <CountrySection key={country.id} country={country} />
            ))}

            {/* Macro themes grid */}
            {!activeCountry && (
              <section style={{ padding: '48px 0' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '.09em', marginBottom: 20,
                }}>GLOBAL MACRO THEMES — 크로스컨트리 분석</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.055)' }}>
                  {MACRO_THEMES.map(t => (
                    <Link key={t.id} href={`/theme/${t.id}`}>
                      <div style={{
                        background: 'var(--s1)', padding: '16px',
                        cursor: 'pointer', transition: 'background .12s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--s1)'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.color }} />
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--t1)' }}>{t.name}</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--t2)', lineHeight: 1.65, marginBottom: 8 }}>
                          {t.description.slice(0, 68)}…
                        </div>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {(t.countries || []).map(cId => {
                            const country = STATIC.find(x => x.id === cId);
                            return country ? <span key={cId} style={{ fontSize: 12 }}>{country.flag}</span> : null;
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.055)',
              padding: '20px 0 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 8,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.18)' }}>
                © 자산제곱 — POLICY RADAR · 투자 교육은 선택이 아닌 필수
              </span>
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCpTC-SMFjA3EDRhZIKOcKuQ' },
                  { label: 'Threads', href: 'https://www.threads.com/@asset.x2' },
                  { label: 'Telegram', href: 'https://t.me/+2Qw1cAZTm8FjMGNl' },
                  { label: '네이버 프리미엄', href: 'https://contents.premium.naver.com/assetx2/assetsx2' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.2)', transition: 'color .12s' }}
                    onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.15}} @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </>
  );
}
