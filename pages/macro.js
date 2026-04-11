import Head from 'next/head';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MACRO_DATA = [
  {
    id: 'dxy',
    label: '달러인덱스 (DXY)',
    value: '100.2',
    change: '▼ 0.31%',
    up: false,
    level: 'neutral',
    desc: '달러 약세는 금·신흥국·원자재에 긍정적. BOJ 금리 인상 + 관세 협상 진행 시 추가 약세 가능.',
    policies: [
      { name: '트럼프 상호관세', impact: '관세 → 무역 불균형 → 달러 하락 압박', dir: 'down' },
      { name: 'BOJ 금리 정상화', impact: '엔 캐리 청산 → 달러 약세', dir: 'down' },
      { name: 'GENIUS Act', impact: '달러 스테이블코인 수요 → 달러 지지', dir: 'up' },
    ],
    watch: ['달러 약세 지속 시: 금·원자재·한국 수출주 수혜', '달러 반등 시: 신흥국·비트코인 리스크'],
    color: '#4a7fd4',
  },
  {
    id: 'usdkrw',
    label: 'USD/KRW 환율',
    value: '1,428',
    change: '▲ 0.18%',
    up: false,
    level: 'risk',
    desc: '원화 약세 지속. 1,400원 이상은 수출 대기업에 유리하지만 외국인 수급 이탈 압박. 밸류업 프로그램의 외국인 유입 효과 약화.',
    policies: [
      { name: '코리아 밸류업', impact: '외국인 유입 → 원화 강세 요인', dir: 'up' },
      { name: '트럼프 관세', impact: '한국 수출 타격 → 원화 약세', dir: 'down' },
      { name: 'BOJ 금리 인상', impact: '엔화 강세 시 원화도 동반 강세 가능', dir: 'up' },
    ],
    watch: ['1,450원 돌파 시: 한국 증시 외국인 이탈 가속', '1,380원 아래 복귀 시: 밸류업 외국인 수급 본격화'],
    color: '#c9a83a',
  },
  {
    id: 'usdjpy',
    label: 'USD/JPY 환율',
    value: '142.5',
    change: '▼ 0.44%',
    up: true,
    level: 'watch',
    desc: '엔화 강세 전환 초입. BOJ 추가 금리 인상 시 엔 캐리 트레이드 청산이 글로벌 주식 변동성 트리거가 될 수 있음. 2024년 8월 쇼크의 재현 가능성.',
    policies: [
      { name: 'BOJ 금리 정상화', impact: '0.5% → 추가 인상 시 엔화 급등 리스크', dir: 'up' },
      { name: '일본 방위비 증액', impact: '재정 지출 확대 → 국채 발행 → 금리 상승', dir: 'up' },
    ],
    watch: ['140엔 돌파 시: 글로벌 엔 캐리 청산 주의', '145엔 이상 유지 시: 추가 인상 속도 조절'],
    color: '#b87030',
  },
  {
    id: 'us10y',
    label: '미국 10년물 금리',
    value: '4.48%',
    change: '▼ 0.03%p',
    up: false,
    level: 'watch',
    desc: '4% 이상 유지는 성장주·부동산에 부담. DOGE 재정 감축 효과 미미 → 국채 공급 과잉 우려로 고금리 장기화 가능성.',
    policies: [
      { name: 'DOGE 정부 효율화', impact: '재정 감축 → 국채 공급 감소 → 금리 하락 기대', dir: 'down' },
      { name: 'GENIUS Act', impact: '스테이블코인 준비자산 국채 매입 → 금리 하락', dir: 'down' },
      { name: '트럼프 관세', impact: '인플레 → 연준 고금리 유지 → 금리 상승 압박', dir: 'up' },
    ],
    watch: ['4.8% 돌파 시: 성장주 재조정 국면', '4% 하회 시: 리스크 자산 랠리 신호'],
    color: '#4a7fd4',
  },
  {
    id: 'gold',
    label: '금 (GOLD)',
    value: '$3,238',
    change: '▲ 0.44%',
    up: true,
    level: 'bullish',
    desc: '역대 최고가 경신 중. 탈달러 흐름(중국·BRICS 금 보유 확대), 지정학 리스크, 실질금리 하락 기대가 복합 작용. 단기 과열 주의.',
    policies: [
      { name: '위안화 국제화', impact: '중국·중동의 달러 대체 → 금 매입 확대', dir: 'up' },
      { name: '트럼프 관세', impact: '불확실성 헤지 수요 → 금 상승', dir: 'up' },
      { name: 'GENIUS Act', impact: '달러 강화 → 상대적 금 매력 감소', dir: 'down' },
    ],
    watch: ['$3,500 돌파 시: 추가 상승 모멘텀', '관세 협상 타결 시: 단기 조정 가능'],
    color: '#c9a83a',
  },
  {
    id: 'vix',
    label: 'VIX 변동성 지수',
    value: '38.2',
    change: '▲ HIGH',
    up: false,
    level: 'risk',
    desc: 'VIX 30 이상은 시장 공포 구간. 관세 불확실성·BOJ 리스크·AI 버블 우려가 복합 작용. 단기 반등보다 리스크 관리 우선 국면.',
    policies: [
      { name: '트럼프 관세 90일 유예', impact: '불확실성 유지 → VIX 고공 행진', dir: 'up' },
      { name: 'BOJ 금리 인상', impact: '엔 캐리 청산 리스크 → VIX 상승', dir: 'up' },
      { name: 'Stargate AI 투자', impact: '실물 투자 확대 → 중장기 안정화 요인', dir: 'down' },
    ],
    watch: ['VIX 50 이상: 공황 구간, 역사적 매수 기회', 'VIX 20 이하 복귀 시: 리스크 자산 재진입 신호'],
    color: '#b84a4a',
  },
];

