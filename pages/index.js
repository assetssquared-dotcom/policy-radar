import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { COUNTRIES as STATIC, MACRO_THEMES, THEMES } from '../data/policies';

// ── 채널 링크 ──────────────────────────────────
const NAV = [
  { label:'Threads',   href:'https://www.threads.com/@asset.x2',
    color:'#e4e4e4', bg:'rgba(255,255,255,0.08)', border:'rgba(255,255,255,0.18)',
    icon:'<svg width="13" height="13" viewBox="0 0 192 192" fill="currentColor"><path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-43.246-41.457-43.398h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 6.987 4.676 15.997 6.95 25.379 6.432 12.359-.687 22.081-5.391 28.89-13.975 5.186-6.658 8.446-15.29 9.87-26.147 5.922 3.577 10.302 8.287 12.666 13.952 3.989 9.711 4.222 25.701-8.297 38.21-10.916 10.909-24.04 15.633-43.867 15.766-21.999-.149-38.646-7.215-49.482-21.009C37.458 134.017 32.2 115.61 32 92c.2-23.61 5.458-42.017 15.694-54.744 10.836-13.794 27.483-20.86 49.482-21.009 22.126.15 39.047 7.245 50.34 21.084 5.57 6.858 9.616 15.369 12.068 25.292l16.21-4.324c-2.999-11.607-7.861-21.666-14.578-29.963C147.166 10.246 126.354 1.176 100.086 1L99.803 1C73.587 1.176 52.994 10.274 39.371 26.607 27.366 41.005 21.2 61.565 21 92.001v.999c.2 30.435 6.366 50.996 18.371 65.394 13.623 16.333 34.216 25.431 60.432 25.607h.283c23.102-.149 39.376-6.231 52.676-19.521 17.84-17.828 17.342-40.208 11.501-53.962-4.198-10.217-12.376-18.515-22.726-23.53z"/></svg>' },
  { label:'YouTube',   href:'https://www.youtube.com/channel/UCpTC-SMFjA3EDRhZIKOcKuQ',
    color:'#ff4444', bg:'rgba(255,68,68,0.1)', border:'rgba(255,68,68,0.28)',
    icon:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
  { label:'프로젝트방', href:'https://t.me/+2Qw1cAZTm8FjMGNl',
    color:'#2aabee', bg:'rgba(42,171,238,0.1)', border:'rgba(42,171,238,0.28)',
    icon:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>' },
  { label:'구독자료',  href:'https://contents.premium.naver.com/assetx2/assetsx2',
    color:'#03c75a', bg:'rgba(3,199,90,0.1)', border:'rgba(3,199,90,0.28)',
    icon:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>' },
];

// ── 섹션 정의 ──────────────────────────────────
const SECS = [
  { id:'hero',     label:'소개',            icon:'◎' },
  { id:'policies', label:'국가별 정책',     icon:'⊞' },
  { id:'flow',     label:'연결고리 맵',     icon:'⬡' },
  { id:'screener', label:'정책 관련주', icon:'◈' },
  { id:'heatmap',  label:'정책 히트맵',     icon:'▦' },
  { id:'calendar', label:'이벤트 캘린더',   icon:'◷' },
  { id:'conflict',  label:'정책 충돌 지도',   icon:'⚡' },
  { id:'rotation',   label:'섹터 로테이션',    icon:'↻' },
  { id:'risk',     label:'리스크 레이더',   icon:'⚠' },
];

// ── 연결고리 맵 데이터 ─────────────────────────
const FLOW_DATA = [
  { id:'dollar_ai', title:'달러 패권 → AI 패권', color:'#4a7fd4',
    steps:[
      {l:'달러 패권 위기', s:'위안화·BRICS mBridge', t:'threat'},
      {l:'GENIUS Act 통과', s:'스테이블코인 법제화 2025', t:'policy'},
      {l:'미국채 수요 구조화', s:'USDT·USDC 준비자산 의무', t:'effect'},
      {l:'Stargate 클러스터', s:'텍사스·오하이오·조지아', t:'policy'},
      {l:'AI 서비스 = 달러', s:'글로벌 AI 인프라 달러화', t:'effect'},
      {l:'디지털 달러 패권', s:'AI 시대의 기축통화', t:'outcome'},
    ],
    bens:['써클(CRCL)','코인베이스(COIN)','엔비디아(NVDA)','SK하이닉스(000660)'],
    risks:['e-CNY 국경간 결제 확산','EU MiCA 디지털유로 경쟁'] },
  { id:'hbm', title:'HBM 병목 — AI의 급소', color:'#c9a83a',
    steps:[
      {l:'AI 모델 경쟁 심화', s:'GPT-5·Gemini 3·Grok 3', t:'trigger'},
      {l:'추론 수요 폭증', s:'데이터센터 24시간 풀가동', t:'effect'},
      {l:'SK하이닉스 HBM4', s:'2026년 B300 독점 공급', t:'chokepoint'},
      {l:'삼성 HBM3E 추격', s:'엔비디아 인증 완료', t:'effect'},
      {l:'마이크론 점유율 확대', s:'미국 내 생산 보조금', t:'policy'},
      {l:'한국 HBM 전략 자산', s:'수출통제·보조금 협상 카드', t:'outcome'},
    ],
    bens:['SK하이닉스(000660)','삼성전자(005930)','마이크론(MU)','SOXX ETF'],
    risks:['중국 CXMT HBM 자체 개발 2027 목표','HBM4 수율 문제 가능성'] },
  { id:'kdefense', title:'K-방산 2차 성장 사이클', color:'#6e8fa8',
    steps:[
      {l:'러-우 전쟁 3년 지속', s:'유럽 탄약·장비 소진', t:'trigger'},
      {l:'트럼프 NATO 압박', s:'GDP 3% 달성 요구 2026', t:'policy'},
      {l:'EU ReArm 집행 본격화', s:'8,000억 유로 2차 조달', t:'policy'},
      {l:'K-방산 2차 계약', s:'독일·영국·스칸디나비아', t:'effect'},
      {l:'현지 생산 파트너십', s:'폴란드·루마니아 공장', t:'effect'},
      {l:'2030년 500억 달러', s:'세계 3위 수출국 목표', t:'outcome'},
    ],
    bens:['한화에어로(012450)','LIG넥스원(079550)','KAI(047810)','한화오션(042660)'],
    risks:['유럽 자국 방산 육성(라인메탈 확장)','원화 강세 시 수익성 압박'] },
  { id:'tga', title:'재무부 TGA 사이클 — 유동성의 새 지배자', color:'#3d9e6a',
    steps:[
      {l:'4월 세금납부 마감', s:'TGA 급증 → 유동성 흡수↑', t:'trigger'},
      {l:'TGA 피크 ~8,500억$', s:'은행 준비금 감소·위험자산 압박', t:'effect'},
      {l:'5~7월 정부 지출 가속', s:'TGA 감소 → 시중 달러 방출↑', t:'policy'},
      {l:'역RRP 완충재 소진', s:'TGA 변동이 준비금 직격', t:'chokepoint'},
      {l:'나스닥·BTC 랠리', s:'유동성 방출 피크 구간', t:'outcome'},
      {l:'하반기 T-bill 재발행', s:'TGA 재충전 → 다시 유동성 흡수', t:'outcome'},
    ],
    bens:['QQQ(나스닥)','비트코인(IBIT)','뱅크오브뉴욕멜론(BK)','신흥국(EEM)'],
    risks:['TGA 증가 구간(4월·가을) = 위험자산 조정 주의','연준 QT와 TGA 리필 동시 = 이중 유동성 흡수'] },
  { id:'iran_hormuz', title:'이란 전쟁 → 에너지·공급망 충격', color:'#b84a4a',
    steps:[
      {l:'Operation Epic Fury', s:'2026.02.28 미-이스라엘 공습', t:'trigger'},
      {l:'호르무즈 완전 봉쇄', s:'원유 20%·LNG 20% 차단', t:'chokepoint'},
      {l:'브렌트 $120 터치', s:'IEA 비축유 긴급 방출', t:'effect'},
      {l:'카타르 LNG 포스마쥬르', s:'글로벌 LNG 20% 공급 중단', t:'effect'},
      {l:'비료·식량 위기', s:'우레아 30%·황 45% 차단', t:'effect'},
      {l:'스태그플레이션 리스크', s:'$150~$200 봉쇄 지속 시', t:'outcome'},
    ],
    bens:['XLE·IEO(에너지)','FRO·DHT(탱커)','셰니어(LNG)','GLD(금)'],
    risks:['임시 휴전 시 유가 급락','중국·인도 제3국 루트 개척으로 봉쇄 무력화'] }
];

const TC = { trigger:'#b84a4a', threat:'#b84a4a', base:'#555', policy:'#4a7fd4', chokepoint:'#c9a83a', effect:'#3d9e6a', outcome:'#b8924a' };
const TL = { trigger:'TRIGGER', threat:'THREAT', base:'BASE', policy:'POLICY', chokepoint:'CHOKE', effect:'EFFECT', outcome:'OUTCOME' };

// ── 리스크 데이터 (2026년 4월 기준) ──────────────
const RISK_DATA = [
  { id:'iran_war', lvl:5, title:'미-이란 전쟁 — 호르무즈 봉쇄 진행 중', cat:'지정학', prob:'현재 진행', impact:'극대', time:'2026.02.28~ 진행 중',
    desc:'2026년 2월 28일 Operation Epic Fury로 미-이스라엘이 이란 공습, 하메네이 사망. 이란이 호르무즈 해협 봉쇄(3월 4일). 전 세계 원유 20%·LNG 20%·비료 30% 차질. IEA "역사상 최대 에너지 안보 위기". 4월 7일 임시 휴전 후 협상 결렬, 4월 13일 미국 해상 봉쇄 발효. WTI $104 돌파. 유럽 가스 2배 급등. 봉쇄 장기화 시 $120+ → 글로벌 스태그플레이션.',
    affected:['원유·가스 가격($104+)','한국·일본 에너지 수급','글로벌 비료·식량','항공·해운'],
    hedge:['에너지 ETF(XLE·IEO)','탱커주(FRO·DHT)','금(GLD)','K-방산(012450)'], color:'#b84a4a' },
  { id:'tariff', lvl:5, title:'미-중 관세 협상 재결렬 리스크', cat:'지정학', prob:'중간', impact:'극대', time:'2026 Q2~Q3',
    desc:'2025년 10월 임시 합의로 관세율 하향 조정됐으나, 2026년 중간선거를 앞두고 트럼프의 강경 재선회 가능성. 중국의 대만 군사압박과 맞물리면 관세 전쟁 2라운드 돌입. 중국은 희귀광물 카드, 미국은 금융제재 카드를 동시에 보유.',
    affected:['반도체 공급망','한국 수출 기업','위안화·원화 동반 약세'],
    hedge:['금(GLD)','달러 인버스(UDN)','국내 방산주','에너지(XLE)'], color:'#b84a4a' },
  { id:'tga_risk', lvl:4, title:'재무부 TGA 관리 → 유동성 양방향 리스크', cat:'유동성', prob:'높음', impact:'대', time:'2026 지속',
    desc:'2025년 OBBBA로 부채한도 5조 달러 증액 후 TGA가 1조 달러까지 급증하며 가을 유동성 급격 흡수(은행 준비금 2% 감소). 이후 정부 지출로 다시 방출. 2026년에도 동일 사이클 반복 예상. TGA 증가=유동성 흡수, TGA 감소=유동성 방출. 역RRP 잔고 소진으로 완충재 없어 충격 직접 전달.',
    affected:['나스닥 성장주','비트코인·암호화폐','신흥국 ETF','금'],
    hedge:['현금 비중 유지 후 방출 구간 확인','FRED WDTGAL 주시'], color:'#3d9e6a' },
  { id:'boj', lvl:4, title:'BOJ 추가 금리 인상 → 엔 캐리 청산', cat:'통화', prob:'높음', impact:'대', time:'2026 상반기',
    desc:'2026년 현재 BOJ 기준금리 0.75~1.0%. 추가 인상 시 전 세계 엔 캐리(잔존 50조 엔 이상) 추가 청산. 2024년 8월 쇼크의 약화된 버전이지만 코스피·나스닥 5~10% 단기 조정 가능. 트럼프 관세와 동시 충격 시 복합 리스크.',
    affected:['일본 수출주(토요타·혼다)','코스피','나스닥 성장주'],
    hedge:['엔화 선물(FXY)','금(GLD)','미국 단기채(SHY)'], color:'#b87030' },
  { id:'ai_bubble', lvl:4, title:'AI 설비투자 과잉 → 실적 실망', cat:'AI·기술', prob:'중간', impact:'대', time:'2026 하반기',
    desc:'2025~2026년 Stargate·MS·구글·메타의 데이터센터 CAPEX 합계 5,000억 달러 이상. 2026년 하반기부터 ROI 검증 시즌. 엔비디아 가이던스 하향 시 반도체 섹터 전체 조정. 딥시크·Gemini 2.0 효율화로 실제 GPU 수요가 예측치를 하회할 리스크.',
    affected:['엔비디아(NVDA)','SK하이닉스 HBM','데이터센터 리츠(DLR)'],
    hedge:['인버스 반도체(SOXS)','가치주·배당주 로테이션'], color:'#7a7ad4' },
  { id:'korea', lvl:4, title:'한국 이재명 정부 정책 전환', cat:'정치', prob:'높음', impact:'중간', time:'2026 현재 진행',
    desc:'2025년 6월 대선 이후 이재명 정부 출범. 밸류업 프로그램 동력 약화, 원전 수출 속도 조절, 방산 예산 재검토. 법인세 인상·상속세 완화 무산 우려로 외국인 수급 관망. 코스피 코리아 디스카운트 재확대 국면.',
    affected:['밸류업 금융주(KB·신한)','원전 관련주(두산에너빌리티)','코스피 외국인'],
    hedge:['환헤지 ETF(HKOR)','방산주 비중 재점검'], color:'#c9a83a' },
  { id:'china_def', lvl:3, title:'중국 디플레이션 심화 + 부양책 실망', cat:'경제', prob:'높음', impact:'중간', time:'2026 지속',
    desc:'2025년 부양책(10조 위안)이 소비 부진으로 효과 제한. 부동산 안정화는 됐지만 반등은 없음. 위안화 6.9~7.2 박스권. 중국발 디플레이션 수출이 글로벌 제조업 마진 압박. 한국 화학·철강·배터리 타격 지속.',
    affected:['한국 화학·철강','중국 소비 관련주','원자재 가격'],
    hedge:['중국 제외 신흥국(EEM-MCHI)','인도(INDA)·베트남(VNM)'], color:'#b84a4a' },
  { id:'china_iran', lvl:4, title:'중국·러시아 이란 지원 — 봉쇄 무력화 리스크', cat:'지정학', prob:'중간', impact:'극대', time:'2026 Q2',
    desc:'트럼프가 이란 통과 선박에 추가 50% 관세 위협으로 중국 직접 겨냥. 중국은 이란 최대 원유 구매국이며 계속 수입 중. 러시아도 이란 무기 지원 가능성. 중국이 이란 지원을 강행할 경우 미-중 갈등 2중화 — 관세+군사 동시 충돌. 트럼프 중국 방문(다음달 예정)이 변수.',
    affected:['미-중 관계 급격 악화','위안화·원화 동반 약세','희귀광물 추가 통제'],
    hedge:['금(GLD)','달러 강세 헤지','에너지 비중 유지'], color:'#b84a4a' },
  { id:'rare', lvl:3, title:'희귀광물 공급망 불안 장기화', cat:'공급망', prob:'높음', impact:'중간', time:'2026 지속',
    desc:'중국의 갈륨·게르마늄·희토류 수출 제한이 2년째 지속. 서방 대안(MP머티리얼즈·라이너스)은 아직 공급 부족. 방산·반도체·EV 배터리 원가 상승 요인으로 구조화. 2026년 텅스텐·리튬 추가 통제 가능성.',
    affected:['반도체 장비','방산 소재','EV 배터리 원가'],
    hedge:['MP머티리얼즈(MP)','라이너스(LYC.AX)','REMX ETF'], color:'#b5936e' },
  { id:'us_fiscal', lvl:3, title:'미국 재정 적자 → 장기 고금리', cat:'재정', prob:'높음', impact:'중간', time:'2026 지속',
    desc:'DOGE 감축 효과 연간 1,500억 달러 수준으로 미미. 감세법안 통과로 재정적자 GDP 7~8% 고착화. 미국채 10년물 4.5~5.5% 박스권. 고금리 장기화는 성장주·부동산 리츠 밸류에이션 압박. 다만 TGA 방출로 일시 완화 구간 존재.',
    affected:['미국 장기채(TLT)','성장주 밸류에이션','신흥국 자금 이탈'],
    hedge:['미국 단기채(SHY·BIL)','인플레이션 연동채(TIPS)'], color:'#c4a1e8' },
];


// ── 정책 충돌 지도 데이터 ─────────────────────────
const CONFLICT_DATA = [
  {
    id: 'tariff_vs_ira',
    title: '트럼프 관세 vs IRA 리쇼어링',
    tension: 5,
    a: { label: '트럼프 상호관세', color: '#b84a4a',
         desc: '수입품에 145% 관세 → 원자재·부품 비용 급등' },
    b: { label: 'IRA 리쇼어링', color: '#4a7fd4',
         desc: '미국 내 제조 보조금 → 관세로 공급비용 상승해 효과 상쇄' },
    result: '미국 내 제조 투자는 늘지만 원가 부담으로 수익성 압박. 관세 혜택 기업과 비용 피해 기업이 동시 존재.',
    winners: ['US스틸(X)', '뉴코(NUE)'],
    losers: ['테슬라(TSLA)', '애플(AAPL)'],
  },
  {
    id: 'fed_vs_tga',
    title: '연준 QT vs 재무부 TGA 방출',
    tension: 4,
    a: { label: '연준 QT (긴축)', color: '#b87030',
         desc: '자산 축소로 은행 준비금 감소 → 유동성 흡수' },
    b: { label: 'TGA 방출 (완화)', color: '#3d9e6a',
         desc: '정부 지출로 시중 달러 증가 → 유동성 공급' },
    result: '두 힘이 상쇄. TGA 방출 구간엔 QT 효과 무력화. 4월은 TGA 증가(흡수), 5~7월은 TGA 감소(방출).',
    winners: ['QQQ(나스닥)', 'IBIT(비트코인)'],
    losers: ['SHY(단기채)', 'BIL'],
  },
  {
    id: 'ai_vs_energy',
    title: 'AI 데이터센터 vs 에너지·탄소 목표',
    tension: 4,
    a: { label: 'Stargate AI 인프라', color: '#4a7fd4',
         desc: '데이터센터 전력 수요 2030년까지 2배 이상 급증' },
    b: { label: 'EU CBAM·탄소중립', color: '#3a9e7a',
         desc: '탄소 배출 규제 강화 → 전력 확장에 제동' },
    result: '청정 에너지(원전·재생)가 유일한 해법. 원전 르네상스 가속. 전력망 병목이 AI 성장의 새 제약.',
    winners: ['콘스텔레이션(CEG)', '버티브(VRT)', '두산에너빌리티(034020)'],
    losers: ['석탄발전', '고탄소 데이터센터 운영사'],
  },
  {
    id: 'china_decoupling_vs_supply',
    title: '미-중 디커플링 vs 글로벌 공급망',
    tension: 5,
    a: { label: '미국 대중 수출통제·관세', color: '#b84a4a',
         desc: '반도체·희귀광물 중국 접근 차단' },
    b: { label: '중국 희귀광물 보복 통제', color: '#c9a83a',
         desc: '갈륨·게르마늄·희토류 서방 수출 제한' },
    result: '양측 모두 공급망 파괴. 대체 공급망 구축이 10년 과제. 단기 충격 → 장기 재편 수혜주 분리.',
    winners: ['MP머티리얼즈(MP)', 'TSMC(TSM)', 'SK하이닉스(000660)'],
    losers: ['애플 공급망', '유럽 자동차 배터리 소재'],
  },
  {
    id: 'dollar_vs_brics',
    title: '달러 패권 vs BRICS mBridge',
    tension: 3,
    a: { label: 'GENIUS Act 스테이블코인', color: '#4a7fd4',
         desc: '달러 기반 USDC·USDT 국제결제 강화' },
    b: { label: '위안화 국제화·mBridge', color: '#b84a4a',
         desc: 'BRICS 자체 결제망으로 달러 의존 탈피 시도' },
    result: '단기는 달러 우세. 중장기 에너지·원자재 결제에서 균열 가능. 금이 중립 자산으로 부상.',
    winners: ['써클(CRCL)', '코인베이스(COIN)', '금(GLD)'],
    losers: ['달러 독점 수혜 금융 인프라'],
  },
];

// ── 섹터 로테이션 데이터 ─────────────────────────
const ROTATION_DATA = [
  {
    period: '지금 (2026 Q2)',
    theme: '에너지·방산 슈퍼사이클',
    color: '#b84a4a',
    reason: '이란 전쟁·호르무즈 봉쇄 진행 중. 원유 $92. 러-우 전쟁 지속.',
    sectors: ['에너지(XLE)', '방산(ITA)', '탱커(FRO)', 'LNG(셰니어)'],
    avoid: ['항공(JETS)', '한국 정유', '운송'],
  },
  {
    period: '2026 Q3 (3개월 후)',
    theme: '유동성 방출 → 위험자산',
    color: '#3d9e6a',
    reason: 'TGA 방출 피크(5~7월). 전쟁 휴전 시 유가 조정, 나스닥 반등.',
    sectors: ['나스닥(QQQ)', '비트코인(IBIT)', '신흥국(EEM)', '반도체(SOXX)'],
    avoid: ['단기채(SHY)', '에너지 과매수 구간'],
  },
  {
    period: '2026 Q4 (6개월 후)',
    theme: '반도체·AI 인프라 병목',
    color: '#c9a83a',
    reason: '엔비디아 루빈 GPU 양산. HBM4 본격 공급. Stargate 1단계 가동.',
    sectors: ['HBM(SK하이닉스)', '패키징(한미반도체)', '전력망(버티브)', '구리(FCX)'],
    avoid: ['AI 버블 우려 고평가 성장주'],
  },
  {
    period: '2027 상반기',
    theme: 'K-방산 2차 수주·원전 르네상스',
    color: '#6e8fa8',
    reason: 'EU ReArm 2차 조달. 폴란드 K2PL 현지생산. SMR 상용화 근접.',
    sectors: ['한화에어로(012450)', '두산에너빌리티(034020)', 'LS전선(006260)', 'K-조선'],
    avoid: ['러-우 종전 시 유럽 방산 조정 가능성'],
  },
  {
    period: '2027 하반기',
    theme: 'HBF·AI 추론 인프라',
    color: '#7a7ad4',
    reason: 'HBF 상용화 시작. AI 추론 서버 급증. 엣지 AI 본격화.',
    sectors: ['SK하이닉스(000660)', '샌디스크(SNDK)', '퀄컴(QCOM)', '냉각(VRT)'],
    avoid: ['AI 훈련 중심 GPU 독점 구도 약화'],
  },
];

const PROB_C = {'높음':'#b84a4a', '중간':'#b8924a', '낮음':'#3d9e6a'};

// ── 히트맵 섹터 ───────────────────────────────
const SECTORS = [
  {id:'semiconductor', l:'반도체·AI칩'}, {id:'ai_policy', l:'AI 정책'},
  {id:'defense', l:'방산'},              {id:'energy_transition', l:'에너지 전환'},
  {id:'nuclear', l:'원전·SMR'},          {id:'dollar_hegemony', l:'달러 패권'},
  {id:'stablecoin', l:'스테이블코인'},    {id:'reshoring', l:'리쇼어링·관세'},
  {id:'yuan_intl', l:'위안화 국제화'},    {id:'critical_minerals', l:'희귀광물'},
  {id:'supply_chain', l:'공급망 재편'},   {id:'debt_fiscal', l:'재정·부채'},
];

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

// ── 유틸 ──────────────────────────────────────
function useMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 900);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return m;
}

function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
}

