import Head from 'next/head';
import { useState } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const RISKS = [
  {
    id: 'tariff_escalation',
    level: 5,
    title: '미-중 관세 협상 결렬',
    category: '지정학',
    probability: '중간',
    impact: '극대',
    timeline: '2025년 2분기~3분기',
    desc: '90일 유예 기간(2025.04.09~07.08) 내 합의 실패 시 중국에 145% 관세 유지. 중국의 보복 조치(희귀광물 전면 수출 금지, 미국 국채 매각)로 글로벌 공급망 대혼란 가능성.',
    affected: ['반도체 공급망', '한국 수출 기업', '미국 인플레이션', '글로벌 주식시장'],
    hedge: ['금(GLD)', '달러 인버스(UDN)', '국내 방산주', '미국 에너지(XLE)'],
    color: '#b84a4a',
  },
  {
    id: 'boj_shock',
    level: 4,
    title: 'BOJ 급격한 금리 인상 → 엔 캐리 청산',
    category: '통화',
    probability: '중간',
    impact: '대',
    timeline: '2025년 2분기~4분기',
    desc: '2024년 8월처럼 BOJ가 예상을 뛰어넘는 금리 인상 시 전 세계 엔 캐리 트레이드(추정 수백조 엔 규모) 일시 청산. 닛케이·코스피·나스닥 동반 급락 가능성. VIX 50 이상 시나리오.',
    affected: ['일본 수출주(토요타 등)', '코스피', '나스닥 성장주', '신흥국 자산'],
    hedge: ['엔화 선물(FXY)', '금(GLD)', '달러 현금', '미국 단기채(SHY)'],
    color: '#b87030',
  },
  {
    id: 'ai_bubble',
    level: 4,
    title: 'AI 버블 붕괴 — 데이터센터 과잉 투자',
    category: 'AI·기술',
    probability: '중간',
    impact: '대',
    timeline: '2025년 하반기~2026년',
    desc: 'Stargate 5,000억 달러 투자 중 실제 AI 수요가 기대에 미치지 못할 경우. 딥시크 효율화로 GPU 수요 과잉 예측 노출. 엔비디아 주가 40% 조정 시 반도체 전체 하락 연쇄.',
    affected: ['엔비디아(NVDA)', 'SK하이닉스 HBM', '데이터센터 리츠', '클라우드 빅테크'],
    hedge: ['인버스 반도체(SOXS)', '가치주 로테이션', '방산·에너지 비중 확대'],
    color: '#7a7ad4',
  },
  {
    id: 'taiwan_strait',
    level: 4,
    title: '대만해협 긴장 고조',
    category: '지정학',
    probability: '낮음',
    impact: '극대',
    timeline: '상시 모니터링',
    desc: '가능성은 낮지만 발생 시 반도체 공급망(TSMC) 완전 중단으로 글로벌 경제 충격. 한국 HBM 대체 수요 급증 가능하지만 지정학 리스크 프리미엄이 먼저 작용.',
    affected: ['TSMC', '글로벌 반도체', '애플 공급망', '대만 관련 ETF'],
    hedge: ['미국 방산(ITA)', '국내 방산주', '금(GLD)', '에너지(XLE)'],
    color: '#b84a4a',
  },
  {
    id: 'korea_political',
    level: 3,
    title: '한국 정치 불확실성 — 정권 교체 후 정책 변화',
    category: '정치',
    probability: '높음',
    impact: '중간',
    timeline: '2025년 3분기',
    desc: '탄핵 인용 후 조기 대선. 진보 정권 집권 시 밸류업·원전 수출 정책 연속성 불확실. 방산 예산 조정 가능성. 외국인 수급 관망 모드 연장.',
    affected: ['밸류업 수혜 금융주', '원전 관련주', '코스피 외국인 수급'],
    hedge: ['환헤지 ETF', '방산주 비중 조절', '내수 소비재 관심'],
    color: '#c9a83a',
  },
  {
    id: 'china_deflation',
    level: 3,
    title: '중국 디플레이션 장기화',
    category: '경제',
    probability: '높음',
    impact: '중간',
    timeline: '2025~2026년',
    desc: '부동산 위기 + 청년 실업 + 소비 침체의 복합 침체. 중국의 EV·배터리·철강 과잉 생산으로 글로벌 가격 하락 압박 지속. 한국 대중 수출 감소 구조화.',
    affected: ['한국 철강(포스코)', '배터리(LG에너지솔루션)', '화학·소재', '글로벌 명품'],
    hedge: ['중국 제외 신흥국(EEM vs MCHI)', '베트남·인도 대체'],
    color: '#b84a4a',
  },
  {
    id: 'rare_earth_embargo',
    level: 3,
    title: '중국 희귀광물 전면 수출 금지',
    category: '공급망',
    probability: '중간',
    impact: '대',
    timeline: '관세 협상 결렬 시',
    desc: '갈륨·게르마늄·희토류의 단계적 통제를 넘어 전면 수출 금지 시 서방 반도체·방산·EV 공급망 타격. 대안 공급망 구축까지 3~5년. 단기 희귀광물 관련주 급등.',
    affected: ['반도체 장비', '방산 소재', 'EV 배터리', '풍력·태양광'],
    hedge: ['MP머티리얼즈(MP)', '라이너스(LYC.AX)', '희귀광물 ETF(REMX)'],
    color: '#b5936e',
  },
  {
    id: 'us_fiscal',
    level: 3,
    title: '미국 재정 위기 — 부채한도 협상 결렬',
    category: '재정',
    probability: '낮음',
    impact: '극대',
    timeline: '2025년 하반기',
    desc: 'DOGE 감축 효과 미미 + 감세 법안으로 재정 적자 확대 → 신용등급 하락 시 미국 국채 투매. 달러 약세 가속. 가능성은 낮지만 발생 시 모든 자산 동반 하락.',
    affected: ['미국 장기채(TLT)', '달러 인덱스', '글로벌 주식', '신흥국'],
    hedge: ['금(GLD)', '스위스 프랑', '실물 자산', '단기 국채'],
    color: '#c4a1e8',
  },
];

