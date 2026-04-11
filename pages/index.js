import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { COUNTRIES as STATIC, MACRO_THEMES, THEMES } from '../data/policies';

const NAV_LINKS = [
  { label:'Threads',   href:'https://www.threads.com/@asset.x2', color:'#e4e4e4', bg:'rgba(255,255,255,0.08)', border:'rgba(255,255,255,0.2)', icon:'<svg width="13" height="13" viewBox="0 0 192 192" fill="currentColor"><path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-43.246-41.457-43.398h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 6.987 4.676 15.997 6.95 25.379 6.432 12.359-.687 22.081-5.391 28.89-13.975 5.186-6.658 8.446-15.29 9.87-26.147 5.922 3.577 10.302 8.287 12.666 13.952 3.989 9.711 4.222 25.701-8.297 38.21-10.916 10.909-24.04 15.633-43.867 15.766-21.999-.149-38.646-7.215-49.482-21.009C37.458 134.017 32.2 115.61 32 92c.2-23.61 5.458-42.017 15.694-54.744 10.836-13.794 27.483-20.86 49.482-21.009 22.126.15 39.047 7.245 50.34 21.084 5.57 6.858 9.616 15.369 12.068 25.292l16.21-4.324c-2.999-11.607-7.861-21.666-14.578-29.963C147.166 10.246 126.354 1.176 100.086 1L99.803 1C73.587 1.176 52.994 10.274 39.371 26.607 27.366 41.005 21.2 61.565 21 92.001v.999c.2 30.435 6.366 50.996 18.371 65.394 13.623 16.333 34.216 25.431 60.432 25.607h.283c23.102-.149 39.376-6.231 52.676-19.521 17.84-17.828 17.342-40.208 11.501-53.962-4.198-10.217-12.376-18.515-22.726-23.53z"/></svg>' },
  { label:'YouTube',   href:'https://www.youtube.com/channel/UCpTC-SMFjA3EDRhZIKOcKuQ', color:'#ff4444', bg:'rgba(255,68,68,0.1)', border:'rgba(255,68,68,0.3)', icon:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
  { label:'프로젝트방', href:'https://t.me/+2Qw1cAZTm8FjMGNl', color:'#2aabee', bg:'rgba(42,171,238,0.1)', border:'rgba(42,171,238,0.3)', icon:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>' },
  { label:'구독자료',  href:'https://contents.premium.naver.com/assetx2/assetsx2', color:'#03c75a', bg:'rgba(3,199,90,0.1)', border:'rgba(3,199,90,0.3)', icon:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>' },
];

const SECTIONS = [
  { id:'hero',      label:'소개' },
  { id:'policies',  label:'국가별 정책' },
  { id:'flow',      label:'연결고리 맵' },
  { id:'screener',  label:'수혜주 스크리너' },
  { id:'heatmap',   label:'정책 히트맵' },
  { id:'calendar',  label:'이벤트 캘린더' },
  { id:'risk',      label:'리스크 레이더' },
];

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => { const fn = () => setM(window.innerWidth < 900); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);
  return m;
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Dots({ value, pos }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => <div key={i} style={{ width:6, height:6, borderRadius:1, background: i<=Math.abs(value) ? (pos?'#3d9e6a':'#b84a4a') : 'rgba(255,255,255,0.07)' }} />)}
    </div>
  );
}

function SecLabel({ text }) {
  return <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--amber)', letterSpacing:'.12em', marginBottom:10 }}>{text}</div>;
}

