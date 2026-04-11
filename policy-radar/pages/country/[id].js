import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import Sidebar from '../../components/Sidebar';
import PolicyCard from '../../components/PolicyCard';
import Footer from '../../components/Footer';
import { COUNTRIES } from '../../data/policies';

export default function CountryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [countries, setCountries] = useState(COUNTRIES);

  useEffect(() => {
    fetch('/api/policies').then(r => r.json()).then(d => {
      if (d.countries) setCountries(d.countries);
    }).catch(() => {});
  }, []);

  const country = countries.find(c => c.id === id);

  if (!country) return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--t3)' }}>Loading...</div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{country.name} 정책 분석 — Policy Radar</title>
        <meta name="description" content={country.summary} />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />

        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activeCountry={id} activeTheme={null} />

          <main style={{ flex: 1, background: 'var(--ink)' }}>
            {/* Country header */}
            <div style={{
              borderBottom: '1px solid var(--wire)',
              padding: '20px 28px 16px',
              background: `linear-gradient(135deg, ${country.color}08 0%, transparent 50%)`,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)',
                letterSpacing: '.1em', marginBottom: 8,
              }}>
                POLICY ANALYSIS · {country.updated} 업데이트
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 5 }}>
                    <span style={{ fontSize: 32, lineHeight: 1 }}>{country.flag}</span>
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 400,
                      color: country.color, lineHeight: 1,
                    }}>{country.name}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.03em', marginBottom: 8 }}>
                    {country.tagline}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.8, maxWidth: 500 }}>{country.summary}</p>
                </div>
                <div style={{
                  display: 'flex', gap: 0,
                  border: '1px solid var(--wire)', borderRadius: 'var(--r)', overflow: 'hidden',
                  alignSelf: 'start',
                }}>
                  {[
                    { n: country.policies.length, l: '분석 정책' },
                    { n: [...new Set(country.policies.flatMap(p => p.themes || []))].length, l: '핵심 테마' },
                    { n: 'LIVE', l: '실시간 추적', col: 'var(--amber)' },
                  ].map(({ n, l, col }, i) => (
                    <div key={i} style={{
                      padding: '10px 16px', textAlign: 'center',
                      borderRight: i < 2 ? '1px solid var(--wire)' : 'none',
                    }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: col || country.color, lineHeight: 1 }}>{n}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--t3)', marginTop: 3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Policy list */}
            <div style={{ padding: '16px 28px 48px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.09em', marginBottom: 4 }}>
                POLICY ANALYSIS — {country.policies.length}개 정책
              </div>
              {country.policies.map(policy => (
                <PolicyCard key={policy.id} policy={policy} countryColor={country.color} />
              ))}
            </div>

            {/* Other countries quick nav */}
            <div style={{ borderTop: '1px solid var(--wire)', padding: '16px 28px 24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.09em', marginBottom: 10 }}>
                다른 국가 분석
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {COUNTRIES.filter(c => c.id !== id).map(c => (
                  <a key={c.id} href={`/country/${c.id}`} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 12px',
                    background: 'var(--s1)', border: '1px solid var(--wire)',
                    borderRadius: 'var(--r)', cursor: 'pointer', transition: 'all .12s',
                    textDecoration: 'none',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--s2)'; e.currentTarget.style.borderColor = c.color + '40'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--s1)'; e.currentTarget.style.borderColor = 'var(--wire)'; }}>
                    <span style={{ fontSize: 14 }}>{c.flag}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--t1)' }}>{c.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: c.color }}>{c.policies.length}</span>
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