const LEVEL_CONFIG = {
  bullish: { label: '강세', color: '#3d9e6a', bg: 'rgba(61,158,106,.08)', border: 'rgba(61,158,106,.2)' },
  neutral: { label: '중립', color: '#b8924a', bg: 'rgba(184,146,74,.08)', border: 'rgba(184,146,74,.2)' },
  watch:   { label: '주시', color: '#b8924a', bg: 'rgba(184,146,74,.08)', border: 'rgba(184,146,74,.2)' },
  risk:    { label: '위험', color: '#b84a4a', bg: 'rgba(184,74,74,.08)',  border: 'rgba(184,74,74,.2)'  },
};

export default function Macro() {
  return (
    <>
      <Head>
        <title>매크로 지표 연결 — Policy Radar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar activePage="macro" />
          <main style={{ flex: 1, padding: '28px 36px 48px', minWidth: 0 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.1em', marginBottom: 8 }}>매크로 지표 연결</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--t1)', marginBottom: 8 }}>
                환율·금리와 정책의 연결고리
              </h1>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7 }}>
                주요 거시 지표가 어떤 정책과 연결되고, 어떤 투자 시사점을 주는지 정리했습니다.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 12 }}>
              {MACRO_DATA.map(item => {
                const lvl = LEVEL_CONFIG[item.level];
                return (
                  <div key={item.id} style={{
                    background: 'var(--s1)', border: '1px solid var(--wire)',
                    borderRadius: 4, overflow: 'hidden',
                    borderLeft: `2px solid ${item.color}`,
                  }}>
                    {/* Header */}
                    <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--wire)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t2)', letterSpacing: '.04em' }}>{item.label}</div>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8,
                          color: lvl.color, background: lvl.bg,
                          border: `1px solid ${lvl.border}`,
                          borderRadius: 2, padding: '2px 7px',
                        }}>{lvl.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: item.color, lineHeight: 1 }}>{item.value}</span>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 11,
                          color: item.up ? '#3d9e6a' : '#b84a4a',
                        }}>{item.change}</span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.75, marginTop: 8 }}>{item.desc}</p>
                    </div>

                    {/* Policy connections */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--wire)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.08em', marginBottom: 8 }}>정책 연결고리</div>
                      {item.policies.map((p, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                          marginBottom: i < item.policies.length - 1 ? 7 : 0,
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 11,
                            color: p.dir === 'up' ? '#3d9e6a' : '#b84a4a',
                            flexShrink: 0, marginTop: 1,
                          }}>{p.dir === 'up' ? '↑' : '↓'}</span>
                          <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)' }}>{p.name}</span>
                            <span style={{ fontSize: 10, color: 'var(--t2)', marginLeft: 6 }}>— {p.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Watch levels */}
                    <div style={{ padding: '10px 16px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', letterSpacing: '.08em', marginBottom: 7 }}>주시 레벨</div>
                      {item.watch.map((w, i) => (
                        <div key={i} style={{
                          fontSize: 11, color: 'var(--t2)', lineHeight: 1.65,
                          paddingLeft: 10,
                          borderLeft: `1px solid ${item.color}40`,
                          marginBottom: i < item.watch.length - 1 ? 6 : 0,
                        }}>{w}</div>
                      ))}
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
