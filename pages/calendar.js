import Head from 'next/head';
import { useState } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { COUNTRIES } from '../data/policies';

// 전체 타임라인 이벤트 평탄화
function buildEvents() {
  const events = [];
  COUNTRIES.forEach(country => {
    country.policies.forEach(policy => {
      (policy.timeline || []).forEach(t => {
        // 날짜 파싱 시도
        const raw = t.date;
        let year = 2025, month = null, label = raw;

        const m = raw.match(/(\d{4})[.\-\/](\d{1,2})/);
        const y = raw.match(/^(\d{4})$/);
        if (m) { year = parseInt(m[1]); month = parseInt(m[2]); }
        else if (y) { year = parseInt(y[1]); }
        else if (raw.includes('2026')) year = 2026;
        else if (raw.includes('2027')) year = 2027;

        events.push({
          date: raw,
          year, month,
          event: t.event,
          policyName: policy.name,
          policyId: policy.id,
          status: policy.status,
          countryId: country.id,
          countryName: country.name,
          countryFlag: country.flag,
          countryColor: country.color,
        });
      });
    });
  });
  // 연도→월→날짜 순 정렬
  return events.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month && b.month) return a.month - b.month;
    if (a.month) return -1;
    if (b.month) return 1;
    return 0;
  });
}

const ALL_EVENTS = buildEvents();
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

export default function Calendar() {
  const [filterYear, setFilterYear] = useState(2025);
  const [filterCountry, setFilterCountry] = useState('all');

  let events = ALL_EVENTS.filter(e => e.year === filterYear);
  if (filterCountry !== 'all') events = events.filter(e => e.countryId === filterCountry);

  // 월별 그룹
  const grouped = {};
  const noMonth = [];
  events.forEach(e => {
    if (e.month) {
      if (!grouped[e.month]) grouped[e.month] = [];
      grouped[e.month].push(e);
    } else {
      noMonth.push(e);
    }
  });

  return (
    <>
      <Head>
        <title>정책 이벤트 캘린더 — Policy Radar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activePage="calendar" />
          <main style={{ flex: 1, padding: '28px 36px 48px', minWidth: 0 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.1em', marginBottom: 8 }}>정책 이벤트 캘린더</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--t1)', marginBottom: 8 }}>
                주시해야 할 정책 일정
              </h1>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7 }}>
                앞으로 예정된 정책 발효·시행·표결 일정을 시간순으로 정리했습니다.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
              {[2025, 2026, 2027].map(y => (
                <button key={y} onClick={() => setFilterYear(y)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  background: filterYear === y ? 'var(--amber)' : 'transparent',
                  color: filterYear === y ? 'var(--ink)' : 'var(--t2)',
                  border: `1px solid ${filterYear === y ? 'var(--amber)' : 'var(--wire2)'}`,
                  borderRadius: 4, padding: '6px 14px', cursor: 'pointer',
                }}>{y}년</button>
              ))}
              <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--s2)', border: '1px solid var(--wire2)', borderRadius: 4, padding: '6px 10px', color: 'var(--t1)', outline: 'none', marginLeft: 8 }}>
                <option value="all">전체 국가</option>
                {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => {
                const monthEvents = grouped[month] || [];
                if (monthEvents.length === 0) return null;
                return (
                  <div key={month} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', marginBottom: 8 }}>
                    {/* Month label */}
                    <div style={{
                      fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--amber)',
                      paddingTop: 12, paddingRight: 16, textAlign: 'right', lineHeight: 1,
                    }}>
                      {MONTHS[month-1]}
                    </div>
                    {/* Events */}
                    <div style={{
                      borderLeft: '1px solid var(--wire2)',
                      paddingLeft: 20, paddingBottom: 16,
                      display: 'flex', flexDirection: 'column', gap: 8,
                      paddingTop: 8,
                    }}>
                      {monthEvents.map((e, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12,
                          position: 'relative',
                        }}>
                          {/* dot */}
                          <div style={{
                            position: 'absolute', left: -24, top: 6,
                            width: 9, height: 9, borderRadius: '50%',
                            background: e.countryColor,
                            border: `2px solid var(--ink)`,
                          }} />
                          {/* Country flag */}
                          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{e.countryFlag}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: 8,
                                color: e.status === 'active' ? '#3d9e6a' : '#b8924a',
                                border: `1px solid ${e.status === 'active' ? 'rgba(61,158,106,.3)' : 'rgba(184,146,74,.3)'}`,
                                borderRadius: 2, padding: '1px 5px',
                              }}>{e.status === 'active' ? 'ACTIVE' : 'UPCOMING'}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: e.countryColor }}>{e.date}</span>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 500, marginBottom: 2 }}>{e.event}</div>
                            <div style={{ fontSize: 11, color: 'var(--t2)' }}>{e.policyName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Year-only events (no specific month) */}
              {noMonth.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', marginTop: 8 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--t3)', paddingTop: 12, paddingRight: 16, textAlign: 'right' }}>연중</div>
                  <div style={{ borderLeft: '1px solid var(--wire)', paddingLeft: 20, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {noMonth.map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: -24, top: 6, width: 7, height: 7, borderRadius: '50%', background: e.countryColor, border: '2px solid var(--ink)' }} />
                        <span style={{ fontSize: 13, flexShrink: 0 }}>{e.countryFlag}</span>
                        <div>
                          <div style={{ fontSize: 13, color: 'var(--t1)', marginBottom: 2 }}>{e.event}</div>
                          <div style={{ fontSize: 11, color: 'var(--t2)' }}>{e.policyName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--t3)', padding: '40px 0', textAlign: 'center' }}>
                  {filterYear}년 이벤트가 없습니다
                </div>
              )}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
