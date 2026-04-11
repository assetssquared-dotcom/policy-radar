import Head from 'next/head';
import { useState } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { COUNTRIES, THEMES } from '../data/policies';

const SECTORS = [
  { id: 'semiconductor', label: '반도체·AI칩' },
  { id: 'ai_policy',     label: 'AI 정책' },
  { id: 'defense',       label: '방산' },
  { id: 'energy_transition', label: '에너지 전환' },
  { id: 'nuclear',       label: '원전·SMR' },
  { id: 'dollar_hegemony', label: '달러 패권' },
  { id: 'stablecoin',    label: '스테이블코인' },
  { id: 'reshoring',     label: '리쇼어링·관세' },
  { id: 'yuan_intl',     label: '위안화 국제화' },
  { id: 'critical_minerals', label: '희귀광물' },
  { id: 'supply_chain',  label: '공급망 재편' },
  { id: 'debt_fiscal',   label: '재정·부채' },
  { id: 'real_estate',   label: '부동산·내수' },
];

// 국가 × 섹터 intensity 계산
function buildMatrix() {
  const matrix = {};
  COUNTRIES.forEach(c => {
    matrix[c.id] = {};
    SECTORS.forEach(s => {
      const policies = c.policies.filter(p => (p.themes || []).includes(s.id));
      const score = policies.length * 2 + policies.reduce((sum, p) => {
        const bens = (p.beneficiaries || []).filter(b => b.pos);
        return sum + bens.reduce((s2, b) => s2 + b.impact, 0) * 0.3;
      }, 0);
      matrix[c.id][s.id] = { score: Math.min(Math.round(score), 10), count: policies.length, policies };
    });
  });
  return matrix;
}

const MATRIX = buildMatrix();

function cellColor(score) {
  if (score === 0) return 'rgba(255,255,255,0.03)';
  if (score <= 2) return 'rgba(184,146,74,0.12)';
  if (score <= 4) return 'rgba(184,146,74,0.25)';
  if (score <= 6) return 'rgba(184,146,74,0.42)';
  if (score <= 8) return 'rgba(184,146,74,0.62)';
  return 'rgba(184,146,74,0.85)';
}
function textColor(score) {
  if (score === 0) return 'var(--t3)';
  if (score <= 3) return 'rgba(184,146,74,0.7)';
  return score >= 7 ? 'var(--ink)' : 'var(--amber)';
}

export default function Heatmap() {
  const [hover, setHover] = useState(null);

  const hovered = hover ? MATRIX[hover.country]?.[hover.sector] : null;

  return (
    <>
      <Head>
        <title>정책 강도 히트맵 — Policy Radar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activePage="heatmap" />
          <main style={{ flex: 1, padding: '28px 36px 48px', minWidth: 0 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.1em', marginBottom: 8 }}>정책 강도 히트맵</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--t1)', marginBottom: 8 }}>
                국가 × 섹터 정책 집중도
              </h1>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7 }}>
                어느 국가가 어느 섹터에 정책 화력을 집중하고 있는지 한눈에. 셀 클릭시 관련 정책 확인.
              </p>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>강도</span>
              {[0, 2, 4, 6, 8, 10].map(v => (
                <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 28, height: 18, background: cellColor(v), border: '1px solid var(--wire)', borderRadius: 2 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)' }}>{v}</span>
                </div>
              ))}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)', marginLeft: 8 }}>← 낮음 / 높음 →</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px', overflowX: 'auto' }}>
              {/* Heatmap grid */}
              <div style={{ display: 'grid', gridTemplateColumns: `140px repeat(${COUNTRIES.length}, 1fr)`, gap: 1, minWidth: 700 }}>
                {/* Header row */}
                <div style={{ padding: '8px 12px' }} />
                {COUNTRIES.map(c => (
                  <div key={c.id} style={{ padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>{c.flag}</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 12, color: c.color }}>{c.name}</div>
                  </div>
                ))}

                {/* Data rows */}
                {SECTORS.map(s => (
                  <>
                    <div key={s.id + '_label'} style={{
                      padding: '10px 12px', display: 'flex', alignItems: 'center',
                      borderTop: '1px solid var(--wire)',
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t2)' }}>{s.label}</span>
                    </div>
                    {COUNTRIES.map(c => {
                      const cell = MATRIX[c.id][s.id];
                      const isHover = hover?.country === c.id && hover?.sector === s.id;
                      return (
                        <div
                          key={c.id + s.id}
                          onMouseEnter={() => setHover({ country: c.id, sector: s.id })}
                          onMouseLeave={() => setHover(null)}
                          style={{
                            background: isHover ? 'rgba(255,255,255,0.12)' : cellColor(cell.score),
                            border: isHover ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,0.04)',
                            cursor: cell.count > 0 ? 'pointer' : 'default',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '10px 4px', transition: 'all .12s', minHeight: 48,
                          }}
                        >
                          {cell.count > 0 ? (
                            <>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: textColor(cell.score), lineHeight: 1 }}>{cell.score}</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: textColor(cell.score), opacity: .7, marginTop: 2 }}>{cell.count}개</div>
                            </>
                          ) : (
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>—</div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>

            {/* Hover detail */}
            {hover && hovered && hovered.count > 0 && (
              <div style={{
                marginTop: 24, padding: '16px 20px',
                background: 'var(--s1)', border: '1px solid var(--wire2)',
                borderRadius: 4, animation: 'fadeIn .15s ease',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', marginBottom: 10 }}>
                  {COUNTRIES.find(c => c.id === hover.country)?.flag} {COUNTRIES.find(c => c.id === hover.country)?.name} ·{' '}
                  {SECTORS.find(s => s.id === hover.sector)?.label} · 강도 {hovered.score}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {hovered.policies.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 8,
                        color: p.status === 'active' ? '#3d9e6a' : '#b8924a',
                        border: `1px solid ${p.status === 'active' ? 'rgba(61,158,106,.3)' : 'rgba(184,146,74,.3)'}`,
                        borderRadius: 2, padding: '1px 5px',
                      }}>{p.status === 'active' ? 'ACTIVE' : 'UPCOMING'}</span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--t1)' }}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </>
  );
}
