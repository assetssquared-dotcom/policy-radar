import Head from 'next/head';
import { useState } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const FLOWS = [
  {
    id: 'dollar_ai',
    title: '달러 패권 → AI 패권 연결',
    color: '#4a7fd4',
    steps: [
      { id: 1, label: '달러 패권 위기', sub: '위안화 국제화 · 페트로위안', color: '#b84a4a', type: 'threat' },
      { id: 2, label: 'GENIUS Act', sub: '스테이블코인 법제화', color: '#4a7fd4', type: 'policy' },
      { id: 3, label: '미국 국채 수요 ↑', sub: '스테이블코인 준비자산', color: '#3d9e6a', type: 'effect' },
      { id: 4, label: 'Stargate AI 투자', sub: '5,000억 달러', color: '#4a7fd4', type: 'policy' },
      { id: 5, label: 'AI 인프라 달러 결제', sub: '글로벌 AI 서비스 = 달러', color: '#3d9e6a', type: 'effect' },
      { id: 6, label: '달러 패권 강화', sub: '디지털·AI 시대의 달러', color: '#4a7fd4', type: 'outcome' },
    ],
    beneficiaries: ['코인베이스(COIN)', '엔비디아(NVDA)', 'SK하이닉스(000660)', '미국 국채'],
    risks: ['중국 AI 자립(DeepSeek) 가속화', '유럽 MiCA·디지털유로 대항'],
  },
  {
    id: 'hbm_chokepoint',
    title: '반도체 병목 — HBM이 AI의 급소',
    color: '#c9a83a',
    steps: [
      { id: 1, label: 'AI 수요 폭증', sub: 'GPT·Claude·Gemini 경쟁', color: '#7a7ad4', type: 'trigger' },
      { id: 2, label: 'GPU 수요 → HBM 필수', sub: 'H100/B200 메모리', color: '#c9a83a', type: 'effect' },
      { id: 3, label: 'SK하이닉스·삼성 독점', sub: '글로벌 점유율 95%+', color: '#c9a83a', type: 'chokepoint' },
      { id: 4, label: '미국 대중 HBM 수출통제', sub: '중국 AI 자립 봉쇄', color: '#4a7fd4', type: 'policy' },
      { id: 5, label: '화웨이 어센드 병목', sub: 'HBM 없이 AI칩 불가', color: '#b84a4a', type: 'effect' },
      { id: 6, label: '한국 반도체 전략 자산화', sub: '미·중 사이 레버리지', color: '#c9a83a', type: 'outcome' },
    ],
    beneficiaries: ['SK하이닉스(000660)', '삼성전자(005930)', '한미반도체(042700)', 'SMH ETF'],
    risks: ['중국 CXMT 추격', '삼성 VEU 자격 만료(2025.12)', '미국 추가 수출통제'],
  },
  {
    id: 'kdefense_cycle',
    title: 'K-방산 2차 성장 사이클',
    color: '#6e8fa8',
    steps: [
      { id: 1, label: '러-우 전쟁 장기화', sub: '유럽 안보 위기 고조', color: '#b84a4a', type: 'trigger' },
      { id: 2, label: '트럼프 NATO 압박', sub: 'GDP 5% 분담금 요구', color: '#4a7fd4', type: 'policy' },
      { id: 3, label: 'EU ReArm 8,000억 유로', sub: '유럽 자체 국방비 급증', color: '#3a9e7a', type: 'policy' },
      { id: 4, label: 'K-방산 가성비 선택', sub: '서방 대비 30~40% 저렴', color: '#6e8fa8', type: 'effect' },
      { id: 5, label: '폴란드·루마니아·중동 수주', sub: '2차 대형 계약 진행 중', color: '#6e8fa8', type: 'effect' },
      { id: 6, label: '2030년 방산 500억 달러', sub: '세계 3위 수출국 목표', color: '#6e8fa8', type: 'outcome' },
    ],
    beneficiaries: ['한화에어로(012450)', 'LIG넥스원(079550)', 'KAI(047810)', '한화오션(042660)'],
    risks: ['납기 지연 리스크', '유럽 자국 방산 육성 시 경쟁 심화', '원화 강세'],
  },
  {
    id: 'petrodollar_crack',
    title: '페트로달러 균열 — 원유 결제 통화 전쟁',
    color: '#e07b3a',
    steps: [
      { id: 1, label: '1973년 페트로달러 체계', sub: '원유 = 달러 결제', color: '#4a7fd4', type: 'base' },
      { id: 2, label: '사우디 페트로위안 합의', sub: '2023년 시진핑-빈살만', color: '#b84a4a', type: 'threat' },
      { id: 3, label: 'BRICS 결제 플랫폼(mBridge)', sub: '달러 대안 인프라 구축', color: '#b84a4a', type: 'threat' },
      { id: 4, label: '미국 LNG 수출 확대', sub: 'LNG = 달러 결제 에너지', color: '#4a7fd4', type: 'policy' },
      { id: 5, label: 'EU·일본 LNG 구매 약속', sub: '관세 협상 카드로 활용', color: '#4a7fd4', type: 'effect' },
      { id: 6, label: '원유→LNG 달러 패권 이전', sub: '페트로달러의 현대적 변형', color: '#e07b3a', type: 'outcome' },
    ],
    beneficiaries: ['셰니어에너지(LNG)', 'EQT(EQT)', '금(GLD)', '달러 인덱스(DXY)'],
    risks: ['사우디의 추가 탈달러 행보', 'BRICS 통화 현실화 속도', '중동 지정학 변수'],
  },
];

