import { useState } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { COUNTRIES, THEMES } from '../data/policies';

// 전체 수혜주 데이터 평탄화
function buildScreenerData() {
  const rows = [];
  COUNTRIES.forEach(country => {
    country.policies.forEach(policy => {
      (policy.beneficiaries || []).forEach(b => {
        (b.stocks || []).forEach(stock => {
          rows.push({
            stock,
            sector: b.sector,
            impact: b.impact,
            pos: b.pos,
            etfs: b.etfs || [],
            policyName: policy.name,
            policyId: policy.id,
            themes: policy.themes || [],
            countryId: country.id,
            countryName: country.name,
            countryFlag: country.flag,
            countryColor: country.color,
            status: policy.status,
          });
        });
      });
    });
  });
  // 중복 제거 (같은 종목+국가)
  const seen = new Set();
  return rows.filter(r => {
    const key = r.stock + r.countryId + r.policyId;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const ALL_DATA = buildScreenerData();

const IMPACT_COLORS = {
  5: '#3d9e6a', 4: '#5ab87a', 3: '#7dd4a0',
  '-3': '#c87070', '-4': '#b84a4a', '-5': '#a03030',
};

function ImpactBar({ value, pos }) {
  const abs = Math.abs(value);
  const col = pos ? '#3d9e6a' : '#b84a4a';
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: 1,
          background: i <= abs ? col : 'rgba(255,255,255,0.07)',
        }} />
      ))}
    </div>
  );
}

export default function Screener() {
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterTheme, setFilterTheme] = useState('all');
  const [filterImpact, setFilterImpact] = useState('all');
  const [sort, setSort] = useState('impact');
  const [search, setSearch] = useState('');

  let data = ALL_DATA;

  if (filterCountry !== 'all') data = data.filter(r => r.countryId === filterCountry);
  if (filterTheme !== 'all') data = data.filter(r => r.themes.includes(filterTheme));
  if (filterImpact === 'positive') data = data.filter(r => r.pos && r.impact >= 3);
  if (filterImpact === 'risk') data = data.filter(r => !r.pos);
  if (search) data = data.filter(r =>
    r.stock.toLowerCase().includes(search.toLowerCase()) ||
    r.sector.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === 'impact') data = [...data].sort((a, b) => (b.pos ? b.impact : -b.impact) - (a.pos ? a.impact : -a.impact));
  if (sort === 'country') data = [...data].sort((a, b) => a.countryId.localeCompare(b.countryId));
  if (sort === 'sector') data = [...data].sort((a, b) => a.sector.localeCompare(b.sector));

  return (
    <>
      <Head>
        <title>수혜주 스크리너 — Policy Radar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activePage="screener" />
          <main style={{ flex: 1, padding: '28px 36px 48px', minWidth: 0 }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.1em', marginBottom: 8 }}>수혜주 스크리너</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--t1)', marginBottom: 8 }}>
                정책 수혜주 전체 조회
              </h1>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7 }}>
                5개국 {data.length}개 종목 · 테마·국가·수혜도별 필터링
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
              {/* Search */}
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="종목명 / 섹터 검색..."
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  background: 'var(--s2)', border: '1px solid var(--wire2)',
                  borderRadius: 4, padding: '6px 12px', color: 'var(--t1)',
                  outline: 'none', width: 180,
                }}
              />
              {/* Country filter */}
              <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--s2)', border: '1px solid var(--wire2)', borderRadius: 4, padding: '6px 10px', color: 'var(--t1)', outline: 'none' }}>
                <option value="all">전체 국가</option>
                {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
              </select>
              {/* Theme filter */}
              <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--s2)', border: '1px solid var(--wire2)', borderRadius: 4, padding: '6px 10px', color: 'var(--t1)', outline: 'none' }}>
                <option value="all">전체 테마</option>
                {Object.values(THEMES).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              {/* Impact filter */}
              {[
                { val: 'all', label: '전체' },
                { val: 'positive', label: '수혜주만' },
                { val: 'risk', label: '리스크만' },
              ].map(f => (
                <button key={f.val} onClick={() => setFilterImpact(f.val)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  background: filterImpact === f.val ? 'var(--amber)' : 'transparent',
                  color: filterImpact === f.val ? 'var(--ink)' : 'var(--t2)',
                  border: `1px solid ${filterImpact === f.val ? 'var(--amber)' : 'var(--wire2)'}`,
                  borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
                }}>{f.label}</button>
              ))}
              {/* Sort */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>정렬</span>
                {[
                  { val: 'impact', label: '수혜도' },
                  { val: 'country', label: '국가' },
                  { val: 'sector', label: '섹터' },
                ].map(s => (
                  <button key={s.val} onClick={() => setSort(s.val)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    background: sort === s.val ? 'var(--s3)' : 'transparent',
                    color: sort === s.val ? 'var(--t1)' : 'var(--t3)',
                    border: `1px solid ${sort === s.val ? 'var(--wire2)' : 'var(--wire)'}`,
                    borderRadius: 3, padding: '4px 8px', cursor: 'pointer',
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ border: '1px solid var(--wire)', borderRadius: 4, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 80px 1fr 1.5fr 1fr',
                gap: 0, background: 'var(--s2)',
                borderBottom: '1px solid var(--wire)',
                padding: '8px 16px',
              }}>
                {['종목', '섹터', '수혜도', '관련 정책', 'ETF', '국가'].map(h => (
                  <div key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--t3)', letterSpacing: '.08em' }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {data.slice(0, 80).map((r, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 80px 1fr 1.5fr 1fr',
                  gap: 0, padding: '10px 16px',
                  borderBottom: i < data.length - 1 ? '1px solid var(--wire)' : 'none',
                  background: i % 2 === 0 ? 'var(--s1)' : 'var(--ink)',
                  transition: 'background .1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--s1)' : 'var(--ink)'}>
                  {/* 종목 */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--t1)', fontWeight: 500 }}>{r.stock}</div>
                  </div>
                  {/* 섹터 */}
                  <div style={{ fontSize: 11, color: 'var(--t2)', alignSelf: 'center' }}>{r.sector}</div>
                  {/* 수혜도 */}
                  <div style={{ alignSelf: 'center' }}>
                    <ImpactBar value={r.impact} pos={r.pos} />
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: r.pos ? '#3d9e6a' : '#b84a4a', marginTop: 2 }}>
                      {r.pos ? `+${r.impact}` : r.impact}
                    </div>
                  </div>
                  {/* 관련 정책 */}
                  <div style={{ fontSize: 10, color: 'var(--t2)', alignSelf: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.policyName.length > 20 ? r.policyName.slice(0, 20) + '…' : r.policyName}
                  </div>
                  {/* ETF */}
                  <div style={{ alignSelf: 'center' }}>
                    {r.etfs.slice(0, 3).map(e => (
                      <span key={e} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9,
                        color: 'var(--amber)', background: 'rgba(184,146,74,.1)',
                        border: '1px solid rgba(184,146,74,.2)',
                        borderRadius: 2, padding: '1px 5px', marginRight: 3,
                        display: 'inline-block', marginBottom: 2,
                      }}>{e}</span>
                    ))}
                  </div>
                  {/* 국가 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'center' }}>
                    <span style={{ fontSize: 14 }}>{r.countryFlag}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: r.countryColor }}>{r.countryName}</span>
                  </div>
                </div>
              ))}
            </div>

            {data.length > 80 && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)', marginTop: 12, textAlign: 'center' }}>
                상위 80개 표시 중 · 전체 {data.length}개
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
