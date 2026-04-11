import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { COUNTRIES as STATIC, MACRO_THEMES, THEMES } from '../data/policies';

export default function Home() {
  const [countries, setCountries] = useState(STATIC);
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

  const total = countries.reduce((s, c) => s + c.policies.length, 0);

  return (
    <>
      <Head>
        <title>Policy Radar — 자산제곱 글로벌 정책 분석</title>
        <meta name="description" content="미국·중국·유럽·한국·일본 주요 정책 분석 · 수혜 산업 매핑 · 매일 자동 업데이트" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav lastUpdated={lastUpdated} />

        {/* Changelog bar */}
        {changelog.length > 0 && (
          <div style={{ borderBottom: '1px solid var(--wire)', background: 'var(--s1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--green)', letterSpacing: '.06em' }}>
                  LATEST UPDATES
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--green)',
                  background: 'rgba(61,158,106,.1)', border: '1px solid rgba(61,158,106,.18)',
                  borderRadius: 2, padding: '1px 6px',
                }}>+{changelog.length}</span>
                {lastUpdated && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)' }}>
                    {new Date(lastUpdated).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <button onClick={() => setShowChangelog(!showChangelog)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}>
                {showChangelog ? '▲ 닫기' : '▼ 변경 내역'}
              </button>
            </div>
            {showChangelog && (
              <div style={{ borderTop: '1px solid var(--wire)', padding: '8px 20px' }}>
                {changelog.map((e, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '4px 0',
                    borderBottom: i < changelog.length - 1 ? '1px solid var(--wire)' : 'none',
                  }}>
                    <span style={{ fontSize: 13 }}>{STATIC.find(c => c.id === e.countryId)?.flag}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', minWidth: 70 }}>
                      {new Date(e.date).toLocaleDateString('ko-KR')}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--t1)', flex: 1 }}>{e.policyName}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 7,
                      color: e.status === 'active' ? 'var(--green)' : 'var(--amber)',
                      border: '1px solid',
                      borderColor: e.status === 'active' ? 'rgba(61,158,106,.3)' : 'rgba(184,146,74,.3)',
                      borderRadius: 2, padding: '1px 5px',
                    }}>
                      {e.status === 'active' ? 'ACTIVE' : 'UPCOMING'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activeCountry={null} activeTheme={null} />

          <main style={{ flex: 1, background: 'var(--ink)', padding: '32px 28px 48px' }}>
            {/* Hero */}
            <div style={{ marginBottom: 36, maxWidth: 560 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)',
                letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12,
              }}>
                자산제곱 — 글로벌 정책 분석 레이더
              </div>
              <h1 style={{
                fontFamily: 'var(--font-serif)', fontSize: 40, fontWeight: 400,
                lineHeight: 1.07, color: 'var(--t1)', marginBottom: 12,
              }}>
                정책이 만드는<br />
                <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>다음 수혜주</em>
              </h1>
              <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.85, marginBottom: 20 }}>
                미국·중국·유럽·한국·일본 5개국의 핵심 정책을 분석합니다.<br />
                어떤 산업에 자금이 흐르고, 어떤 종목이 수혜를 받는지 — 큰 흐름부터 병목 수혜주까지.
              </p>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 0, border: '1px solid var(--wire)', borderRadius: 'var(--r)', overflow: 'hidden', width: 'fit-content' }}>
                {[
                  { n: total, l: '분석 정책' },
                  { n: '5개국', l: '대상 국가' },
                  { n: MACRO_THEMES.length, l: '매크로 테마' },
                  { n: '매일', l: 'AI 자동 업데이트' },
                ].map(({ n, l }, i) => (
                  <div key={i} style={{
                    padding: '10px 18px', textAlign: 'center',
                    borderRight: i < 3 ? '1px solid var(--wire)' : 'none',
                  }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--amber)', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Country grid */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
              letterSpacing: '.09em', marginBottom: 12,
            }}>COUNTRIES — {countries.length} ACTIVE</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 8, marginBottom: 40 }}>
              {countries.map(c => (
                <Link key={c.id} href={`/country/${c.id}`}>
                  <div style={{
                    background: 'var(--s1)', border: '1px solid var(--wire)',
                    borderRadius: 'var(--r)', padding: '16px', cursor: 'pointer',
                    transition: 'all .15s', borderLeft: `2px solid ${c.color}`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--s2)'; e.currentTarget.style.borderColor = c.color + '60'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--s1)'; e.currentTarget.style.borderColor = c.color; }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{c.flag}</span>
                        <div>
                          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--t1)', lineHeight: 1 }}>{c.name}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', marginTop: 3 }}>{c.tagline}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: c.color, lineHeight: 1 }}>{c.policies.length}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--t3)', marginTop: 1 }}>정책</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 10 }}>{c.summary}</p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {[...new Set(c.policies.flatMap(p => p.themes || []))].slice(0, 3).map(tid => {
                        const t = THEMES[tid];
                        return t ? (
                          <span key={tid} style={{
                            fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '.04em',
                            color: t.color, border: `1px solid ${t.color}35`,
                            borderRadius: 2, padding: '2px 5px', background: t.color + '0d',
                          }}>{t.label}</span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Macro Themes */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
              letterSpacing: '.09em', marginBottom: 12, paddingTop: 28,
              borderTop: '1px solid var(--wire)',
            }}>GLOBAL MACRO THEMES — 크로스컨트리 분석</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
              {MACRO_THEMES.map(t => (
                <Link key={t.id} href={`/theme/${t.id}`}>
                  <div style={{
                    background: 'var(--s1)', border: '1px solid var(--wire)',
                    borderRadius: 'var(--r)', padding: '14px', cursor: 'pointer',
                    transition: 'background .12s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--s1)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--t1)' }}>{t.name}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--t2)', lineHeight: 1.65, marginBottom: 8 }}>
                      {t.description.slice(0, 72)}…
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
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