const TYPE_STYLES = {
  trigger:    { border: '#b84a4a', label: 'TRIGGER' },
  threat:     { border: '#b84a4a', label: 'THREAT'  },
  base:       { border: '#4a4a4a', label: 'BASE'    },
  policy:     { border: '#4a7fd4', label: 'POLICY'  },
  chokepoint: { border: '#c9a83a', label: 'CHOKE'   },
  effect:     { border: '#3d9e6a', label: 'EFFECT'  },
  outcome:    { border: '#b8924a', label: 'OUTCOME' },
};

export default function Flow() {
  const [active, setActive] = useState('dollar_ai');
  const flow = FLOWS.find(f => f.id === active);

  return (
    <>
      <Head>
        <title>정책 연결고리 맵 — Policy Radar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activePage="flow" />
          <main style={{ flex: 1, padding: '28px 36px 48px', minWidth: 0 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.1em', marginBottom: 8 }}>정책 연결고리 맵</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--t1)', marginBottom: 8 }}>
                정책은 어떻게 연결되는가
              </h1>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7 }}>
                개별 정책을 넘어 큰 흐름의 인과관계를 추적합니다.
              </p>
            </div>

            {/* Flow selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
              {FLOWS.map(f => (
                <button key={f.id} onClick={() => setActive(f.id)} style={{
                  fontFamily: 'var(--font-sans)', fontSize: 12,
                  background: active === f.id ? f.color + '22' : 'transparent',
                  color: active === f.id ? 'var(--t1)' : 'var(--t2)',
                  border: `1px solid ${active === f.id ? f.color : 'var(--wire2)'}`,
                  borderRadius: 4, padding: '7px 14px', cursor: 'pointer',
                  transition: 'all .15s',
                }}>{f.title}</button>
              ))}
            </div>

            {flow && (
              <div style={{ animation: 'fadeIn .2s ease' }}>
                {/* Flow diagram */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  marginBottom: 32, overflowX: 'auto', paddingBottom: 8,
                }}>
                  {flow.steps.map((step, i) => {
                    const ts = TYPE_STYLES[step.type];
                    return (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        {/* Node */}
                        <div style={{
                          width: 140, padding: '12px 14px',
                          background: 'var(--s2)',
                          border: `1px solid ${ts.border}50`,
                          borderTop: `2px solid ${ts.border}`,
                          borderRadius: 4,
                          position: 'relative',
                        }}>
                          <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: 7.5,
                            color: ts.border, letterSpacing: '.07em', marginBottom: 5,
                          }}>{ts.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--t1)', fontWeight: 500, lineHeight: 1.3, marginBottom: 3 }}>{step.label}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--t2)', lineHeight: 1.5 }}>{step.sub}</div>
                        </div>
                        {/* Arrow */}
                        {i < flow.steps.length - 1 && (
                          <div style={{
                            display: 'flex', alignItems: 'center',
                            padding: '0 4px', flexShrink: 0,
                          }}>
                            <div style={{ width: 20, height: 1, background: 'var(--wire2)' }} />
                            <div style={{
                              width: 0, height: 0,
                              borderTop: '4px solid transparent',
                              borderBottom: '4px solid transparent',
                              borderLeft: `6px solid var(--wire2)`,
                            }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Step number labels */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 28, overflowX: 'auto' }}>
                  {flow.steps.map((step, i) => (
                    <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 140, flexShrink: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9,
                        color: flow.color, background: flow.color + '15',
                        border: `1px solid ${flow.color}30`,
                        borderRadius: 2, padding: '2px 8px',
                      }}>STEP {i + 1}</div>
                    </div>
                  ))}
                </div>

                {/* Beneficiaries + Risks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{
                    background: 'var(--s1)', border: '1px solid var(--wire)',
                    borderLeft: '2px solid #3d9e6a', borderRadius: 4, padding: '14px 16px',
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3d9e6a', letterSpacing: '.08em', marginBottom: 10 }}>이 흐름의 수혜주</div>
                    {flow.beneficiaries.map((b, i) => (
                      <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', lineHeight: 1.9 }}>→ {b}</div>
                    ))}
                  </div>
                  <div style={{
                    background: 'var(--s1)', border: '1px solid var(--wire)',
                    borderLeft: '2px solid #b84a4a', borderRadius: 4, padding: '14px 16px',
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#b84a4a', letterSpacing: '.08em', marginBottom: 10 }}>이 흐름의 리스크</div>
                    {flow.risks.map((r, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.9 }}>· {r}</div>
                    ))}
                  </div>
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