function Dots({ v, pos }) {
  return (
    <div style={{display:'flex',gap:2}}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{width:6,height:6,borderRadius:1,
          background: i<=Math.abs(v) ? (pos?'#3d9e6a':'#b84a4a') : 'rgba(255,255,255,0.07)'}} />
      ))}
    </div>
  );
}

function Label({ text }) {
  return (
    <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--amber)',
      letterSpacing:'.12em',marginBottom:8,textTransform:'uppercase'}}>
      {text}
    </div>
  );
}

function SecTitle({ children }) {
  return (
    <h2 style={{fontFamily:'var(--font-serif)',fontSize:26,fontWeight:400,
      color:'var(--t1)',marginBottom:8,lineHeight:1.2}}>
      {children}
    </h2>
  );
}

// ── 정책 아코디언 ──────────────────────────────
function PolicyRow({ policy, color, mobile }) {
  const [open, setOpen] = useState(false);
  const sc = policy.status==='active' ? '#3d9e6a' : policy.status==='upcoming' ? '#b8924a' : '#555';
  const sl = policy.status==='active' ? 'ACTIVE' : policy.status==='upcoming' ? 'UPCOMING' : 'PAUSED';
  return (
    <div style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
      <div onClick={()=>setOpen(!open)}
        style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,padding:'16px 0',cursor:'pointer'}}>
        <div style={{display:'flex',gap:12}}>
          <div style={{width:2,background:color,alignSelf:'stretch',flexShrink:0,borderRadius:1}} />
          <div style={{minWidth:0}}>
            <div style={{display:'flex',gap:6,marginBottom:6,flexWrap:'wrap'}}>
              <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:sc,
                border:`1px solid ${sc}40`,background:`${sc}12`,borderRadius:2,padding:'2px 7px'}}>
                {sl}
              </span>
              {!mobile && (policy.themes||[]).slice(0,2).map(t => (
                <span key={t} style={{fontFamily:'var(--font-mono)',fontSize:9,
                  color:'rgba(255,255,255,0.28)',border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:2,padding:'2px 6px'}}>
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
            <div style={{fontFamily:'var(--font-serif)',fontSize:mobile?17:20,fontWeight:400,
              color:'var(--t1)',lineHeight:1.2}}>
              {policy.name}
            </div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--amber)',marginTop:4}}>
              {policy.budget}
            </div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          {!mobile && (
            <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--t2)'}}>
              {policy.date}
            </span>
          )}
          <span style={{fontFamily:'var(--font-mono)',fontSize:10,
            color:open?color:'var(--t3)',transition:'color .15s'}}>
            {open ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {open && (
        <div style={{paddingBottom:24,paddingLeft:14,animation:'fadeIn .15s ease'}}>
          <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.85,marginBottom:20,
            whiteSpace:'pre-wrap'}}>
            {policy.background}
          </p>
          <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr 1fr',
            gap:1,background:'rgba(255,255,255,0.06)'}}>

            {/* 수혜 산업 */}
            <div style={{background:'var(--s1)',padding:'14px 16px'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--t3)',
                letterSpacing:'.08em',marginBottom:10,paddingBottom:8,
                borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                수혜 산업 매핑
              </div>
              {(policy.beneficiaries||[]).map((b,i) => (
                <div key={i} style={{marginBottom:10,paddingBottom:10,
                  borderBottom:i<(policy.beneficiaries||[]).length-1
                    ?'1px solid rgba(255,255,255,0.04)':'none'}}>
                  <div style={{display:'flex',justifyContent:'space-between',
                    alignItems:'flex-start',gap:8,marginBottom:3}}>
                    <div style={{fontSize:12,color:'var(--t1)',fontWeight:500}}>{b.sector}</div>
                    <Dots v={b.impact} pos={b.pos} />
                  </div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--t2)',
                    marginBottom:2}}>
                    {(b.stocks||[]).slice(0,2).join(' · ')}
                  </div>
                  {(b.etfs||[]).length>0 && (
                    <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--amber)'}}>
                      ETF {b.etfs.slice(0,3).join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 예산 */}
            <div style={{background:'var(--s1)',padding:'14px 16px'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--t3)',
                letterSpacing:'.08em',marginBottom:10,paddingBottom:8,
                borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                규모 · 예산
              </div>
              {(policy.budgetData||[]).map((b,i) => (
                <div key={i} style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:'var(--t2)',marginBottom:4}}>{b.name}</div>
                  <div style={{height:4,background:'rgba(255,255,255,0.06)',
                    borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:2,background:color+'99',
                      width:`${Math.min(Math.round((b.value/(b.max||b.value*1.5))*100),100)}%`}} />
                  </div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,
                    color:'var(--t3)',marginTop:2}}>
                    {typeof b.value==='number'&&b.value<1
                      ? b.value.toFixed(2) : (b.value||0).toLocaleString()}
                  </div>
                </div>
              ))}
              {policy.risks && (
                <div style={{marginTop:10,padding:'10px 12px',
                  background:'rgba(180,60,60,.04)',border:'1px solid rgba(180,60,60,.1)',
                  borderRadius:3}}>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'#a04040',
                    letterSpacing:'.07em',marginBottom:5}}>
                    RISK FACTOR
                  </div>
                  <div style={{fontSize:11,color:'var(--t2)',lineHeight:1.65}}>
                    {policy.risks}
                  </div>
                </div>
              )}
            </div>

            {/* 타임라인 */}
            <div style={{background:'var(--s1)',padding:'14px 16px'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--t3)',
                letterSpacing:'.08em',marginBottom:10,paddingBottom:8,
                borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                타임라인
              </div>
              <div style={{position:'relative'}}>
                <div style={{position:'absolute',left:5,top:6,bottom:0,
                  width:1,background:'rgba(255,255,255,0.06)'}} />
                {(policy.timeline||[]).map((t,j) => (
                  <div key={j} style={{display:'flex',gap:12,marginBottom:10,position:'relative'}}>
                    <div style={{width:11,height:11,borderRadius:'50%',flexShrink:0,
                      marginTop:1,border:`1px solid ${color}50`,
                      background:j===(policy.timeline||[]).length-1?color:'var(--s3)'}} />
                    <div>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:10,
                        color,marginBottom:2}}>
                        {t.date}
                      </div>
                      <div style={{fontSize:11,color:'var(--t2)',lineHeight:1.5}}>
                        {t.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 메인 ──────────────────────────────────────
export default function Home() {
  const mobile = useMobile();
  const [countries, setCountries] = useState(STATIC);
  const [activeSection, setActiveSection] = useState('hero');
  const [filterCountry, setFilterCountry] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 스크리너
  const [scSearch, setScSearch] = useState('');
  const [scCountry, setScCountry] = useState('all');
  const [scKorea, setScKorea] = useState(false);
  const [policySearch, setPolicySearch] = useState('');
  const [scImpact, setScImpact] = useState('all');

  // 히트맵
  const [hmSelected, setHmSelected] = useState(null);

  // 연결고리
  const [flowId, setFlowId] = useState('dollar_ai');

  // 캘린더
  const [calYear, setCalYear] = useState(2026);
  const [calCountry, setCalCountry] = useState('all');

  // 리스크
  const [riskCat, setRiskCat] = useState('all');

  useEffect(() => {
    fetch('/api/policies').then(r=>r.json()).then(d=>{
      if (d.countries) setCountries(d.countries);
    }).catch(()=>{});
  }, []);

  // 스크롤 → 활성 섹션 감지
  useEffect(() => {
    const onScroll = () => {
      let nearest = SECS[0].id;
      let minDist = Infinity;
      SECS.forEach(s => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const dist = Math.abs(el.getBoundingClientRect().top - 90);
        if (dist < minDist) { minDist = dist; nearest = s.id; }
      });
      setActiveSection(nearest);
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const total = countries.reduce((s,c)=>s+c.policies.length, 0);

  // 히트맵 행렬
  const matrix = {};
  countries.forEach(c => {
    matrix[c.id] = {};
    SECTORS.forEach(s => {
      const ps = c.policies.filter(p=>(p.themes||[]).includes(s.id));
      const score = Math.min(
        ps.length*2 + ps.reduce((sum,p)=>
          sum+(p.beneficiaries||[]).filter(b=>b.pos).reduce((s2,b)=>s2+b.impact*0.3,0),0),
        10
      );
      matrix[c.id][s.id] = {score:Math.round(score), count:ps.length, policies:ps};
    });
  });
  function cellBg(s){ if(!s)return'rgba(255,255,255,0.03)'; if(s<=2)return'rgba(184,146,74,0.12)'; if(s<=4)return'rgba(184,146,74,0.28)'; if(s<=6)return'rgba(184,146,74,0.48)'; if(s<=8)return'rgba(184,146,74,0.68)'; return'rgba(184,146,74,0.88)'; }
  function cellTxt(s){ if(!s)return'var(--t3)'; if(s<=3)return'rgba(184,146,74,0.8)'; return s>=7?'var(--ink)':'var(--amber)'; }

  // 스크리너 데이터
  const allRows = [];
  countries.forEach(c=>c.policies.forEach(p=>(p.beneficiaries||[]).forEach(b=>(b.stocks||[]).forEach(stk=>{
    allRows.push({stock:stk,sector:b.sector,impact:b.impact,pos:b.pos,etfs:b.etfs||[],policy:p.name,country:c});
  }))));
  const seenSet = new Set();
  let scRows = allRows.filter(r=>{
    const k=r.stock+r.country.id+r.policy;
    if(seenSet.has(k))return false; seenSet.add(k); return true;
  });
  if(scCountry!=='all') scRows=scRows.filter(r=>r.country.id===scCountry);
  if(scKorea) scRows=scRows.filter(r=>r.stock.includes('(0'));
  if(scImpact==='pos') scRows=scRows.filter(r=>r.pos&&r.impact>=3);
  if(scImpact==='neg') scRows=scRows.filter(r=>!r.pos);
  if(scSearch) scRows=scRows.filter(r=>
    r.stock.toLowerCase().includes(scSearch.toLowerCase())||
    r.sector.toLowerCase().includes(scSearch.toLowerCase()));
  scRows=[...scRows].sort((a,b)=>(b.pos?b.impact:-b.impact)-(a.pos?a.impact:-a.impact));

  // 캘린더
  const allEvents = [];
  countries.forEach(c=>c.policies.forEach(p=>(p.timeline||[]).forEach(t=>{
    const m=t.date.match(/(\d{4})[.\-](\d{1,2})/);
    const y2=t.date.match(/^(\d{4})$/);
    let yr=2026, mo=null;
    if(m){yr=+m[1];mo=+m[2];}
    else if(y2){yr=+y2[1];}
    else if(t.date.includes('2027'))yr=2027;
    else if(t.date.includes('2025'))yr=2025;
    allEvents.push({date:t.date,yr,mo,event:t.event,policy:p.name,status:p.status,country:c});
  })));
  let calEvents = allEvents.filter(e=>e.yr===calYear);
  if(calCountry!=='all') calEvents=calEvents.filter(e=>e.country.id===calCountry);
  calEvents.sort((a,b)=>(!a.mo&&b.mo)?1:(!b.mo&&a.mo)?-1:(a.mo||0)-(b.mo||0));
  const calByMonth={}, calNoMo=[];
  calEvents.forEach(e=>{ if(e.mo){if(!calByMonth[e.mo])calByMonth[e.mo]=[]; calByMonth[e.mo].push(e);} else calNoMo.push(e); });

  const riskFiltered = riskCat==='all' ? RISK_DATA : RISK_DATA.filter(r=>r.cat===riskCat);
  const riskSorted = [...riskFiltered].sort((a,b)=>b.lvl-a.lvl);
  const riskCats = ['all', ...[...new Set(RISK_DATA.map(r=>r.cat))]];

  const flow = FLOW_DATA.find(f=>f.id===flowId);
  const displayedCountries = (filterCountry ? countries.filter(c=>c.id===filterCountry) : countries)
    .map(c => policySearch ? {
      ...c,
      policies: (c.policies||[]).filter(p =>
        p.name?.toLowerCase().includes(policySearch.toLowerCase()) ||
        (p.beneficiaries||[]).some(b =>
          b.sector?.toLowerCase().includes(policySearch.toLowerCase()) ||
          (b.stocks||[]).some(s => s.toLowerCase().includes(policySearch.toLowerCase()))
        )
      )
    } : c)
    .filter(c => !policySearch || c.policies.length > 0);
  const SB = 186;

  // 공통 버튼 스타일
  const btn = (active) => ({
    fontFamily:'var(--font-mono)', fontSize:10,
    background:active?'var(--amber)':'transparent',
    color:active?'var(--ink)':'var(--t2)',
    border:`1px solid ${active?'var(--amber)':'var(--wire2)'}`,
    borderRadius:3, padding:'5px 11px', cursor:'pointer', transition:'all .12s',
    whiteSpace:'nowrap', flexShrink:0,
  });

  return (
    <>
      <Head>
        <title>자산제곱 정책 탐지 레이더</title>
        <meta name="description" content="자산제곱 정책 탐지 레이더 — 글로벌 정책과 겹치는 주식·섹터 리서치 참고 도구" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#050608" />
      </Head>

      <div style={{minHeight:'100vh',background:'var(--ink)'}}>

        {/* ── NAV ── */}
        <nav style={{height:52,display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'0 20px',borderBottom:'1px solid var(--wire)',background:'var(--ink)',
          position:'fixed',top:0,left:0,right:0,zIndex:300}}>
          <div style={{display:'flex',alignItems:'center',gap:0}}>
            <img src="/logo.png" alt="자산제곱" style={{
              width:32,height:32,borderRadius:7,flexShrink:0,
              objectFit:'cover',border:'1px solid rgba(255,255,255,0.1)'
            }}/>
            <div style={{marginLeft:2}}>
              <div style={{fontFamily:'var(--font-sans)',fontSize:14,fontWeight:700,
                color:'var(--t1)',lineHeight:1.25,letterSpacing:'-.01em'}}>자산제곱</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:8,
                color:'var(--amber)',letterSpacing:'.12em',lineHeight:1.25,
                opacity:0.85}}>정책 탐지 레이더</div>
            </div>
          </div>
          {!mobile ? (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:5,marginRight:6}}>
                <span style={{width:5,height:5,borderRadius:'50%',background:'#3d9e6a',
                  display:'inline-block',animation:'pulse 2.5s infinite'}} />
                <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'#3d9e6a',
                  letterSpacing:'.06em'}}>LIVE</span>
              </div>
              {NAV.map(({label,href,color,bg,border,icon}) => (
                <a key={label} href={href} target="_blank" rel="noopener"
                  style={{display:'flex',alignItems:'center',gap:6,fontFamily:'var(--font-sans)',
                    fontSize:12,fontWeight:500,color,background:bg,border:`1px solid ${border}`,
                    borderRadius:6,padding:'5px 11px',textDecoration:'none',transition:'opacity .15s'}}>
                  <span dangerouslySetInnerHTML={{__html:icon}} />
                  {label}
                </a>
              ))}
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#3d9e6a',
                display:'inline-block',animation:'pulse 2.5s infinite'}} />
              <button onClick={()=>setMenuOpen(!menuOpen)}
                style={{background:menuOpen?'rgba(255,255,255,0.08)':'none',
                  border:'1px solid rgba(255,255,255,0.15)',cursor:'pointer',
                  display:'flex',alignItems:'center',gap:6,
                  padding:'5px 10px',borderRadius:6}}>
                {[0,1,2].map(i=>(
                  <span key={i} style={{width:16,height:1.5,background:'rgba(255,255,255,0.7)',
                    display:'block',borderRadius:1}} />
                ))}
                <span style={{fontFamily:'var(--font-mono)',fontSize:9,
                  color:'rgba(255,255,255,0.6)',letterSpacing:'.04em'}}>채널</span>
              </button>
            </div>
          )}
        </nav>

        {/* 모바일 드로어 */}
        {mobile && menuOpen && (
          <div style={{position:'fixed',top:52,left:0,right:0,zIndex:299,
            background:'var(--s1)',borderBottom:'1px solid var(--wire)',
            padding:'16px',display:'flex',flexDirection:'column',gap:8,
            animation:'fadeIn .15s ease',maxHeight:'calc(100vh - 52px)',overflowY:'auto'}}>
            {NAV.map(({label,href,color,bg,border,icon}) => (
              <a key={label} href={href} target="_blank" rel="noopener"
                style={{display:'flex',alignItems:'center',gap:10,fontFamily:'var(--font-sans)',
                  fontSize:14,fontWeight:500,color,background:bg,border:`1px solid ${border}`,
                  borderRadius:8,padding:'12px 16px',textDecoration:'none'}}>
                <span dangerouslySetInnerHTML={{__html:icon}} />
                {label}
              </a>
            ))}
          </div>
        )}

        {/* ── 본문 레이아웃 ── */}
        <div style={{paddingTop:52,display:'flex',alignItems:'flex-start'}}>

          {/* 사이드바 (데스크탑) */}
          {!mobile && (
            <aside style={{width:SB,flexShrink:0,position:'sticky',top:52,
              height:'calc(100vh - 52px)',overflowY:'auto',
              borderRight:'1px solid var(--wire)',background:'var(--s1)',
              display:'flex',flexDirection:'column'}}>

                            {/* 섹션 네비 (국가 필터 통합) */}
              <div style={{padding:'10px 0'}}>
                {SECS.map(s => {
                  const on = activeSection===s.id;
                  const isPolicies = s.id==='policies';
                  return (
                    <div key={s.id}>
                      <div onClick={()=>goTo(s.id)}
                        style={{display:'flex',alignItems:'center',gap:8,
                          padding:'8px 14px',cursor:'pointer',transition:'all .12s',
                          background:on&&!isPolicies?'var(--s2)':isPolicies&&!filterCountry&&on?'var(--s2)':'transparent',
                          borderLeft:on&&!filterCountry?'2px solid var(--amber)':'2px solid transparent'}}
                        onMouseEnter={e=>{if(!(on&&!filterCountry))e.currentTarget.style.background='var(--s2)';}}
                        onMouseLeave={e=>{if(!(on&&!filterCountry))e.currentTarget.style.background='transparent';}}>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:10,
                          color:on?'var(--amber)':'var(--t3)',width:14,flexShrink:0}}>
                          {s.icon}
                        </span>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:11,
                          color:on?'var(--t1)':'var(--t2)'}}>
                          {s.label}
                        </span>
                      </div>
                      {/* 국가별 정책 아래에 국가 필터 인라인으로 */}
                      {isPolicies && (
                        <div style={{paddingLeft:8}}>
                          <div onClick={()=>{setFilterCountry(null);goTo('policies');}}
                            style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                              padding:'5px 14px 5px 22px',cursor:'pointer',transition:'all .12s',
                              background:!filterCountry&&on?'var(--s2)':'transparent',
                              borderLeft:!filterCountry&&on?'2px solid var(--amber)':'2px solid transparent'}}
                            onMouseEnter={e=>{e.currentTarget.style.background='var(--s2)';}}
                            onMouseLeave={e=>{if(filterCountry||!on)e.currentTarget.style.background='transparent';}}>
                            <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--t2)'}}>전체</span>
                            <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--amber)'}}>{total}</span>
                          </div>
                          {countries.map(c => {
                            const cOn = filterCountry===c.id;
                            return (
                              <div key={c.id}
                                onClick={()=>{setFilterCountry(cOn?null:c.id);goTo('policies');}}
                                style={{display:'flex',alignItems:'center',gap:7,
                                  padding:'5px 14px 5px 22px',cursor:'pointer',transition:'all .12s',
                                  background:cOn?'var(--s2)':'transparent',
                                  borderLeft:cOn?`2px solid ${c.color}`:'2px solid transparent'}}
                                onMouseEnter={e=>{if(!cOn)e.currentTarget.style.background='var(--s2)';}}
                                onMouseLeave={e=>{if(!cOn)e.currentTarget.style.background='transparent';}}>
                                <span style={{fontSize:13,flexShrink:0}}>{c.flag}</span>
                                <span style={{fontFamily:'var(--font-sans)',fontSize:11,
                                  color:cOn?'var(--t1)':'var(--t2)',flex:1}}>{c.name}</span>
                                <span style={{fontFamily:'var(--font-mono)',fontSize:9,
                                  color:c.color}}>{c.policies.length}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{height:1,background:'var(--wire)',margin:'4px 0'}} />

              {/* 매크로 테마 */}
              <div style={{padding:'10px 0 20px'}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                  color:'rgba(255,255,255,0.25)',letterSpacing:'.1em',
                  padding:'0 14px',marginBottom:4}}>매크로 테마</div>
                {MACRO_THEMES.map(t => (
                  <div key={t.id} style={{display:'flex',alignItems:'center',gap:8,
                    padding:'5px 14px'}}>
                    <span style={{width:4,height:4,borderRadius:'50%',
                      background:t.color,flexShrink:0}} />
                    <span style={{fontFamily:'var(--font-mono)',fontSize:10,
                      color:'var(--t2)'}}>{t.name}</span>
                  </div>
                ))}
              </div>
            </aside>
          )}

          {/* ── 메인 콘텐츠 ── */}
          <main style={{flex:1,padding:mobile?'0 14px':'0 44px',minWidth:0,
            width:mobile?'100%':`calc(100% - ${SB}px)`}}>

            {/* 모바일 퀵네비 */}
            {mobile && (
              <div style={{position:'sticky',top:52,zIndex:100,background:'var(--s1)',
                borderBottom:'1px solid var(--wire)',marginLeft:-16,marginRight:-16,
                paddingLeft:16,overflowX:'auto',display:'flex',gap:0,
                scrollbarWidth:'none',WebkitOverflowScrolling:'touch'}}>
                {SECS.map(s => {
                  const on = activeSection===s.id;
                  return (
                    <button key={s.id} onClick={()=>goTo(s.id)}
                      style={{flexShrink:0,fontFamily:'var(--font-mono)',fontSize:9,
                        color:on?'var(--t1)':'var(--t3)',background:'none',border:'none',
                        borderBottom:on?'2px solid var(--amber)':'2px solid transparent',
                        padding:'10px 9px',cursor:'pointer',whiteSpace:'nowrap'}}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ① 소개 */}
            <section id="hero" style={{
              padding: mobile ? '28px 0 0' : '48px 0 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>

              {/* 상단 타이틀 */}
              <div style={{marginBottom: mobile ? 28 : 40}}>
                <Label text="자산제곱 — 정책 탐지 레이더 · 2026" />
                <h1 style={{
                  fontFamily:'var(--font-serif)', fontSize: mobile ? 28 : 48,
                  fontWeight: 400, color:'var(--t1)', lineHeight: 1.06, marginBottom: 16,
                }}>
                  정책과 겹치는<br />
                  <em style={{color:'var(--amber)', fontStyle:'italic'}}>주식·섹터 지도</em>
                </h1>
                <p style={{
                  fontSize: mobile ? 13 : 14, color:'var(--t2)', lineHeight: 1.9,
                  maxWidth: 560, marginBottom: 0,
                }}>
                  미국·중국·유럽·한국·일본 5개국의 핵심 정책 {total}개를 분석합니다.
                  정책과 겹치는 산업·종목을 빠르게 탐색하는 리서치 참고 도구입니다.
                  이 사이트의 내용은 투자 권유가 아닙니다.
                </p>
              </div>

              {/* 핵심 지금 시나리오 카드 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
                gap: 1, background: 'rgba(255,255,255,0.06)',
                marginBottom: mobile ? 24 : 40,
              }}>
                {[
                  {
                    tag: '🚨 현재 진행 중',
                    title: '미-이란 전쟁 · 호르무즈 봉쇄',
                    body: '2026.02.28 Operation Epic Fury. 브렌트 $120 터치 후 현재 $92. 6주째 봉쇄 — 중동 원유 수출 절반 차단. 4월 13일 미국 해상봉쇄 발효, 이란행 선박 전면 차단. 봉쇄 지속 시 $150~$200 경고.',
                    link: 'XLE·FRO·셰니어(LNG)·GLD — 정책 연관 섹터',
                    color: '#c00000',
                  },
                  {
                    tag: '🔴 최고 경계',
                    title: '미-중 관세 재결렬',
                    body: '90일 유예 기간 종료(~7월 8일) 내 합의 실패 시 145% 관세 복귀. 중국의 희귀광물 전면 금지 카드가 맞물리면 공급망 대혼란.',
                    link: '반도체·K-방산 — 정책 직접 연관',
                    color: '#b84a4a',
                  },
                  {
                    tag: '🟡 현재: 4월 흡수 → 5~7월 방출',
                    title: '재무부 TGA 사이클 — 지금은 흡수 구간',
                    body: '4월 15일 세금 납부 마감 → TGA 피크(유동성 흡수). 이후 5~7월 정부 지출 가속 → TGA 감소 → 시중 유동성 방출. 역RRP 완충재 소진으로 TGA 변동이 준비금 직격. 방출 구간이 위험자산 랠리 트리거.',
                    link: 'FRED WDTGAL 매주 수요일 — TGA 방향 확인',
                    color: '#b8924a',
                  },
                  {
                    tag: '🟢 구조적 기회',
                    title: 'HBM 병목 — AI의 급소',
                    body: 'SK하이닉스 HBM4가 엔비디아 B300에 독점 공급 중. GPU가 아무리 많아도 HBM 없이는 작동 불가. 중국 자체 개발 2027 목표이지만 수율 불확실.',
                    link: '정책 연관: SK하이닉스·삼성·마이크론',
                    color: '#3d9e6a',
                  },
                ].map(({tag, title, body, link, color}, i) => (
                  <div key={i} style={{
                    background: 'var(--s1)', padding: mobile ? '16px' : '20px 22px',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 2, background: color,
                    }} />
                    <div style={{
                      fontFamily:'var(--font-mono)', fontSize: 9,
                      color, letterSpacing: '.06em', marginBottom: 8,
                    }}>{tag}</div>
                    <div style={{
                      fontFamily:'var(--font-serif)', fontSize: mobile ? 16 : 18,
                      color:'var(--t1)', fontWeight: 400, marginBottom: 10, lineHeight: 1.3,
                    }}>{title}</div>
                    <p style={{
                      fontSize: 12, color:'var(--t2)', lineHeight: 1.8, marginBottom: 12,
                    }}>{body}</p>
                    <div style={{
                      fontFamily:'var(--font-mono)', fontSize: 10,
                      color, opacity: 0.8,
                    }}>→ {link}</div>
                  </div>
                ))}
              </div>

              {/* 이 사이트 활용법 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : 'repeat(4, 1fr)',
                gap: 1, background: 'rgba(255,255,255,0.06)',
                marginBottom: mobile ? 32 : 48,
              }}>
                {[
                  { icon:'⊞', label:'국가별 정책', desc:'아코디언으로 펼쳐 관련 종목·예산·타임라인 확인' },
                  { icon:'⬡', label:'연결고리 맵', desc:'달러 패권·HBM 병목·K-방산·TGA 방출 인과관계' },
                  { icon:'◈', label:'정책 관련주', desc:'전 정책과 겹치는 종목을 섹터·국가·연관도로 필터링' },
                  { icon:'▦', label:'정책 히트맵', desc:'5개국 × 12개 섹터 정책 집중도 한눈에' },
                  { icon:'◷', label:'이벤트 캘린더', desc:'2026~2028 정책 발효·표결 일정 정리' },
                  { icon:'⚠', label:'리스크 레이더', desc:'충격 규모 × 확률 순위와 헤지 전략' },
                  { icon:'◎', label:'매일 업데이트', desc:'매일 오전 7시 최신 내용을 점검해 업데이트합니다' },
                  { icon:'↗', label:'구독자료', desc:'네이버 프리미엄에서 자산제곱의 심층 정책·산업 분석' },
                ].map(({icon, label, desc}, i) => (
                  <div key={i} style={{
                    background:'var(--s1)', padding:'14px 16px',
                  }}>
                    <div style={{
                      display:'flex', alignItems:'center', gap: 8, marginBottom: 6,
                    }}>
                      <span style={{
                        fontFamily:'var(--font-mono)', fontSize: 13,
                        color:'var(--amber)', flexShrink: 0,
                      }}>{icon}</span>
                      <span style={{
                        fontFamily:'var(--font-mono)', fontSize: 11,
                        color:'var(--t1)', fontWeight: 500,
                      }}>{label}</span>
                    </div>
                    <p style={{
                      fontSize: 11, color:'var(--t2)', lineHeight: 1.7, margin: 0,
                    }}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* 자산제곱 최신 리포트 */}
              <div style={{marginBottom:24}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                  color:'rgba(255,255,255,0.25)',letterSpacing:'.1em',marginBottom:10}}>
                  자산제곱 — 최신 분석
                </div>
                <div style={{display:'grid',
                  gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:1,
                  background:'rgba(255,255,255,0.06)'}}>
                  {[
                    { tag:'심층분석', title:'이란 전쟁과 에너지 시장 — 지금 무엇을 봐야 하나', date:'2026.04' },
                    { tag:'섹터분석', title:'HBM4·CoWoS 병목 — AI 공급망의 핵심 구간', date:'2026.04' },
                    { tag:'매크로', title:'TGA 사이클 완전 정리 — 4월 흡수, 5~7월 방출', date:'2026.04' },
                    { tag:'구독자료', title:'전체 분석 아카이브 →', date:'' },
                  ].map(({tag,title,date},i)=>(
                    <a key={i}
                      href="https://contents.premium.naver.com/assetx2/assetsx2"
                      target="_blank" rel="noopener"
                      style={{display:'block',background:'var(--s1)',padding:'14px 16px',
                        textDecoration:'none',transition:'background .12s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--s2)'}
                      onMouseLeave={e=>e.currentTarget.style.background='var(--s1)'}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:8,
                          color:'var(--amber)',background:'rgba(184,146,74,0.12)',
                          border:'1px solid rgba(184,146,74,0.25)',
                          borderRadius:2,padding:'1px 6px'}}>{tag}</span>
                        {date && <span style={{fontFamily:'var(--font-mono)',fontSize:8,
                          color:'var(--t3)'}}>{date}</span>}
                      </div>
                      <div style={{fontFamily:'var(--font-sans)',fontSize:13,
                        color:'var(--t1)',lineHeight:1.5}}>{title}</div>
                    </a>
                  ))}
                </div>
              </div>

            </section>

{/* ② 국가별 정책 */}
            <section id="policies" style={{paddingTop:mobile?40:56}}>
              <Label text="국가별 정책 분석" />
              <SecTitle>정책 상세 분석</SecTitle>
              {/* 정책 검색 */}
              <div style={{position:'relative',marginBottom:20,maxWidth:360}}>
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',
                  fontFamily:'var(--font-mono)',fontSize:12,color:'var(--t3)'}}>⌕</span>
                <input
                  value={policySearch} onChange={e=>setPolicySearch(e.target.value)}
                  placeholder="정책명, 키워드, 종목 검색..."
                  style={{width:'100%',fontFamily:'var(--font-mono)',fontSize:12,
                    background:'var(--s2)',border:'1px solid var(--wire2)',
                    borderRadius:4,padding:'9px 12px 9px 32px',
                    color:'var(--t1)',outline:'none',boxSizing:'border-box'}}
                />
                {policySearch && (
                  <button onClick={()=>setPolicySearch('')}
                    style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',
                      background:'none',border:'none',cursor:'pointer',
                      fontFamily:'var(--font-mono)',fontSize:11,color:'var(--t3)'}}>✕</button>
                )}
              </div>
              {/* 모바일 국가 필터 */}
              {mobile && (
                <div style={{display:'flex',gap:6,overflowX:'auto',marginBottom:20,
                  paddingBottom:4,scrollbarWidth:'none',flexWrap:'nowrap'}}>
                  <button onClick={()=>setFilterCountry(null)}
                    style={btn(!filterCountry)}>전체</button>
                  {countries.map(c => (
                    <button key={c.id} onClick={()=>setFilterCountry(filterCountry===c.id?null:c.id)}
                      style={{...btn(filterCountry===c.id),
                        color:filterCountry===c.id?'var(--ink)':c.color,
                        background:filterCountry===c.id?c.color:'transparent',
                        border:`1px solid ${filterCountry===c.id?c.color:c.color+'40'}`}}>
                      {c.flag} {c.name}
                    </button>
                  ))}
                </div>
              )}
              {policySearch && displayedCountries.length === 0 && (
                <div style={{padding:'40px 0',textAlign:'center',
                  fontFamily:'var(--font-mono)',fontSize:12,color:'var(--t3)'}}>
                  '{policySearch}'에 해당하는 정책이 없습니다
                </div>
              )}
              {displayedCountries.map(c => (
                <div key={c.id} style={{padding:mobile?'24px 0':'36px 0',
                  borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{display:'grid',
                    gridTemplateColumns:mobile?'1fr':'1fr 200px',
                    gap:mobile?16:28,marginBottom:18,paddingBottom:16,
                    borderBottom:`1px solid ${c.color}25`}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                        <span style={{fontSize:mobile?26:30,lineHeight:1}}>{c.flag}</span>
                        <div>
                          <h3 style={{fontFamily:'var(--font-serif)',
                            fontSize:mobile?20:28,fontWeight:400,
                            color:c.color,lineHeight:1.1}}>{c.name}</h3>
                          <div style={{fontFamily:'var(--font-mono)',fontSize:11,
                            color:'var(--t3)',marginTop:4}}>{c.tagline}</div>
                        </div>
                      </div>
                      <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.85,maxWidth:500}}>
                        {c.summary}
                      </p>
                    </div>
                    {!mobile && (
                      <div style={{display:'flex',flexDirection:'column',gap:1}}>
                        {[{l:'분석 정책',v:c.policies.length},
                          {l:'최근 업데이트',v:c.updated},
                          {l:'핵심 테마',v:[...new Set(c.policies.flatMap(p=>p.themes||[]))].length+'개'}
                        ].map(({l,v}) => (
                          <div key={l} style={{display:'flex',justifyContent:'space-between',
                            alignItems:'center',padding:'8px 12px',background:'var(--s1)',
                            borderLeft:`2px solid ${c.color}40`}}>
                            <span style={{fontFamily:'var(--font-mono)',fontSize:11,
                              color:'var(--t2)'}}>{l}</span>
                            <span style={{fontFamily:'var(--font-serif)',fontSize:15,
                              color:c.color}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {c.policies.map(p => (
                    <PolicyRow key={p.id} policy={p} color={c.color} mobile={mobile} />
                  ))}
                </div>
              ))}
            </section>

            {/* ③ 연결고리 맵 */}
            <section id="flow" style={{padding:mobile?'40px 0 32px':'60px 0 48px',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <Label text="정책 연결고리 맵" />
              <SecTitle>정책은 어떻게 연결되는가</SecTitle>
              <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.75,marginBottom:24}}>
                개별 정책을 넘어 큰 흐름의 인과관계를 추적합니다. 2026년 현재 기준.
              </p>
              <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
                {FLOW_DATA.map(f => (
                  <button key={f.id} onClick={()=>setFlowId(f.id)}
                    style={{fontFamily:'var(--font-sans)',fontSize:12,
                      background:flowId===f.id?f.color+'22':'transparent',
                      color:flowId===f.id?'var(--t1)':'var(--t2)',
                      border:`1px solid ${flowId===f.id?f.color:'var(--wire2)'}`,
                      borderRadius:4,padding:'7px 13px',cursor:'pointer',transition:'all .15s'}}>
                    {f.title}
                  </button>
                ))}
              </div>
              {flow && (
                <div style={{animation:'fadeIn .2s ease'}}>
                  <div style={{display:'flex',alignItems:'center',
                    overflowX:'auto',paddingBottom:8,marginBottom:20,gap:0}}>
                    {flow.steps.map((step,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',flexShrink:0}}>
                        <div style={{width:mobile?108:140,padding:mobile?'10px 10px':'12px 14px',
                          background:'var(--s2)',borderRadius:4,
                          border:`1px solid ${TC[step.t]}50`,
                          borderTop:`2px solid ${TC[step.t]}`}}>
                          <div style={{fontFamily:'var(--font-mono)',fontSize:8,
                            color:TC[step.t],letterSpacing:'.07em',marginBottom:4}}>
                            {TL[step.t]}
                          </div>
                          <div style={{fontSize:mobile?10:12,color:'var(--t1)',
                            fontWeight:500,lineHeight:1.3,marginBottom:3}}>{step.l}</div>
                          <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                            color:'var(--t2)',lineHeight:1.4}}>{step.s}</div>
                        </div>
                        {i<flow.steps.length-1 && (
                          <div style={{display:'flex',alignItems:'center',
                            padding:'0 3px',flexShrink:0}}>
                            <div style={{width:16,height:1,background:'var(--wire2)'}} />
                            <div style={{borderTop:'4px solid transparent',
                              borderBottom:'4px solid transparent',
                              borderLeft:'6px solid var(--wire2)',width:0,height:0}} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:10}}>
                    <div style={{background:'var(--s1)',border:'1px solid var(--wire)',
                      borderLeft:'2px solid #3d9e6a',borderRadius:4,padding:'14px 16px'}}>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'#3d9e6a',
                        letterSpacing:'.08em',marginBottom:10}}>정책 연관 종목</div>
                      {flow.bens.map((b,i) => (
                        <div key={i} style={{fontFamily:'var(--font-mono)',fontSize:11,
                          color:'var(--amber)',lineHeight:1.9}}>→ {b}</div>
                      ))}
                    </div>
                    <div style={{background:'var(--s1)',border:'1px solid var(--wire)',
                      borderLeft:'2px solid #b84a4a',borderRadius:4,padding:'14px 16px'}}>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'#b84a4a',
                        letterSpacing:'.08em',marginBottom:10}}>이 흐름의 리스크</div>
                      {flow.risks.map((r,i) => (
                        <div key={i} style={{fontSize:12,color:'var(--t2)',lineHeight:1.9}}>
                          · {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ④ 정책 관련주 스크리너 */}
            <section id="screener" style={{padding:mobile?'40px 0 32px':'60px 0 48px',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <Label text="정책 관련주 스크리너" />
              <SecTitle>정책 관련주 조회</SecTitle>
              <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.75,marginBottom:16}}>
                {scRows.length}개 종목 · 정책과 연관된 종목을 탐색하는 도구입니다. 종목 언급은 투자 권유가 아닙니다.
              </p>
              <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
                <input value={scSearch} onChange={e=>setScSearch(e.target.value)}
                  placeholder="종목명 / 섹터..."
                  style={{fontFamily:'var(--font-mono)',fontSize:11,background:'var(--s2)',
                    border:'1px solid var(--wire2)',borderRadius:4,padding:'6px 12px',
                    color:'var(--t1)',outline:'none',width:150}} />
                <select value={scCountry} onChange={e=>setScCountry(e.target.value)}
                  style={{fontFamily:'var(--font-mono)',fontSize:11,background:'var(--s2)',
                    border:'1px solid var(--wire2)',borderRadius:4,padding:'6px 10px',
                    color:'var(--t1)',outline:'none'}}>
                  <option value="all">전체 국가</option>
                  {countries.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                </select>
                <button onClick={()=>setScKorea(!scKorea)} style={{
                    ...btn(scKorea),
                    borderColor: scKorea ? '#c9a83a' : undefined,
                    color: scKorea ? '#c9a83a' : undefined,
                  }}>🇰🇷 코스피</button>
                {[{v:'all',l:'전체'},{v:'pos',l:'관련주'},{v:'neg',l:'리스크'}].map(f=>(
                  <button key={f.v} onClick={()=>setScImpact(f.v)} style={btn(scImpact===f.v)}>
                    {f.l}
                  </button>
                ))}
              </div>
              <div style={{border:'1px solid var(--wire)',borderRadius:4,overflow:'hidden',
                overflowX:'auto'}}>
                <div style={{display:'grid',minWidth:500,
                  gridTemplateColumns:mobile?'2fr 1.5fr 60px':'2fr 1.5fr 70px 1.5fr 1fr',
                  background:'var(--s2)',padding:'8px 16px',borderBottom:'1px solid var(--wire)'}}>
                  {(mobile?['종목','섹터','연관도']:['종목','섹터','연관도','ETF','국가']).map(h=>(
                    <div key={h} style={{fontFamily:'var(--font-mono)',fontSize:9,
                      color:'var(--t3)',letterSpacing:'.08em'}}>{h}</div>
                  ))}
                </div>
                {scRows.slice(0,60).map((r,i) => (
                  <div key={i}
                    style={{display:'grid',minWidth:500,
                      gridTemplateColumns:mobile?'2fr 1.5fr 60px':'2fr 1.5fr 70px 1.5fr 1fr',
                      padding:'9px 16px',
                      borderBottom:i<scRows.length-1?'1px solid var(--wire)':'none',
                      background:i%2===0?'var(--s1)':'var(--ink)',transition:'background .1s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--s2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'var(--s1)':'var(--ink)'}>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:12,
                      color:'var(--t1)',fontWeight:500,alignSelf:'center'}}>{r.stock}</div>
                    <div style={{fontSize:11,color:'var(--t2)',alignSelf:'center'}}>{r.sector}</div>
                    <div style={{alignSelf:'center'}}><Dots v={r.impact} pos={r.pos} /></div>
                    {!mobile && (
                    <div style={{alignSelf:'center'}}>
                      {r.etfs.slice(0,3).map(e=>(
                        <span key={e} style={{fontFamily:'var(--font-mono)',fontSize:9,
                          color:'var(--amber)',background:'rgba(184,146,74,.1)',
                          border:'1px solid rgba(184,146,74,.2)',borderRadius:2,
                          padding:'1px 5px',marginRight:3,display:'inline-block',marginBottom:2}}>
                          {e}
                        </span>
                      ))}
                    </div>
                    )}
                    {!mobile && <div style={{display:'flex',alignItems:'center',gap:5,alignSelf:'center'}}>
                      <span style={{fontSize:13}}>{r.country.flag}</span>
                      <span style={{fontFamily:'var(--font-mono)',fontSize:9,
                        color:r.country.color}}>{r.country.name}</span>
                    </div>}
                  </div>
                ))}
              </div>
              {scRows.length>60 && (
                <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--t3)',
                  marginTop:10,textAlign:'center'}}>
                  상위 60개 표시 · 전체 {scRows.length}개
                </div>
              )}
            </section>

            {/* ⑤ 히트맵 */}
            <section id="heatmap" style={{padding:mobile?'40px 0 32px':'60px 0 48px',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <Label text="정책 강도 히트맵" />
              <SecTitle>국가 × 섹터 정책 집중도</SecTitle>
              <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.75,marginBottom:24}}>
                어느 국가가 어느 섹터에 정책 화력을 집중하는지 보여줍니다. 셀 클릭 시 관련 정책과 겹치는 종목 확인.
              </p>

              {/* 범례 */}
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20,flexWrap:'wrap'}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--t3)'}}>강도</span>
                {[0,2,4,6,8,10].map(v => (
                  <div key={v} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <div style={{width:26,height:16,background:cellBg(v),border:'1px solid var(--wire)',borderRadius:2}} />
                    <span style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--t3)'}}>{v}</span>
                  </div>
                ))}
                <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--t3)',marginLeft:4}}>낮음 → 높음</span>
              </div>

              <div style={{overflowX:'auto'}}>
                <div style={{
                  display:'grid',
                  gridTemplateColumns:`150px repeat(${countries.length},1fr)`,
                  gap:1, minWidth:560,
                }}>
                  {/* 헤더 */}
                  <div />
                  {countries.map(c => (
                    <div key={c.id} style={{padding:'8px 4px',textAlign:'center'}}>
                      <div style={{fontSize:18,marginBottom:2}}>{c.flag}</div>
                      <div style={{fontFamily:'var(--font-serif)',fontSize:12,color:c.color}}>{c.name}</div>
                    </div>
                  ))}

                  {/* 데이터 행 */}
                  {SECTORS.map(s => (
                    <>
                      {/* 섹터 라벨 */}
                      <div key={s.id+'_l'} style={{
                        padding:'9px 10px',display:'flex',alignItems:'center',
                        borderTop:'1px solid var(--wire)',
                      }}>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--t2)'}}>{s.l}</span>
                      </div>

                      {/* 셀들 */}
                      {countries.map(c => {
                        const cell = matrix[c.id][s.id];
                        const isSelected = hmSelected?.c===c.id && hmSelected?.s===s.id;
                        return (
                          <div
                            key={c.id+s.id}
                            onClick={() => {
                              if (cell.count === 0) return;
                              setHmSelected(isSelected ? null : {c:c.id, s:s.id});
                            }}
                            style={{
                              background: isSelected ? c.color+'33' : cellBg(cell.score),
                              border: isSelected ? `2px solid ${c.color}` : '1px solid rgba(255,255,255,0.04)',
                              cursor: cell.count>0 ? 'pointer' : 'default',
                              display:'flex', flexDirection:'column',
                              alignItems:'center', justifyContent:'center',
                              padding:'9px 4px', transition:'all .15s', minHeight:46,
                              outline: isSelected ? `2px solid ${c.color}` : 'none',
                            }}
                          >
                            {cell.count > 0 ? (
                              <>
                                <div style={{
                                  fontFamily:'var(--font-mono)', fontSize:14, fontWeight:600,
                                  color: isSelected ? c.color : cellTxt(cell.score), lineHeight:1,
                                }}>{cell.score}</div>
                                <div style={{
                                  fontFamily:'var(--font-mono)', fontSize:8,
                                  color: isSelected ? c.color : cellTxt(cell.score),
                                  opacity:.7, marginTop:2,
                                }}>{cell.count}개</div>
                              </>
                            ) : (
                              <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--t3)'}}>—</div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>

              {/* 선택된 셀 상세 패널 */}
              {hmSelected && matrix[hmSelected.c]?.[hmSelected.s]?.count > 0 && (() => {
                const c = countries.find(x => x.id===hmSelected.c);
                const sec = SECTORS.find(x => x.id===hmSelected.s);
                const cell = matrix[hmSelected.c][hmSelected.s];
                return (
                  <div style={{
                    marginTop:16, border:`1px solid ${c.color}40`,
                    borderLeft:`3px solid ${c.color}`,
                    borderRadius:4, overflow:'hidden',
                    animation:'fadeIn .15s ease',
                  }}>
                    {/* 패널 헤더 */}
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'12px 18px',
                      background:`${c.color}0d`,
                      borderBottom:'1px solid var(--wire)',
                    }}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:18}}>{c.flag}</span>
                        <div>
                          <span style={{fontFamily:'var(--font-serif)',fontSize:16,color:c.color}}>{c.name}</span>
                          <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--t3)',margin:'0 8px'}}>×</span>
                          <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--t2)'}}>{sec.l}</span>
                        </div>
                        <span style={{
                          fontFamily:'var(--font-mono)',fontSize:11,
                          color:c.color, background:`${c.color}18`,
                          border:`1px solid ${c.color}40`,
                          borderRadius:3, padding:'2px 8px',
                        }}>강도 {cell.score}</span>
                      </div>
                      <button
                        onClick={() => setHmSelected(null)}
                        style={{
                          fontFamily:'var(--font-mono)', fontSize:11,
                          color:'var(--t3)', background:'none', border:'none',
                          cursor:'pointer', padding:'4px 8px',
                        }}
                      >✕ 닫기</button>
                    </div>

                    {/* 정책 목록 */}
                    <div style={{background:'var(--s1)'}}>
                      {cell.policies.map((p, pi) => (
                        <div key={p.id} style={{
                          padding:'14px 18px',
                          borderBottom: pi < cell.policies.length-1 ? '1px solid var(--wire)' : 'none',
                        }}>
                          {/* 정책 헤더 */}
                          <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:8}}>
                            <span style={{
                              fontFamily:'var(--font-mono)', fontSize:8,
                              color: p.status==='active'?'#3d9e6a':'#b8924a',
                              border:`1px solid ${p.status==='active'?'rgba(61,158,106,.3)':'rgba(184,146,74,.3)'}`,
                              borderRadius:2, padding:'2px 6px', flexShrink:0, marginTop:3,
                            }}>{p.status==='active'?'ACTIVE':'UPCOMING'}</span>
                            <div>
                              <div style={{fontFamily:'var(--font-serif)',fontSize:16,color:'var(--t1)',marginBottom:3}}>
                                {p.name}
                              </div>
                              <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--amber)'}}>
                                {p.budget}
                              </div>
                            </div>
                          </div>

                          {/* 배경 설명 */}
                          <p style={{fontSize:12,color:'var(--t2)',lineHeight:1.8,marginBottom:12,
                            whiteSpace:'pre-wrap'}}>
                            {p.background}
                          </p>

                          {/* 관련주 + 리스크 2컬럼 */}
                          <div style={{
                            display:'grid',
                            gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
                            gap:1, background:'rgba(255,255,255,0.06)',
                          }}>
                            <div style={{background:'var(--s2)',padding:'12px 14px'}}>
                              <div style={{
                                fontFamily:'var(--font-mono)',fontSize:8,color:'#3d9e6a',
                                letterSpacing:'.07em',marginBottom:8,
                              }}>수혜 산업</div>
                              {(p.beneficiaries||[]).filter(b=>b.pos).slice(0,4).map((b,bi) => (
                                <div key={bi} style={{marginBottom:8}}>
                                  <div style={{display:'flex',justifyContent:'space-between',gap:8,marginBottom:2}}>
                                    <span style={{fontSize:12,color:'var(--t1)',fontWeight:500}}>{b.sector}</span>
                                    <div style={{display:'flex',gap:2,flexShrink:0}}>
                                      {[1,2,3,4,5].map(i=>(
                                        <div key={i} style={{
                                          width:6,height:6,borderRadius:1,
                                          background:i<=b.impact?'#3d9e6a':'rgba(255,255,255,0.07)',
                                        }}/>
                                      ))}
                                    </div>
                                  </div>
                                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--amber)'}}>
                                    {(b.stocks||[]).slice(0,3).join(' · ')}
                                    {(b.etfs||[]).length>0 && (
                                      <span style={{color:'var(--t3)',marginLeft:6}}>
                                        ETF {b.etfs.slice(0,2).join(' ')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{background:'var(--s2)',padding:'12px 14px'}}>
                              <div style={{
                                fontFamily:'var(--font-mono)',fontSize:8,color:'#b84a4a',
                                letterSpacing:'.07em',marginBottom:8,
                              }}>리스크 · 타임라인</div>
                              {p.risks && (
                                <div style={{
                                  fontSize:11,color:'var(--t2)',lineHeight:1.7,marginBottom:10,
                                  padding:'8px 10px',
                                  background:'rgba(184,74,74,0.06)',
                                  border:'1px solid rgba(184,74,74,0.12)',
                                  borderRadius:3,
                                }}>
                                  ⚠ {p.risks}
                                </div>
                              )}
                              {(p.timeline||[]).slice(-4).map((t,ti) => (
                                <div key={ti} style={{
                                  display:'flex',gap:8,marginBottom:6,
                                  paddingLeft:8, borderLeft:'1px solid var(--wire2)',
                                }}>
                                  <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                                    color:c.color,flexShrink:0,minWidth:60}}>{t.date}</div>
                                  <div style={{fontSize:11,color:'var(--t2)',lineHeight:1.5}}>{t.event}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            </section>

{/* ⑥ 이벤트 캘린더 */}
            <section id="calendar" style={{padding:mobile?'40px 0 32px':'60px 0 48px',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <Label text="정책 이벤트 캘린더" />
              <SecTitle>주시해야 할 정책 일정</SecTitle>
              <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.75,marginBottom:20}}>
                앞으로 예정된 정책 발효·시행·표결 일정을 시간순으로 정리했습니다.
              </p>
              <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
                {[2026,2027,2028].map(y=>(
                  <button key={y} onClick={()=>setCalYear(y)} style={btn(calYear===y)}>
                    {y}년
                  </button>
                ))}
                <select value={calCountry} onChange={e=>setCalCountry(e.target.value)}
                  style={{fontFamily:'var(--font-mono)',fontSize:11,background:'var(--s2)',
                    border:'1px solid var(--wire2)',borderRadius:4,padding:'6px 10px',
                    color:'var(--t1)',outline:'none',marginLeft:4}}>
                  <option value="all">전체 국가</option>
                  {countries.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(mo => {
                  const mes = calByMonth[mo]||[];
                  if(!mes.length) return null;
                  return (
                    <div key={mo} style={{display:'grid',gridTemplateColumns:'64px 1fr',marginBottom:6}}>
                      <div style={{fontFamily:'var(--font-serif)',fontSize:16,color:'var(--amber)',
                        paddingTop:12,paddingRight:12,textAlign:'right',lineHeight:1}}>
                        {MONTHS[mo-1]}
                      </div>
                      <div style={{borderLeft:'1px solid var(--wire2)',paddingLeft:18,
                        paddingBottom:14,paddingTop:8,display:'flex',flexDirection:'column',gap:10}}>
                        {mes.map((e,i)=>(
                          <div key={i} style={{display:'flex',gap:10,position:'relative'}}>
                            <div style={{position:'absolute',left:-22,top:5,width:9,height:9,
                              borderRadius:'50%',background:e.country.color,
                              border:'2px solid var(--ink)'}} />
                            <span style={{fontSize:14,flexShrink:0}}>{e.country.flag}</span>
                            <div>
                              <div style={{display:'flex',gap:6,marginBottom:3,flexWrap:'wrap'}}>
                                <span style={{fontFamily:'var(--font-mono)',fontSize:8,
                                  color:e.status==='active'?'#3d9e6a':'#b8924a',
                                  border:`1px solid ${e.status==='active'?'rgba(61,158,106,.3)':'rgba(184,146,74,.3)'}`,
                                  borderRadius:2,padding:'1px 5px'}}>
                                  {e.status==='active'?'ACTIVE':'UPCOMING'}
                                </span>
                                <span style={{fontFamily:'var(--font-mono)',fontSize:9,
                                  color:e.country.color}}>{e.date}</span>
                              </div>
                              <div style={{fontSize:13,color:'var(--t1)',fontWeight:500,
                                marginBottom:2}}>{e.event}</div>
                              <div style={{fontSize:11,color:'var(--t2)'}}>{e.policy}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {calNoMo.length>0 && (
                  <div style={{display:'grid',gridTemplateColumns:'64px 1fr',marginTop:6}}>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--t3)',
                      paddingTop:12,paddingRight:12,textAlign:'right'}}>연중</div>
                    <div style={{borderLeft:'1px solid var(--wire)',paddingLeft:18,
                      paddingTop:8,display:'flex',flexDirection:'column',gap:8}}>
                      {calNoMo.map((e,i)=>(
                        <div key={i} style={{display:'flex',gap:10,position:'relative'}}>
                          <div style={{position:'absolute',left:-22,top:5,width:7,height:7,
                            borderRadius:'50%',background:e.country.color,
                            border:'2px solid var(--ink)'}} />
                          <span style={{fontSize:13}}>{e.country.flag}</span>
                          <div>
                            <div style={{fontSize:13,color:'var(--t1)',marginBottom:2}}>
                              {e.event}
                            </div>
                            <div style={{fontSize:11,color:'var(--t2)'}}>{e.policy}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!calEvents.length && (
                  <div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--t3)',
                    padding:'40px 0',textAlign:'center'}}>
                    {calYear}년 이벤트가 없습니다
                  </div>
                )}
              </div>
            </section>

            
            {/* ⑦-a 정책 충돌 지도 */}
            <section id="conflict" style={{padding:mobile?'40px 0 32px':'60px 0 48px',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <Label text="정책 충돌 지도" />
              <SecTitle>정책 간 긴장·충돌 관계</SecTitle>
              <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.75,marginBottom:28}}>
                서로 방향이 다른 정책들이 어떻게 충돌하는지. 충돌 구간에서 투자 판단이 갈린다.
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:1,background:'rgba(255,255,255,0.06)'}}>
                {CONFLICT_DATA.map(c => (
                  <div key={c.id} style={{background:'var(--s1)',padding:mobile?'16px':'20px 24px'}}>
                    {/* 헤더 */}
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                      <div style={{display:'flex',gap:4,alignItems:'center'}}>
                        {[1,2,3,4,5].map(i=>(
                          <div key={i} style={{width:8,height:8,borderRadius:'50%',
                            background:i<=c.tension?'#b84a4a':'rgba(255,255,255,0.1)'}}/>
                        ))}
                      </div>
                      <span style={{fontFamily:'var(--font-serif)',fontSize:mobile?15:18,
                        color:'var(--t1)',fontWeight:400}}>{c.title}</span>
                    </div>
                    {/* 충돌 구조 */}
                    <div style={{display:'grid',
                      gridTemplateColumns:mobile?'1fr':'1fr 40px 1fr',
                      gap:mobile?8:0,marginBottom:14,alignItems:'center'}}>
                      <div style={{background:`${c.a.color}12`,border:`1px solid ${c.a.color}40`,
                        borderRadius:3,padding:'10px 14px'}}>
                        <div style={{fontFamily:'var(--font-mono)',fontSize:10,
                          color:c.a.color,marginBottom:5}}>{c.a.label}</div>
                        <div style={{fontSize:12,color:'var(--t2)',lineHeight:1.6}}>{c.a.desc}</div>
                      </div>
                      <div style={{textAlign:'center',fontFamily:'var(--font-mono)',
                        fontSize:16,color:'#b84a4a'}}>⚡</div>
                      <div style={{background:`${c.b.color}12`,border:`1px solid ${c.b.color}40`,
                        borderRadius:3,padding:'10px 14px'}}>
                        <div style={{fontFamily:'var(--font-mono)',fontSize:10,
                          color:c.b.color,marginBottom:5}}>{c.b.label}</div>
                        <div style={{fontSize:12,color:'var(--t2)',lineHeight:1.6}}>{c.b.desc}</div>
                      </div>
                    </div>
                    {/* 결과 분석 */}
                    <div style={{fontSize:12,color:'var(--t2)',lineHeight:1.8,
                      padding:'10px 14px',background:'rgba(255,255,255,0.03)',
                      borderLeft:'2px solid var(--amber)',marginBottom:12}}>
                      {c.result}
                    </div>
                    {/* 수혜/피해 */}
                    <div style={{display:'flex',gap:mobile?8:16,flexWrap:'wrap'}}>
                      <div>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:9,
                          color:'#3d9e6a',marginRight:6}}>▲ 수혜 가능</span>
                        {c.winners.map(w=>(
                          <span key={w} style={{fontFamily:'var(--font-mono)',fontSize:10,
                            color:'var(--amber)',background:'rgba(184,146,74,0.1)',
                            border:'1px solid rgba(184,146,74,0.2)',
                            borderRadius:2,padding:'1px 6px',marginRight:4}}>{w}</span>
                        ))}
                      </div>
                      <div>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:9,
                          color:'#b84a4a',marginRight:6}}>▼ 압박 가능</span>
                        {c.losers.map(l=>(
                          <span key={l} style={{fontFamily:'var(--font-mono)',fontSize:10,
                            color:'var(--t3)',background:'rgba(184,74,74,0.08)',
                            border:'1px solid rgba(184,74,74,0.15)',
                            borderRadius:2,padding:'1px 6px',marginRight:4}}>{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ⑦-b 섹터 로테이션 타임라인 */}
            <section id="rotation" style={{padding:mobile?'40px 0 32px':'60px 0 48px',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <Label text="섹터 로테이션" />
              <SecTitle>정책 사이클 기반 섹터 순서</SecTitle>
              <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.75,marginBottom:28}}>
                정책 흐름에 따라 어떤 섹터가 언제 부각되는지. 리서치 참고용입니다.
              </p>
              <div style={{display:'flex',flexDirection:mobile?'column':'row',
                gap:1,background:'rgba(255,255,255,0.06)',overflowX:mobile?'visible':'auto'}}>
                {ROTATION_DATA.map((r,i) => (
                  <div key={i} style={{flex:1,minWidth:mobile?'auto':200,
                    background:'var(--s1)',padding:'18px 16px',
                    position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',top:0,left:0,right:0,
                      height:3,background:r.color}}/>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                      color:r.color,marginBottom:6,letterSpacing:'.05em'}}>{r.period}</div>
                    <div style={{fontFamily:'var(--font-serif)',fontSize:14,
                      color:'var(--t1)',marginBottom:10,lineHeight:1.3}}>{r.theme}</div>
                    <div style={{fontSize:11,color:'var(--t2)',lineHeight:1.7,
                      marginBottom:12}}>{r.reason}</div>
                    <div style={{marginBottom:10}}>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:8,
                        color:'#3d9e6a',marginBottom:5}}>주목 섹터</div>
                      {r.sectors.map(s=>(
                        <div key={s} style={{fontFamily:'var(--font-mono)',fontSize:10,
                          color:'var(--amber)',marginBottom:3}}>→ {s}</div>
                      ))}
                    </div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                      color:'var(--t3)',lineHeight:1.6,
                      borderTop:'1px solid var(--wire)',paddingTop:8}}>
                      주의: {r.avoid[0]}
                    </div>
                  </div>
                ))}
              </div>
            </section>

{/* ⑦ 리스크 레이더 */}
            <section id="risk" style={{padding:mobile?'40px 0 56px':'60px 0 80px',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <Label text="리스크 레이더 — 2026년 4월 기준" />
              <SecTitle>지금 가장 모니터링할 리스크</SecTitle>
              <p style={{fontSize:13,color:'var(--t2)',lineHeight:1.75,marginBottom:20}}>
                발생 가능성 × 충격 규모 기준 정렬 · 헤지 전략 포함
              </p>
              <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
                {riskCats.map(c=>(
                  <button key={c} onClick={()=>setRiskCat(c)} style={btn(riskCat===c)}>
                    {c==='all'?'전체':c}
                  </button>
                ))}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {riskSorted.map(r=>(
                  <div key={r.id} style={{background:'var(--s1)',border:'1px solid var(--wire)',
                    borderLeft:`3px solid ${r.color}`,borderRadius:4,overflow:'hidden'}}>
                    <div style={{padding:'14px 18px 12px',borderBottom:'1px solid var(--wire)'}}>
                      <div style={{display:'flex',alignItems:'flex-start',
                        justifyContent:'space-between',gap:14,marginBottom:8}}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{display:'flex',gap:3}}>
                            {[1,2,3,4,5].map(i=>(
                              <div key={i} style={{width:8,height:8,borderRadius:'50%',
                                background:i<=r.lvl?r.color:'rgba(255,255,255,0.07)'}} />
                            ))}
                          </div>
                          <h3 style={{fontFamily:'var(--font-serif)',fontSize:mobile?14:17,
                            fontWeight:400,color:'var(--t1)',lineHeight:1.2}}>
                            {r.title}
                          </h3>
                        </div>
                        <div style={{display:'flex',gap:5,flexShrink:0,flexWrap:'wrap'}}>
                          <span style={{fontFamily:'var(--font-mono)',fontSize:8,
                            color:PROB_C[r.prob],background:`${PROB_C[r.prob]}18`,
                            border:`1px solid ${PROB_C[r.prob]}40`,
                            borderRadius:2,padding:'2px 6px'}}>
                            확률 {r.prob}
                          </span>
                          <span style={{fontFamily:'var(--font-mono)',fontSize:8,
                            color:'var(--t2)',background:'rgba(255,255,255,.04)',
                            border:'1px solid var(--wire2)',borderRadius:2,padding:'2px 6px'}}>
                            충격 {r.impact}
                          </span>
                        </div>
                      </div>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                        color:r.color,marginBottom:8}}>
                        ⏱ {r.time} · {r.cat}
                      </div>
                      <p style={{fontSize:12,color:'var(--t2)',lineHeight:1.8}}>{r.desc}</p>
                    </div>
                    <div style={{display:'grid',
                      gridTemplateColumns:mobile?'1fr':'1fr 1fr',
                      borderTop:'1px solid var(--wire)'}}>
                      <div style={{padding:'10px 16px',
                        borderRight:mobile?'none':'1px solid var(--wire)',
                        borderBottom:mobile?'1px solid var(--wire)':'none'}}>
                        <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'#b84a4a',
                          letterSpacing:'.07em',marginBottom:7}}>영향 자산</div>
                        {r.affected.map((a,i)=>(
                          <div key={i} style={{fontSize:11,color:'var(--t2)',lineHeight:1.7}}>
                            · {a}
                          </div>
                        ))}
                      </div>
                      <div style={{padding:'10px 16px'}}>
                        <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'#3d9e6a',
                          letterSpacing:'.07em',marginBottom:7}}>헤지 전략</div>
                        {r.hedge.map((h,i)=>(
                          <div key={i} style={{fontFamily:'var(--font-mono)',fontSize:10,
                            color:'var(--amber)',lineHeight:1.8}}>
                            → {h}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 푸터 */}
            <div style={{borderTop:'1px solid var(--wire)',marginTop:8,
              padding:mobile?'24px 0 40px':'28px 0 40px'}}>
              {/* 면책 조항 */}
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,
                color:'rgba(255,255,255,0.2)',lineHeight:1.9,
                textAlign:'center',marginBottom:20,
                padding:'12px 16px',
                background:'rgba(255,255,255,0.02)',
                border:'1px solid rgba(255,255,255,0.05)',
                borderRadius:4}}>
                제공되는 모든 정보는 공개된 정책 데이터를 기반으로 한 참고 자료이며,
                특정 금융상품의 매수·매도를 권유하지 않습니다.
                투자 결정으로 인한 손익은 전적으로 투자자 본인에게 귀속됩니다.
              </div>
              {/* 링크 + 카피라이트 */}
              <div style={{display:'flex',alignItems:'center',
                justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:10,
                  color:'rgba(255,255,255,0.25)'}}>
                  © 자산제곱 — 정책 탐지 레이더 2026
                </span>
                <div style={{display:'flex',gap:mobile?12:20,flexWrap:'wrap'}}>
                  {[
                    {l:'Threads', h:'https://www.threads.com/@asset.x2'},
                    {l:'YouTube', h:'https://www.youtube.com/channel/UCpTC-SMFjA3EDRhZIKOcKuQ'},
                    {l:'프로젝트방', h:'https://t.me/+2Qw1cAZTm8FjMGNl'},
                    {l:'구독자료', h:'https://contents.premium.naver.com/assetx2/assetsx2'},
                  ].map(({l,h})=>(
                    <a key={l} href={h} target="_blank" rel="noopener"
                      style={{fontFamily:'var(--font-mono)',fontSize:10,
                        color:'rgba(255,255,255,0.3)',textDecoration:'none',
                        transition:'color .12s'}}
                      onMouseEnter={e=>e.currentTarget.style.color='var(--amber)'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-track { background:var(--s1); }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
      `}</style>
    </>
  );
}