const PROB_CONFIG = {
  '높음':  { color: '#b84a4a', bg: 'rgba(184,74,74,.1)'  },
  '중간':  { color: '#b8924a', bg: 'rgba(184,146,74,.1)' },
  '낮음':  { color: '#3d9e6a', bg: 'rgba(61,158,106,.1)' },
};

export default function Risk() {
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(RISKS.map(r => r.category))];
  const filtered = filter === 'all' ? RISKS : RISKS.filter(r => r.category === filter);
  const sorted = [...filtered].sort((a, b) => b.level - a.level);

  return (
    <>
      <Head>
        <title>리스크 레이더 — Policy Radar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activePage="risk" />
          <main style={{ flex: 1, padding: '28px 36px 48px', minWidth: 0 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.1em', marginBottom: 8 }}>리스크 레이더</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--t1)', marginBottom: 8 }}>
                지금 가장 모니터링해야 할 리스크
              </h1>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7 }}>
                발생 가능성 × 충격 규모 기준으로 정렬. 각 리스크별 헤지 전략 포함.
              </p>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  background: filter === cat ? 'var(--amber)' : 'transparent',
                  color: filter === cat ? 'var(--ink)' : 'var(--t2)',
                  border: `1px solid ${filter === cat ? 'var(--amber)' : 'var(--wire2)'}`,
                  borderRadius: 4, padding: '5px 12px', cursor: 'pointer',
                }}>{cat === 'all' ? '전체' : cat}</button>
              ))}
            </div>

            {/* Risk cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map(risk => {
                const prob = PROB_CONFIG[risk.probability];
                return (
                  <div key={risk.id} style={{
                    background: 'var(--s1)', border: '1px solid var(--wire)',
                    borderRadius: 4, overflow: 'hidden',
                    borderLeft: `3px solid ${risk.color}`,
                  }}>
                    {/* Header */}
                    <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--wire)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Risk level dots */}
                          <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                            {[1,2,3,4,5].map(i => (
                              <div key={i} style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: i <= risk.level ? risk.color : 'rgba(255,255,255,0.07)',
                              }} />
                            ))}
                          </div>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--t1)', lineHeight: 1.2 }}>
                            {risk.title}
                          </h3>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 8,
                            color: prob.color, background: prob.bg,
                            border: `1px solid ${prob.color}40`,
                            borderRadius: 2, padding: '2px 7px',
                          }}>확률 {risk.probability}</span>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 8,
                            color: 'var(--t2)', background: 'rgba(255,255,255,.04)',
                            border: '1px solid var(--wire2)',
                            borderRadius: 2, padding: '2px 7px',
                          }}>충격 {risk.impact}</span>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 8,
                            color: 'var(--t3)',
                          }}>{risk.category}</span>
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: risk.color, marginBottom: 8 }}>⏱ {risk.timeline}</div>
                      <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.8 }}>{risk.desc}</p>
                    </div>

                    {/* Affected + Hedge */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--wire)' }}>
                      <div style={{ padding: '10px 16px', borderRight: '1px solid var(--wire)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#b84a4a', letterSpacing: '.07em', marginBottom: 7 }}>영향 자산</div>
                        {risk.affected.map((a, i) => (
                          <div key={i} style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.7 }}>· {a}</div>
                        ))}
                      </div>
                      <div style={{ padding: '10px 16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#3d9e6a', letterSpacing: '.07em', marginBottom: 7 }}>헤지 전략</div>
                        {risk.hedge.map((h, i) => (
                          <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', lineHeight: 1.8 }}>→ {h}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