/* ── 정책 아코디언 ── */
function PolicyRow({ policy, color }) {
  const [open, setOpen] = useState(false);
  const sc = policy.status==='active'?'#3d9e6a':policy.status==='upcoming'?'#b8924a':'#555';
  const sl = policy.status==='active'?'ACTIVE':policy.status==='upcoming'?'UPCOMING':'PAUSED';
  return (
    <div style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      <div onClick={()=>setOpen(!open)} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12, padding:'16px 0', cursor:'pointer' }}>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ width:2, background:color, alignSelf:'stretch', flexShrink:0, borderRadius:1 }} />
          <div style={{ minWidth:0 }}>
            <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:sc, border:`1px solid ${sc}40`, background:`${sc}12`, borderRadius:2, padding:'2px 7px' }}>{sl}</span>
              {(policy.themes||[]).slice(0,2).map(t => <span key={t} style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.28)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:2, padding:'2px 6px' }}>{t.toUpperCase()}</span>)}
            </div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:20, fontWeight:400, color:'var(--t1)', lineHeight:1.2 }}>{policy.name}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--amber)', marginTop:4 }}>{policy.budget}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--t2)' }}>{policy.date}</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:open?color:'var(--t3)', transition:'color .15s' }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ paddingBottom:24, paddingLeft:14, animation:'fadeIn .15s ease' }}>
          <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.85, marginBottom:20 }}>{policy.background}</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1, background:'rgba(255,255,255,0.06)' }}>
            <div style={{ background:'var(--s1)', padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--t3)', letterSpacing:'.08em', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>수혜 산업 매핑</div>
              {(policy.beneficiaries||[]).map((b,i) => (
                <div key={i} style={{ marginBottom:10, paddingBottom:10, borderBottom:i<(policy.beneficiaries||[]).length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:3 }}>
                    <div style={{ fontSize:12, color:'var(--t1)', fontWeight:500 }}>{b.sector}</div>
                    <Dots value={b.impact} pos={b.pos} />
                  </div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t2)', marginBottom:2 }}>{(b.stocks||[]).slice(0,2).join(' · ')}</div>
                  {(b.etfs||[]).length>0 && <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--amber)' }}>ETF {b.etfs.slice(0,3).join(' · ')}</div>}
                </div>
              ))}
            </div>
            <div style={{ background:'var(--s1)', padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--t3)', letterSpacing:'.08em', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>규모 · 예산</div>
              {(policy.budgetData||[]).map((b,i) => (
                <div key={i} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:11, color:'var(--t2)', marginBottom:4 }}>{b.name}</div>
                  <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min(Math.round((b.value/(b.max||b.value*1.5))*100),100)}%`, background:color+'99', borderRadius:2 }} />
                  </div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t3)', marginTop:2 }}>{typeof b.value==='number'&&b.value<1?b.value.toFixed(2):(b.value||0).toLocaleString()}</div>
                </div>
              ))}
              {policy.risks && (
                <div style={{ marginTop:10, padding:'10px 12px', background:'rgba(180,60,60,.04)', border:'1px solid rgba(180,60,60,.1)', borderRadius:3 }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'#a04040', letterSpacing:'.07em', marginBottom:5 }}>RISK FACTOR</div>
                  <div style={{ fontSize:11, color:'var(--t2)', lineHeight:1.65 }}>{policy.risks}</div>
                </div>
              )}
            </div>
            <div style={{ background:'var(--s1)', padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--t3)', letterSpacing:'.08em', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>타임라인</div>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:5, top:6, bottom:0, width:1, background:'rgba(255,255,255,0.06)' }} />
                {(policy.timeline||[]).map((t,j) => (
                  <div key={j} style={{ display:'flex', gap:12, marginBottom:10, position:'relative' }}>
                    <div style={{ width:11, height:11, borderRadius:'50%', flexShrink:0, background:j===(policy.timeline||[]).length-1?color:'var(--s3)', border:`1px solid ${color}50`, marginTop:1 }} />
                    <div>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color, marginBottom:2 }}>{t.date}</div>
                      <div style={{ fontSize:11, color:'var(--t2)', lineHeight:1.5 }}>{t.event}</div>
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

/* ── 연결고리 맵 데이터 ── */
const FLOWS = [
  { id:'dollar_ai', title:'달러 패권 → AI 패권', color:'#4a7fd4', steps:[{l:'달러 패권 위기',s:'위안화 국제화·페트로위안',t:'threat'},{l:'GENIUS Act',s:'스테이블코인 법제화',t:'policy'},{l:'미국채 수요↑',s:'스테이블코인 준비자산',t:'effect'},{l:'Stargate AI',s:'5,000억 달러 투자',t:'policy'},{l:'AI 인프라=달러',s:'글로벌 AI 서비스',t:'effect'},{l:'달러 패권 강화',s:'디지털·AI 시대',t:'outcome'}], bens:['코인베이스(COIN)','엔비디아(NVDA)','SK하이닉스(000660)','미국 국채'], risks:['DeepSeek AI 자립 가속','유럽 MiCA 대항마'] },
  { id:'hbm', title:'HBM 병목 — AI의 급소', color:'#c9a83a', steps:[{l:'AI 수요 폭증',s:'GPT·Claude·Gemini',t:'trigger'},{l:'GPU→HBM 필수',s:'H100/B200 메모리',t:'effect'},{l:'SK하이닉스·삼성',s:'글로벌 점유율 95%+',t:'chokepoint'},{l:'미국 수출통제',s:'중국 AI 봉쇄',t:'policy'},{l:'화웨이 어센드 병목',s:'HBM 없이 AI칩 불가',t:'effect'},{l:'한국 전략자산화',s:'미·중 레버리지',t:'outcome'}], bens:['SK하이닉스(000660)','삼성전자(005930)','한미반도체(042700)','SMH ETF'], risks:['중국 CXMT 추격','VEU 자격 만료 2025.12'] },
  { id:'kdefense', title:'K-방산 2차 성장 사이클', color:'#6e8fa8', steps:[{l:'러-우 전쟁 장기화',s:'유럽 안보 위기',t:'trigger'},{l:'트럼프 NATO 압박',s:'GDP 5% 요구',t:'policy'},{l:'EU ReArm 8천억€',s:'유럽 국방비 급증',t:'policy'},{l:'K-방산 가성비',s:'서방 대비 30~40% 저렴',t:'effect'},{l:'폴란드·루마니아',s:'2차 대형 계약',t:'effect'},{l:'2030년 500억$',s:'세계 3위 목표',t:'outcome'}], bens:['한화에어로(012450)','LIG넥스원(079550)','KAI(047810)','한화오션(042660)'], risks:['납기 지연','유럽 자국 방산 경쟁 심화'] },
  { id:'petro', title:'페트로달러 균열', color:'#e07b3a', steps:[{l:'1973 페트로달러',s:'원유=달러 결제',t:'base'},{l:'사우디 페트로위안',s:'시진핑-빈살만 2023',t:'threat'},{l:'BRICS mBridge',s:'달러 대안 결제망',t:'threat'},{l:'미국 LNG 수출',s:'LNG=달러 에너지',t:'policy'},{l:'EU·일본 LNG',s:'관세 협상 카드',t:'effect'},{l:'달러 패권 이전',s:'페트로달러의 현대판',t:'outcome'}], bens:['셰니어에너지(LNG)','EQT(EQT)','금(GLD)','DXY'], risks:['사우디 추가 탈달러','BRICS 통화 현실화'] },
];
const TC = { trigger:'#b84a4a',threat:'#b84a4a',base:'#555',policy:'#4a7fd4',chokepoint:'#c9a83a',effect:'#3d9e6a',outcome:'#b8924a' };
const TL = { trigger:'TRIGGER',threat:'THREAT',base:'BASE',policy:'POLICY',chokepoint:'CHOKE',effect:'EFFECT',outcome:'OUTCOME' };

/* ── 리스크 데이터 ── */
const RISKS = [
  {id:'tariff',lvl:5,title:'미-중 관세 협상 결렬',cat:'지정학',prob:'중간',impact:'극대',time:'2025 Q2~Q3',desc:'90일 유예(~07.08) 내 합의 실패 시 145% 유지. 중국 희귀광물 전면 수출 금지·미국채 매각으로 공급망 대혼란.',affected:['반도체 공급망','한국 수출 기업','글로벌 인플레이션'],hedge:['금(GLD)','달러 인버스(UDN)','국내 방산주'],color:'#b84a4a'},
  {id:'boj',lvl:4,title:'BOJ 급격한 금리 인상',cat:'통화',prob:'중간',impact:'대',time:'2025 Q2~Q4',desc:'예상 초과 인상 시 엔 캐리 청산. 닛케이·코스피·나스닥 동반 급락. VIX 50+ 시나리오.',affected:['일본 수출주','코스피','나스닥 성장주'],hedge:['엔화 선물(FXY)','금(GLD)','단기채(SHY)'],color:'#b87030'},
  {id:'ai_bubble',lvl:4,title:'AI 버블 — 데이터센터 과잉',cat:'AI·기술',prob:'중간',impact:'대',time:'2025 하반기~2026',desc:'Stargate 대비 실수요 미달 시. 딥시크 효율화로 GPU 수요 과잉 노출. 엔비디아 40% 조정 연쇄.',affected:['엔비디아(NVDA)','SK하이닉스 HBM','클라우드 빅테크'],hedge:['인버스 반도체(SOXS)','가치주 로테이션'],color:'#7a7ad4'},
  {id:'taiwan',lvl:4,title:'대만해협 긴장 고조',cat:'지정학',prob:'낮음',impact:'극대',time:'상시',desc:'발생 시 TSMC 중단. 글로벌 반도체 충격. 지정학 프리미엄 선행.',affected:['TSMC','글로벌 반도체','애플 공급망'],hedge:['미국 방산(ITA)','국내 방산주','금(GLD)'],color:'#b84a4a'},
  {id:'korea',lvl:3,title:'한국 정치 불확실성',cat:'정치',prob:'높음',impact:'중간',time:'2025 Q3',desc:'조기 대선 후 밸류업·원전 정책 연속성 불확실. 외국인 관망 연장.',affected:['밸류업 금융주','원전 관련주','코스피 외국인'],hedge:['환헤지 ETF','방산주 비중 조절'],color:'#c9a83a'},
  {id:'china_def',lvl:3,title:'중국 디플레이션 장기화',cat:'경제',prob:'높음',impact:'중간',time:'2025~2026',desc:'부동산·청년 실업·소비 침체 복합. EV·철강 과잉으로 글로벌 가격 하락 압박.',affected:['포스코(005490)','LG에너지솔루션','화학·소재'],hedge:['중국 제외 신흥국','베트남·인도 대체'],color:'#b84a4a'},
  {id:'rare',lvl:3,title:'중국 희귀광물 전면 수출 금지',cat:'공급망',prob:'중간',impact:'대',time:'관세 결렬 시',desc:'전면 금지 시 서방 반도체·방산·EV 공급망 타격. 대안 구축 3~5년.',affected:['반도체 장비','방산 소재','EV 배터리'],hedge:['MP머티리얼즈(MP)','REMX ETF'],color:'#b5936e'},
  {id:'fiscal',lvl:3,title:'미국 재정 위기',cat:'재정',prob:'낮음',impact:'극대',time:'2025 하반기',desc:'적자 확대 → 신용등급 하락 → 달러 약세 가속. 모든 자산 동반 하락.',affected:['미국 장기채(TLT)','달러 인덱스','글로벌 주식'],hedge:['금(GLD)','단기 국채'],color:'#c4a1e8'},
];
const PC = {'높음':'#b84a4a','중간':'#b8924a','낮음':'#3d9e6a'};

const SECTORS = [{id:'semiconductor',l:'반도체·AI칩'},{id:'ai_policy',l:'AI 정책'},{id:'defense',l:'방산'},{id:'energy_transition',l:'에너지 전환'},{id:'nuclear',l:'원전·SMR'},{id:'dollar_hegemony',l:'달러 패권'},{id:'stablecoin',l:'스테이블코인'},{id:'reshoring',l:'리쇼어링·관세'},{id:'yuan_intl',l:'위안화 국제화'},{id:'critical_minerals',l:'희귀광물'},{id:'supply_chain',l:'공급망 재편'},{id:'debt_fiscal',l:'재정·부채'}];
function cellBg(s){if(!s)return'rgba(255,255,255,0.03)';if(s<=2)return'rgba(184,146,74,0.12)';if(s<=4)return'rgba(184,146,74,0.28)';if(s<=6)return'rgba(184,146,74,0.48)';if(s<=8)return'rgba(184,146,74,0.68)';return'rgba(184,146,74,0.88)';}
function cellTxt(s){if(!s)return'var(--t3)';if(s<=3)return'rgba(184,146,74,0.8)';return s>=7?'var(--ink)':'var(--amber)';}
const MONTHS=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

export default function Home() {
  const [countries, setCountries] = useState(STATIC);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeCountry, setActiveCountry] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // 스크리너 상태
  const [scSearch, setScSearch] = useState('');
  const [scCountry, setScCountry] = useState('all');
  const [scImpact, setScImpact] = useState('all');

  // 히트맵 hover
  const [hmHover, setHmHover] = useState(null);

  // 연결고리 맵 선택
  const [flowActive, setFlowActive] = useState('dollar_ai');

  // 캘린더
  const [calYear, setCalYear] = useState(2025);
  const [calCountry, setCalCountry] = useState('all');

  // 리스크 카테고리
  const [riskCat, setRiskCat] = useState('all');

  useEffect(() => {
    fetch('/api/policies').then(r=>r.json()).then(d=>{
      if(d.countries) setCountries(d.countries);
    }).catch(()=>{});
  }, []);

  // 스크롤 감지 → 활성 섹션
  useEffect(() => {
    const handler = () => {
      const offsets = SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        if(!el) return { id:s.id, top: Infinity };
        return { id:s.id, top: Math.abs(el.getBoundingClientRect().top - 80) };
      });
      const closest = offsets.reduce((a,b) => a.top < b.top ? a : b);
      setActiveSection(closest.id);
    };
    window.addEventListener('scroll', handler, { passive:true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const total = countries.reduce((s,c)=>s+c.policies.length,0);

  // 히트맵 행렬 계산
  const matrix = {};
  countries.forEach(c=>{ matrix[c.id]={}; SECTORS.forEach(s=>{ const ps=c.policies.filter(p=>(p.themes||[]).includes(s.id)); const score=Math.min(ps.length*2+ps.reduce((sum,p)=>(p.beneficiaries||[]).filter(b=>b.pos).reduce((s2,b)=>s2+b.impact*0.3,0)+sum,0),10); matrix[c.id][s.id]={score:Math.round(score),count:ps.length,policies:ps}; });});
  const hmHovered = hmHover ? matrix[hmHover.c]?.[hmHover.s] : null;

  // 스크리너 데이터
  const allRows = [];
  countries.forEach(c=>{ c.policies.forEach(p=>{ (p.beneficiaries||[]).forEach(b=>{ (b.stocks||[]).forEach(s=>{ allRows.push({stock:s,sector:b.sector,impact:b.impact,pos:b.pos,etfs:b.etfs||[],policy:p.name,country:c}); }); }); }); });
  const seen = new Set();
  let scData = allRows.filter(r=>{ const k=r.stock+r.country.id+r.policy; if(seen.has(k))return false; seen.add(k); return true; });
  if(scCountry!=='all') scData=scData.filter(r=>r.country.id===scCountry);
  if(scImpact==='pos') scData=scData.filter(r=>r.pos&&r.impact>=3);
  if(scImpact==='neg') scData=scData.filter(r=>!r.pos);
  if(scSearch) scData=scData.filter(r=>r.stock.toLowerCase().includes(scSearch.toLowerCase())||r.sector.toLowerCase().includes(scSearch.toLowerCase()));
  scData=[...scData].sort((a,b)=>(b.pos?b.impact:-b.impact)-(a.pos?a.impact:-a.impact));

  // 캘린더 이벤트
  const allEvents = [];
  countries.forEach(c=>{ c.policies.forEach(p=>{ (p.timeline||[]).forEach(t=>{ const m=t.date.match(/(\d{4})[.\-](\d{1,2})/); const y2=t.date.match(/^(\d{4})$/); let yr=2025,mo=null; if(m){yr=+m[1];mo=+m[2];}else if(y2){yr=+y2[1];}else if(t.date.includes('2026'))yr=2026;else if(t.date.includes('2027'))yr=2027; allEvents.push({date:t.date,yr,mo,event:t.event,policy:p.name,status:p.status,country:c}); }); }); });
  let calData=allEvents.filter(e=>e.yr===calYear);
  if(calCountry!=='all') calData=calData.filter(e=>e.country.id===calCountry);
  calData.sort((a,b)=>(!a.mo&&b.mo)?1:(!b.mo&&a.mo)?-1:(a.mo||0)-(b.mo||0));
  const calGrouped={}; const calNoMo=[];
  calData.forEach(e=>{ if(e.mo){if(!calGrouped[e.mo])calGrouped[e.mo]=[];calGrouped[e.mo].push(e);}else calNoMo.push(e); });

  const flow = FLOWS.find(f=>f.id===flowActive);
  const riskSorted=[...(riskCat==='all'?RISKS:RISKS.filter(r=>r.cat===riskCat))].sort((a,b)=>b.lvl-a.lvl);

  const SB_W = 180;

  return (
    <>
      <Head>
        <title>Policy Radar — 자산제곱 글로벌 정책 분석</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight:'100vh', background:'var(--ink)' }}>

        {/* NAV */}
        <nav style={{ height:52, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', borderBottom:'1px solid var(--wire)', background:'var(--ink)', position:'fixed', top:0, left:0, right:0, zIndex:300 }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:12, fontWeight:500, color:'var(--amber)', letterSpacing:'.1em' }}>POLICY RADAR</span>
            {!isMobile && <>
              <span style={{ width:1, height:14, background:'rgba(255,255,255,0.1)', margin:'0 12px', display:'inline-block' }} />
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'rgba(255,255,255,0.2)', letterSpacing:'.06em' }}>자산제곱 INTELLIGENCE</span>
            </>}
          </div>
          {!isMobile ? (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginRight:6 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#3d9e6a', display:'inline-block', animation:'pulse 2.5s infinite' }} />
                <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'#3d9e6a', letterSpacing:'.06em' }}>LIVE</span>
              </div>
              {NAV_LINKS.map(({label,href,color,bg,border,icon})=>(
                <a key={label} href={href} target="_blank" rel="noopener" style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'var(--font-sans)', fontSize:12, fontWeight:500, color, background:bg, border:`1px solid ${border}`, borderRadius:6, padding:'5px 11px', textDecoration:'none', transition:'opacity .15s', whiteSpace:'nowrap' }}
                  onMouseEnter={e=>e.currentTarget.style.opacity='.7'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                  <span dangerouslySetInnerHTML={{__html:icon}} />
                  {label}
                </a>
              ))}
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#3d9e6a', display:'inline-block', animation:'pulse 2.5s infinite' }} />
              <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', gap:4, padding:4 }}>
                {[0,1,2].map(i=><span key={i} style={{ width:20, height:1.5, background:'rgba(255,255,255,0.6)', display:'block', borderRadius:1 }} />)}
              </button>
            </div>
          )}
        </nav>

        {/* 모바일 드로어 */}
        {isMobile && menuOpen && (
          <div style={{ position:'fixed', top:52, left:0, right:0, zIndex:299, background:'var(--s1)', borderBottom:'1px solid var(--wire)', padding:'16px 20px', display:'flex', flexDirection:'column', gap:10, animation:'fadeIn .15s ease' }}>
            {NAV_LINKS.map(({label,href,color,bg,border,icon})=>(
              <a key={label} href={href} target="_blank" rel="noopener" style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font-sans)', fontSize:14, fontWeight:500, color, background:bg, border:`1px solid ${border}`, borderRadius:8, padding:'12px 16px', textDecoration:'none' }}>
                <span dangerouslySetInnerHTML={{__html:icon}} />{label}
              </a>
            ))}
          </div>
        )}

        {/* 본문 */}
        <div style={{ display:'flex', paddingTop:52 }}>

          {/* ── 좌측 사이드바 ── */}
          {!isMobile && (
            <aside style={{ width:SB_W, flexShrink:0, position:'fixed', top:52, left:0, height:'calc(100vh - 52px)', overflowY:'auto', borderRight:'1px solid var(--wire)', background:'var(--s1)', display:'flex', flexDirection:'column' }}>

              {/* 통계 */}
              <div style={{ padding:'16px 14px', borderBottom:'1px solid var(--wire)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'rgba(255,255,255,0.06)' }}>
                  {[{n:total,l:'분석 정책'},{n:'5',l:'대상 국가'},{n:MACRO_THEMES.length,l:'매크로 테마'},{n:'매일',l:'AI 업데이트'}].map(({n,l})=>(
                    <div key={l} style={{ background:'var(--s1)', padding:'10px 10px' }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:18, color:'var(--amber)', lineHeight:1 }}>{n}</div>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.3)', marginTop:3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 섹션 네비 */}
              <div style={{ padding:'12px 0' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'.1em', padding:'0 14px', marginBottom:6 }}>섹션</div>
                {SECTIONS.map(s=>{
                  const isOn = activeSection===s.id;
                  return (
                    <div key={s.id} onClick={()=>scrollTo(s.id)} style={{ display:'flex', alignItems:'center', gap:0, padding:'8px 14px', cursor:'pointer', background:isOn?'var(--s2)':'transparent', borderLeft:isOn?'2px solid var(--amber)':'2px solid transparent', transition:'all .12s' }}
                      onMouseEnter={e=>{if(!isOn)e.currentTarget.style.background='var(--s2)'}}
                      onMouseLeave={e=>{if(!isOn)e.currentTarget.style.background='transparent'}}>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:isOn?'var(--t1)':'var(--t2)' }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ height:1, background:'var(--wire)', margin:'4px 0' }} />

              {/* 국가 필터 */}
              <div style={{ padding:'10px 0' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'.1em', padding:'0 14px', marginBottom:6 }}>국가 필터</div>
                <div onClick={()=>{setActiveCountry(null);scrollTo('policies');}} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 14px', cursor:'pointer', background:activeCountry===null?'var(--s2)':'transparent', borderLeft:activeCountry===null?'2px solid var(--amber)':'2px solid transparent', transition:'all .12s' }}
                  onMouseEnter={e=>{if(activeCountry!==null)e.currentTarget.style.background='var(--s2)'}}
                  onMouseLeave={e=>{if(activeCountry!==null)e.currentTarget.style.background='transparent'}}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:activeCountry===null?'var(--t1)':'var(--t2)' }}>전체</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--amber)' }}>{total}</span>
                </div>
                {countries.map(c=>{
                  const isOn = activeCountry===c.id;
                  return (
                    <div key={c.id} onClick={()=>{setActiveCountry(isOn?null:c.id);scrollTo('policies');}} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', cursor:'pointer', background:isOn?'var(--s2)':'transparent', borderLeft:isOn?`2px solid ${c.color}`:'2px solid transparent', transition:'all .12s' }}
                      onMouseEnter={e=>{if(!isOn)e.currentTarget.style.background='var(--s2)'}}
                      onMouseLeave={e=>{if(!isOn)e.currentTarget.style.background='transparent'}}>
                      <span style={{ fontSize:14, flexShrink:0 }}>{c.flag}</span>
                      <span style={{ fontFamily:'var(--font-serif)', fontSize:13, color:'var(--t1)', flex:1 }}>{c.name}</span>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:c.color }}>{c.policies.length}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ height:1, background:'var(--wire)', margin:'4px 0' }} />

              {/* 매크로 테마 */}
              <div style={{ padding:'10px 0 60px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'.1em', padding:'0 14px', marginBottom:6 }}>매크로 테마</div>
                {MACRO_THEMES.map(t=>(
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', cursor:'default' }}>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:t.color, flexShrink:0 }} />
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t2)' }}>{t.name}</span>
                  </div>
                ))}
              </div>
            </aside>
          )}

          {/* ── 메인 콘텐츠 ── */}
          <main style={{ flex:1, marginLeft:isMobile?0:SB_W, padding:isMobile?'0 16px':'0 48px', maxWidth: isMobile?'100%':`calc(100% - ${SB_W}px)`, minWidth:0 }}>

            {/* ①  HERO */}
            <section id="hero" style={{ padding:'56px 0 48px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--amber)', letterSpacing:'.12em', marginBottom:12 }}>자산제곱 — 글로벌 정책 분석 레이더</div>
              <h1 style={{ fontFamily:'var(--font-serif)', fontSize:isMobile?34:48, fontWeight:400, color:'var(--t1)', lineHeight:1.07, marginBottom:14 }}>
                정책이 만드는<br /><em style={{ color:'var(--amber)', fontStyle:'italic' }}>다음 수혜주</em>
              </h1>
              <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.85, maxWidth:480, marginBottom:28 }}>
                미국·중국·유럽·한국·일본 5개국의 핵심 정책을 분석합니다.<br />
                어떤 산업에 자금이 흐르고, 어떤 종목이 수혜를 받는지 — 큰 흐름부터 병목 수혜주까지.
              </p>
              <div style={{ display:'flex', gap:0, border:'1px solid var(--wire)', borderRadius:4, overflow:'hidden', width:'fit-content' }}>
                {[{n:total,l:'분석 정책'},{n:'5개국',l:'대상 국가'},{n:MACRO_THEMES.length,l:'매크로 테마'},{n:'매일',l:'AI 자동 업데이트'}].map(({n,l},i)=>(
                  <div key={l} style={{ padding:'12px 20px', textAlign:'center', borderRight:i<3?'1px solid var(--wire)':'none' }}>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:24, color:'var(--amber)', lineHeight:1 }}>{n}</div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--t3)', marginTop:3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ②  국가별 정책 */}
            <section id="policies" style={{ paddingTop:56 }}>
              <SecLabel text="국가별 정책 분석" />
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:400, color:'var(--t1)', marginBottom:24 }}>정책 상세 분석</h2>
              {(activeCountry ? countries.filter(c=>c.id===activeCountry) : countries).map(c=>(
                <div key={c.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'36px 0' }}>
                  <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 200px', gap:28, marginBottom:20, paddingBottom:18, borderBottom:`1px solid ${c.color}25` }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
                        <span style={{ fontSize:isMobile?26:30, lineHeight:1 }}>{c.flag}</span>
                        <div>
                          <h3 style={{ fontFamily:'var(--font-serif)', fontSize:isMobile?22:28, fontWeight:400, color:c.color, lineHeight:1 }}>{c.name}</h3>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--t3)', marginTop:4 }}>{c.tagline}</div>
                        </div>
                      </div>
                      <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.85, maxWidth:500 }}>{c.summary}</p>
                    </div>
                    {!isMobile && (
                      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                        {[{l:'분석 정책',v:c.policies.length},{l:'최근 업데이트',v:c.updated},{l:'핵심 테마',v:[...new Set(c.policies.flatMap(p=>p.themes||[]))].length+'개'}].map(({l,v})=>(
                          <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'var(--s1)', borderLeft:`2px solid ${c.color}40` }}>
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--t2)' }}>{l}</span>
                            <span style={{ fontFamily:'var(--font-serif)', fontSize:15, color:c.color }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {c.policies.map(p=><PolicyRow key={p.id} policy={p} color={c.color} />)}
                </div>
              ))}
            </section>

            {/* ③  연결고리 맵 */}
            <section id="flow" style={{ padding:'64px 0 48px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              <SecLabel text="정책 연결고리 맵" />
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:400, color:'var(--t1)', marginBottom:8 }}>정책은 어떻게 연결되는가</h2>
              <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.75, marginBottom:28 }}>개별 정책을 넘어 큰 흐름의 인과관계를 추적합니다.</p>
              <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
                {FLOWS.map(f=>(
                  <button key={f.id} onClick={()=>setFlowActive(f.id)} style={{ fontFamily:'var(--font-sans)', fontSize:12, background:flowActive===f.id?f.color+'22':'transparent', color:flowActive===f.id?'var(--t1)':'var(--t2)', border:`1px solid ${flowActive===f.id?f.color:'var(--wire2)'}`, borderRadius:4, padding:'7px 14px', cursor:'pointer', transition:'all .15s' }}>{f.title}</button>
                ))}
              </div>
              {flow && (
                <div style={{ animation:'fadeIn .2s ease' }}>
                  <div style={{ display:'flex', alignItems:'center', marginBottom:24, overflowX:'auto', paddingBottom:8, gap:0 }}>
                    {flow.steps.map((step,i)=>(
                      <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
                        <div style={{ width:148, padding:'12px 14px', background:'var(--s2)', border:`1px solid ${TC[step.t]}50`, borderTop:`2px solid ${TC[step.t]}`, borderRadius:4 }}>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:TC[step.t], letterSpacing:'.07em', marginBottom:5 }}>{TL[step.t]}</div>
                          <div style={{ fontSize:12, color:'var(--t1)', fontWeight:500, lineHeight:1.3, marginBottom:3 }}>{step.l}</div>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--t2)' }}>{step.s}</div>
                        </div>
                        {i<flow.steps.length-1 && (
                          <div style={{ display:'flex', alignItems:'center', padding:'0 4px', flexShrink:0 }}>
                            <div style={{ width:18, height:1, background:'var(--wire2)' }} />
                            <div style={{ width:0, height:0, borderTop:'4px solid transparent', borderBottom:'4px solid transparent', borderLeft:'6px solid var(--wire2)' }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div style={{ background:'var(--s1)', border:'1px solid var(--wire)', borderLeft:'2px solid #3d9e6a', borderRadius:4, padding:'14px 16px' }}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'#3d9e6a', letterSpacing:'.08em', marginBottom:10 }}>이 흐름의 수혜주</div>
                      {flow.bens.map((b,i)=><div key={i} style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--amber)', lineHeight:1.9 }}>→ {b}</div>)}
                    </div>
                    <div style={{ background:'var(--s1)', border:'1px solid var(--wire)', borderLeft:'2px solid #b84a4a', borderRadius:4, padding:'14px 16px' }}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'#b84a4a', letterSpacing:'.08em', marginBottom:10 }}>이 흐름의 리스크</div>
                      {flow.risks.map((r,i)=><div key={i} style={{ fontSize:12, color:'var(--t2)', lineHeight:1.9 }}>· {r}</div>)}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ④  수혜주 스크리너 */}
            <section id="screener" style={{ padding:'64px 0 48px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              <SecLabel text="수혜주 스크리너" />
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:400, color:'var(--t1)', marginBottom:8 }}>정책 수혜주 전체 조회</h2>
              <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.75, marginBottom:20 }}>{scData.length}개 종목 · 국가·수혜도별 필터링</p>
              <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
                <input value={scSearch} onChange={e=>setScSearch(e.target.value)} placeholder="종목명 / 섹터..." style={{ fontFamily:'var(--font-mono)', fontSize:11, background:'var(--s2)', border:'1px solid var(--wire2)', borderRadius:4, padding:'6px 12px', color:'var(--t1)', outline:'none', width:160 }} />
                <select value={scCountry} onChange={e=>setScCountry(e.target.value)} style={{ fontFamily:'var(--font-mono)', fontSize:11, background:'var(--s2)', border:'1px solid var(--wire2)', borderRadius:4, padding:'6px 10px', color:'var(--t1)', outline:'none' }}>
                  <option value="all">전체 국가</option>
                  {countries.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                </select>
                {[{v:'all',l:'전체'},{v:'pos',l:'수혜주'},{v:'neg',l:'리스크'}].map(f=>(
                  <button key={f.v} onClick={()=>setScImpact(f.v)} style={{ fontFamily:'var(--font-mono)', fontSize:11, background:scImpact===f.v?'var(--amber)':'transparent', color:scImpact===f.v?'var(--ink)':'var(--t2)', border:`1px solid ${scImpact===f.v?'var(--amber)':'var(--wire2)'}`, borderRadius:4, padding:'6px 12px', cursor:'pointer' }}>{f.l}</button>
                ))}
              </div>
              <div style={{ border:'1px solid var(--wire)', borderRadius:4, overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 80px 1.5fr 1fr', background:'var(--s2)', padding:'8px 16px', borderBottom:'1px solid var(--wire)' }}>
                  {['종목','섹터','수혜도','ETF','국가'].map(h=><div key={h} style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--t3)', letterSpacing:'.08em' }}>{h}</div>)}
                </div>
                {scData.slice(0,60).map((r,i)=>(
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 80px 1.5fr 1fr', padding:'10px 16px', borderBottom:i<scData.length-1?'1px solid var(--wire)':'none', background:i%2===0?'var(--s1)':'var(--ink)', transition:'background .1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--s2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'var(--s1)':'var(--ink)'}>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--t1)', fontWeight:500, alignSelf:'center' }}>{r.stock}</div>
                    <div style={{ fontSize:11, color:'var(--t2)', alignSelf:'center' }}>{r.sector}</div>
                    <div style={{ alignSelf:'center' }}><Dots value={r.impact} pos={r.pos} /></div>
                    <div style={{ alignSelf:'center' }}>{r.etfs.slice(0,3).map(e=><span key={e} style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--amber)', background:'rgba(184,146,74,.1)', border:'1px solid rgba(184,146,74,.2)', borderRadius:2, padding:'1px 5px', marginRight:3, display:'inline-block' }}>{e}</span>)}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:5, alignSelf:'center' }}>
                      <span style={{ fontSize:13 }}>{r.country.flag}</span>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:r.country.color }}>{r.country.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              {scData.length>60 && <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t3)', marginTop:10, textAlign:'center' }}>상위 60개 표시 · 전체 {scData.length}개</div>}
            </section>

            {/* ⑤  히트맵 */}
            <section id="heatmap" style={{ padding:'64px 0 48px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              <SecLabel text="정책 강도 히트맵" />
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:400, color:'var(--t1)', marginBottom:8 }}>국가 × 섹터 정책 집중도</h2>
              <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.75, marginBottom:24 }}>어느 국가가 어느 섹터에 정책 화력을 집중하는지. 셀 hover 시 관련 정책 확인.</p>
              <div style={{ overflowX:'auto' }}>
                <div style={{ display:'grid', gridTemplateColumns:`160px repeat(${countries.length},1fr)`, gap:1, minWidth:600 }}>
                  <div />
                  {countries.map(c=><div key={c.id} style={{ padding:'8px 4px', textAlign:'center' }}><div style={{ fontSize:18, marginBottom:2 }}>{c.flag}</div><div style={{ fontFamily:'var(--font-serif)', fontSize:12, color:c.color }}>{c.name}</div></div>)}
                  {SECTORS.map(s=>(
                    <>
                      <div key={s.id+'_l'} style={{ padding:'10px 12px', display:'flex', alignItems:'center', borderTop:'1px solid var(--wire)' }}>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t2)' }}>{s.l}</span>
                      </div>
                      {countries.map(c=>{
                        const cell=matrix[c.id][s.id];
                        const isH=hmHover?.c===c.id&&hmHover?.s===s.id;
                        return <div key={c.id+s.id} onMouseEnter={()=>setHmHover({c:c.id,s:s.id})} onMouseLeave={()=>setHmHover(null)} style={{ background:isH?'rgba(255,255,255,0.12)':cellBg(cell.score), border:isH?`1px solid ${c.color}`:'1px solid rgba(255,255,255,0.04)', cursor:cell.count>0?'pointer':'default', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 4px', transition:'all .12s', minHeight:46 }}>
                          {cell.count>0?<><div style={{ fontFamily:'var(--font-mono)', fontSize:14, fontWeight:500, color:cellTxt(cell.score), lineHeight:1 }}>{cell.score}</div><div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:cellTxt(cell.score), opacity:.7, marginTop:2 }}>{cell.count}개</div></>:<div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--t3)' }}>—</div>}
                        </div>;
                      })}
                    </>
                  ))}
                </div>
              </div>
              {hmHover && hmHovered && hmHovered.count>0 && (
                <div style={{ marginTop:16, padding:'14px 18px', background:'var(--s1)', border:'1px solid var(--wire2)', borderRadius:4, animation:'fadeIn .15s ease' }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--amber)', marginBottom:10 }}>
                    {countries.find(c=>c.id===hmHover.c)?.flag} {countries.find(c=>c.id===hmHover.c)?.name} · {SECTORS.find(s=>s.id===hmHover.s)?.l} · 강도 {hmHovered.score}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {hmHovered.policies.map(p=>(
                      <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:8, color:p.status==='active'?'#3d9e6a':'#b8924a', border:`1px solid ${p.status==='active'?'rgba(61,158,106,.3)':'rgba(184,146,74,.3)'}`, borderRadius:2, padding:'1px 5px' }}>{p.status==='active'?'ACTIVE':'UPCOMING'}</span>
                        <span style={{ fontFamily:'var(--font-serif)', fontSize:14, color:'var(--t1)' }}>{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ⑥  캘린더 */}
            <section id="calendar" style={{ padding:'64px 0 48px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              <SecLabel text="정책 이벤트 캘린더" />
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:400, color:'var(--t1)', marginBottom:8 }}>주시해야 할 정책 일정</h2>
              <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.75, marginBottom:24 }}>앞으로 예정된 정책 발효·시행·표결 일정을 시간순으로 정리했습니다.</p>
              <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
                {[2025,2026,2027].map(y=><button key={y} onClick={()=>setCalYear(y)} style={{ fontFamily:'var(--font-mono)', fontSize:11, background:calYear===y?'var(--amber)':'transparent', color:calYear===y?'var(--ink)':'var(--t2)', border:`1px solid ${calYear===y?'var(--amber)':'var(--wire2)'}`, borderRadius:4, padding:'6px 14px', cursor:'pointer' }}>{y}년</button>)}
                <select value={calCountry} onChange={e=>setCalCountry(e.target.value)} style={{ fontFamily:'var(--font-mono)', fontSize:11, background:'var(--s2)', border:'1px solid var(--wire2)', borderRadius:4, padding:'6px 10px', color:'var(--t1)', outline:'none', marginLeft:8 }}>
                  <option value="all">전체 국가</option>
                  {countries.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(mo=>{
                  const mes=calGrouped[mo]||[]; if(!mes.length)return null;
                  return (
                    <div key={mo} style={{ display:'grid', gridTemplateColumns:'72px 1fr', marginBottom:8 }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:17, color:'var(--amber)', paddingTop:12, paddingRight:14, textAlign:'right' }}>{MONTHS[mo-1]}</div>
                      <div style={{ borderLeft:'1px solid var(--wire2)', paddingLeft:20, paddingBottom:16, paddingTop:8, display:'flex', flexDirection:'column', gap:10 }}>
                        {mes.map((e,i)=>(
                          <div key={i} style={{ display:'flex', gap:10, position:'relative' }}>
                            <div style={{ position:'absolute', left:-24, top:5, width:9, height:9, borderRadius:'50%', background:e.country.color, border:'2px solid var(--ink)' }} />
                            <span style={{ fontSize:14, flexShrink:0 }}>{e.country.flag}</span>
                            <div>
                              <div style={{ display:'flex', gap:7, marginBottom:3, flexWrap:'wrap' }}>
                                <span style={{ fontFamily:'var(--font-mono)', fontSize:8, color:e.status==='active'?'#3d9e6a':'#b8924a', border:`1px solid ${e.status==='active'?'rgba(61,158,106,.3)':'rgba(184,146,74,.3)'}`, borderRadius:2, padding:'1px 5px' }}>{e.status==='active'?'ACTIVE':'UPCOMING'}</span>
                                <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:e.country.color }}>{e.date}</span>
                              </div>
                              <div style={{ fontSize:13, color:'var(--t1)', fontWeight:500, marginBottom:2 }}>{e.event}</div>
                              <div style={{ fontSize:11, color:'var(--t2)' }}>{e.policy}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {calNoMo.length>0 && (
                  <div style={{ display:'grid', gridTemplateColumns:'72px 1fr', marginTop:8 }}>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t3)', paddingTop:12, paddingRight:14, textAlign:'right' }}>연중</div>
                    <div style={{ borderLeft:'1px solid var(--wire)', paddingLeft:20, paddingTop:8, display:'flex', flexDirection:'column', gap:8 }}>
                      {calNoMo.map((e,i)=>(
                        <div key={i} style={{ display:'flex', gap:10, position:'relative' }}>
                          <div style={{ position:'absolute', left:-24, top:5, width:7, height:7, borderRadius:'50%', background:e.country.color, border:'2px solid var(--ink)' }} />
                          <span style={{ fontSize:13 }}>{e.country.flag}</span>
                          <div><div style={{ fontSize:13, color:'var(--t1)', marginBottom:2 }}>{e.event}</div><div style={{ fontSize:11, color:'var(--t2)' }}>{e.policy}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!calData.length && <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--t3)', padding:'40px 0', textAlign:'center' }}>{calYear}년 이벤트가 없습니다</div>}
              </div>
            </section>

            {/* ⑦  리스크 레이더 */}
            <section id="risk" style={{ padding:'64px 0 80px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              <SecLabel text="리스크 레이더" />
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:400, color:'var(--t1)', marginBottom:8 }}>지금 가장 모니터링할 리스크</h2>
              <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.75, marginBottom:24 }}>발생 가능성 × 충격 규모 기준 · 헤지 전략 포함</p>
              <div style={{ display:'flex', gap:6, marginBottom:24, flexWrap:'wrap' }}>
                {['all',...new Set(RISKS.map(r=>r.cat))].map(c=>(
                  <button key={c} onClick={()=>setRiskCat(c)} style={{ fontFamily:'var(--font-mono)', fontSize:10, background:riskCat===c?'var(--amber)':'transparent', color:riskCat===c?'var(--ink)':'var(--t2)', border:`1px solid ${riskCat===c?'var(--amber)':'var(--wire2)'}`, borderRadius:4, padding:'5px 12px', cursor:'pointer' }}>{c==='all'?'전체':c}</button>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {riskSorted.map(r=>(
                  <div key={r.id} style={{ background:'var(--s1)', border:'1px solid var(--wire)', borderLeft:`3px solid ${r.color}`, borderRadius:4, overflow:'hidden' }}>
                    <div style={{ padding:'14px 18px 12px', borderBottom:'1px solid var(--wire)' }}>
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14, marginBottom:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ display:'flex', gap:3 }}>{[1,2,3,4,5].map(i=><div key={i} style={{ width:8, height:8, borderRadius:'50%', background:i<=r.lvl?r.color:'rgba(255,255,255,0.07)' }} />)}</div>
                          <h3 style={{ fontFamily:'var(--font-serif)', fontSize:17, fontWeight:400, color:'var(--t1)', lineHeight:1.2 }}>{r.title}</h3>
                        </div>
                        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:8, color:PC[r.prob], background:`${PC[r.prob]}18`, border:`1px solid ${PC[r.prob]}40`, borderRadius:2, padding:'2px 7px' }}>확률 {r.prob}</span>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'var(--t2)', background:'rgba(255,255,255,.04)', border:'1px solid var(--wire2)', borderRadius:2, padding:'2px 7px' }}>충격 {r.impact}</span>
                        </div>
                      </div>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:r.color, marginBottom:8 }}>⏱ {r.time} · {r.cat}</div>
                      <p style={{ fontSize:12, color:'var(--t2)', lineHeight:1.8 }}>{r.desc}</p>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:'1px solid var(--wire)' }}>
                      <div style={{ padding:'10px 16px', borderRight:'1px solid var(--wire)' }}>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'#b84a4a', letterSpacing:'.07em', marginBottom:7 }}>영향 자산</div>
                        {r.affected.map((a,i)=><div key={i} style={{ fontSize:11, color:'var(--t2)', lineHeight:1.7 }}>· {a}</div>)}
                      </div>
                      <div style={{ padding:'10px 16px' }}>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'#3d9e6a', letterSpacing:'.07em', marginBottom:7 }}>헤지 전략</div>
                        {r.hedge.map((h,i)=><div key={i} style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--amber)', lineHeight:1.8 }}>→ {h}</div>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 푸터 */}
            <div style={{ borderTop:'1px solid var(--wire)', padding:'20px 0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'rgba(255,255,255,0.3)' }}>© 자산제곱 — POLICY RADAR · 투자 교육은 선택이 아닌 필수</span>
              <div style={{ display:'flex', gap:16 }}>
                {NAV_LINKS.map(({label,href})=>(
                  <a key={label} href={href} target="_blank" rel="noopener" style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'rgba(255,255,255,0.3)', textDecoration:'none', transition:'color .12s' }}
                    onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.55)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.3)'}>{label}</a>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:var(--s1)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>
    </>
  );
}

