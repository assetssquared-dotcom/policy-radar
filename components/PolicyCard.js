import { useState } from 'react';

function ImpactDots({ value, pos }) {
  const abs = Math.abs(value);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: 1,
          background: i <= abs
            ? (pos ? 'var(--green)' : 'var(--red)')
            : 'rgba(255,255,255,0.06)',
        }} />
      ))}
    </div>
  );
}

function BarChart({ bars, color }) {
  return (
    <div>
      {bars.map((b, i) => {
        const pct = Math.round(b.value / b.max * 100);
        const display = typeof b.value === 'number' && b.value < 1
          ? b.value.toFixed(2)
          : b.value.toLocaleString();
        return (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, color: 'var(--t2)', marginBottom: 3 }}>{b.name}</div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color + '99', borderRadius: 2 }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', marginTop: 2 }}>{display}</div>
          </div>
        );
      })}
    </div>
  );
}

function Timeline({ items, color }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 5, top: 6, bottom: 0,
        width: 1, background: 'var(--wire)',
      }} />
      {items.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 11, marginBottom: i < items.length - 1 ? 9 : 0 }}>
          <div style={{
            width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
            background: i === items.length - 1 ? color : 'var(--s4)',
            border: `1px solid ${color}50`, marginTop: 1,
          }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color, marginBottom: 1 }}>{t.date}</div>
            <div style={{ fontSize: 10, color: 'var(--t2)', lineHeight: 1.45 }}>{t.event}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PolicyCard({ policy, countryColor }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = policy.status === 'active' ? 'var(--green)'
    : policy.status === 'upcoming' ? 'var(--amber)'
    : 'var(--t2)';
  const statusLabel = policy.status === 'active' ? 'ACTIVE'
    : policy.status === 'upcoming' ? 'UPCOMING'
    : 'PAUSED';

  return (
    <div style={{
      background: 'var(--s1)',
      border: '1px solid var(--wire)',
      borderRadius: 'var(--r)',
      overflow: 'hidden',
      animation: 'fadeIn .2s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 12, padding: '14px 16px 12px',
      }}>
        <div style={{ borderLeft: `2px solid ${countryColor}`, paddingLeft: 12 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 7.5, letterSpacing: '.04em',
              padding: '2px 6px', borderRadius: 2,
              color: statusColor, border: `1px solid ${statusColor}40`,
              background: statusColor === 'var(--green)' ? 'rgba(61,158,106,.1)'
                : statusColor === 'var(--amber)' ? 'rgba(184,146,74,.1)' : 'transparent',
            }}>{statusLabel}</span>
            {(policy.themes || []).map(tid => (
              <span key={tid} style={{
                fontFamily: 'var(--font-mono)', fontSize: 7.5, letterSpacing: '.04em',
                padding: '2px 6px', borderRadius: 2,
                color: 'var(--t3)', border: '1px solid var(--wire2)',
              }}>{tid.toUpperCase()}</span>
            ))}
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 400,
            color: 'var(--t1)', lineHeight: 1.25, marginBottom: 2,
          }}>{policy.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--amber)' }}>
            {policy.budget}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)' }}>{policy.date}</div>
        </div>
      </div>

      {/* Background text */}
      <div style={{ padding: '0 16px 0 30px' }}>
        <div style={{
          fontSize: 11, color: 'var(--t2)', lineHeight: 1.82,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'none' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {policy.background}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '6px 16px 10px 30px',
          fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
          background: 'none', border: 'none', cursor: 'pointer', transition: 'color .12s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t2)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}>
        <span style={{ color: countryColor }}>{expanded ? '▲' : '▼'}</span>
        <span>{expanded ? '접기' : '전체 배경 보기'}</span>
      </button>

      {/* 3-panel grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--wire)' }}>
        {/* Panel 1: Beneficiaries */}
        <div style={{ padding: '12px 14px', borderRight: '1px solid var(--wire)' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'var(--t3)',
            letterSpacing: '.09em', textTransform: 'uppercase',
            marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--wire)',
          }}>수혜 산업 매핑</div>
          {(policy.beneficiaries || []).map((b, i) => (
            <div key={i} style={{
              marginBottom: i < policy.beneficiaries.length - 1 ? 8 : 0,
              paddingBottom: i < policy.beneficiaries.length - 1 ? 8 : 0,
              borderBottom: i < policy.beneficiaries.length - 1 ? '1px solid var(--wire)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                <div style={{ fontSize: 10, color: 'var(--t1)', fontWeight: 500, lineHeight: 1.3 }}>{b.sector}</div>
                <ImpactDots value={b.impact} pos={b.pos} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t2)', marginTop: 2 }}>
                · {(b.stocks || []).slice(0, 2).join(' · ')}
              </div>
              {b.etfs && b.etfs.length > 0 && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--amber)', marginTop: 1 }}>
                  ETF {b.etfs.join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Panel 2: Chart + Risk */}
        <div style={{ padding: '12px 14px', borderRight: '1px solid var(--wire)' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'var(--t3)',
            letterSpacing: '.09em', textTransform: 'uppercase',
            marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--wire)',
          }}>규모 · 예산</div>
          <BarChart bars={policy.budgetData || []} color={countryColor} />
          {policy.risks && (
            <div style={{
              background: 'rgba(180,60,60,.04)', border: '1px solid rgba(180,60,60,.1)',
              borderRadius: 'var(--r)', padding: '8px 10px', marginTop: 10,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: '#a04040', letterSpacing: '.07em', marginBottom: 4 }}>
                RISK FACTOR
              </div>
              <div style={{ fontSize: 10, color: 'var(--t2)', lineHeight: 1.65 }}>{policy.risks}</div>
            </div>
          )}
        </div>

        {/* Panel 3: Timeline */}
        <div style={{ padding: '12px 14px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'var(--t3)',
            letterSpacing: '.09em', textTransform: 'uppercase',
            marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--wire)',
          }}>정책 타임라인</div>
          <Timeline items={policy.timeline || []} color={countryColor} />
        </div>
      </div>
    </div>
  );
}
