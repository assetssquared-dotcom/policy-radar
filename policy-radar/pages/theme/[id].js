import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from '../../components/Nav';
import Sidebar from '../../components/Sidebar';
import PolicyCard from '../../components/PolicyCard';
import Footer from '../../components/Footer';
import { MACRO_THEMES, COUNTRIES } from '../../data/policies';

export default function ThemePage() {
  const { id } = useRouter().query;
  const theme = MACRO_THEMES.find(t => t.id === id);

  if (!theme) return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--t3)' }}>Loading...</div>
    </div>
  );

  const relatedCountries = COUNTRIES.filter(c => (theme.countries || []).includes(c.id));
  const relatedPolicies = relatedCountries.flatMap(c =>
    c.policies
      .filter(p => (theme.relatedPolicies || []).includes(p.id))
      .map(p => ({ ...p, country: c }))
  );

  return (
    <>
      <Head>
        <title>{theme.name} — Policy Radar</title>
        <meta name="description" content={theme.description} />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />

        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activeCountry={null} activeTheme={id} />

          <main style={{ flex: 1, background: 'var(--ink)' }}>
            {/* Theme header */}
            <div style={{ borderBottom: '1px solid var(--wire)', padding: '24px 28px 20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.1em', marginBottom: 10 }}>
                MACRO THEME ANALYSIS
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.color, flexShrink: 0 }} />
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--t1)' }}>
                  {theme.name}
                </h1>
              </div>
              <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.85, maxWidth: 560, marginBottom: 14 }}>
                {theme.description}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {relatedCountries.map(c => (
                  <Link key={c.id} href={`/country/${c.id}`}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '6px 10px',
                      background: 'var(--s1)', border: `1px solid ${c.color}30`,
                      borderRadius: 'var(--r)', cursor: 'pointer', transition: 'background .12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--s1)'}>
                      <span style={{ fontSize: 14 }}>{c.flag}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--t1)' }}>{c.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related policies */}
            <div style={{ padding: '16px 28px 48px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.09em', marginBottom: 4 }}>
                RELATED POLICIES — {relatedPolicies.length}개
              </div>
              {relatedPolicies.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--t2)', padding: '20px 0' }}>
                  관련 정책이 없습니다.
                </div>
              )}
              {relatedPolicies.map((policy, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{policy.country.flag}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)' }}>{policy.country.name}</span>
                  </div>
                  <PolicyCard policy={policy} countryColor={policy.country.color} />
                </div>
              ))}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
