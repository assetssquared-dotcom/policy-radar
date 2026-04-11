# 자산제곱 Policy Radar

> 글로벌 주요국 정책 분석 & 수혜 산업 매핑 — **매일 Claude AI가 자동 업데이트**

---

## 배포 순서 (처음부터 끝까지)

### STEP 1 — GitHub 레포 생성

```bash
# 압축 해제
tar -xzf policy-radar-final.tar.gz
cd policy-radar

# Git 초기화
git init
git add .
git commit -m "feat: policy radar v1 - initial release"
git branch -M main

# GitHub에서 새 레포 생성 후 (https://github.com/new)
git remote add origin https://github.com/YOUR_USERNAME/policy-radar.git
git push -u origin main
```

---

### STEP 2 — Vercel 프로젝트 생성

1. [vercel.com/new](https://vercel.com/new) 접속
2. **Import Git Repository** → GitHub 레포 선택
3. **Framework Preset**: Next.js (자동 감지됨)
4. **Deploy** 클릭 → 약 1분 후 배포 완료

---

### STEP 3 — Upstash Redis 연결 (자동 업데이트용)

1. Vercel 대시보드 → **Storage** 탭 → **Create Database**
2. **Upstash Redis** 선택
   - 이름: `policy-radar-db`
   - 리전: **ap-northeast-1** (도쿄 — 한국에서 가장 빠름)
3. 생성 완료 → **.env.local** 탭에서 두 값 복사:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

### STEP 4 — 환경변수 4개 설정

Vercel 대시보드 → **Settings** → **Environment Variables**:

| 변수명 | 값 | 발급 위치 |
|--------|-----|-----------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | [console.anthropic.com](https://console.anthropic.com) |
| `UPSTASH_REDIS_REST_URL` | `https://...` | Upstash 대시보드 |
| `UPSTASH_REDIS_REST_TOKEN` | `AX...` | Upstash 대시보드 |
| `CRON_SECRET` | 임의의 긴 문자열 | `openssl rand -base64 32` 로 생성 |

> 환경변수 추가 후 반드시 **Redeploy** 실행

---

### STEP 5 — 첫 번째 데이터 로드

환경변수 설정 직후 Redis가 비어있으므로 수동으로 한 번 실행:

```bash
# Vercel Functions 탭 > Cron Jobs > 수동 실행
# 또는 브라우저에서:
https://YOUR-SITE.vercel.app/api/cron/update-policies
# (Authorization: Bearer YOUR_CRON_SECRET 헤더 필요)
```

---

### STEP 6 — 완료

이후부터 **매일 오전 7시 (KST)** Claude AI가 자동으로 정책 뉴스를 스캔하고 업데이트합니다.

---

## Cron 스케줄

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/update-policies",
    "schedule": "0 22 * * *"
  }]
}
```

UTC 22:00 = **한국시간 07:00**

---

## 로컬 개발

```bash
# 의존성 설치
npm install

# .env.local 파일 생성 (.env.example 참고)
cp .env.example .env.local
# .env.local에 실제 값 입력

# 개발 서버 실행
npm run dev
# → http://localhost:3000
```

---

## 파일 구조

```
policy-radar/
├── components/
│   ├── Nav.js          # 상단 네비게이션 + 티커 스트립
│   ├── Sidebar.js      # 좌측 사이드바 (국가 + 테마 목록)
│   ├── PolicyCard.js   # 정책 상세 카드 컴포넌트
│   └── Footer.js       # 하단 푸터
├── data/
│   └── policies.js     # 정적 정책 데이터 (fallback)
├── lib/
│   ├── redis.js        # Upstash Redis 클라이언트
│   └── policySchema.js # Claude API 응답 스키마
├── pages/
│   ├── index.js                    # 메인 (국가 허브)
│   ├── country/[id].js             # 국가별 정책 상세
│   ├── theme/[id].js               # 매크로 테마 분석
│   └── api/
│       ├── policies.js             # 데이터 API (Redis + fallback)
│       ├── changelog.js            # 업데이트 내역 API
│       ├── trigger-update.js       # 수동 업데이트 트리거
│       └── cron/
│           └── update-policies.js  # 자동 업데이트 (Cron)
├── styles/
│   └── globals.css     # 전역 스타일 (다크 테마)
├── public/
│   └── favicon.svg
├── vercel.json         # Cron 설정
├── .env.example        # 환경변수 예시
└── package.json
```

---

## 정책 데이터 수동 추가

`data/policies.js`의 해당 국가 `policies` 배열에 추가:

```js
{
  id: 'new_policy_id',          // 고유 ID (snake_case)
  name: '정책명',
  budget: '예산 규모',
  date: '2025-04~',
  themes: ['ai_policy'],        // THEMES 객체의 키 사용
  status: 'active',             // active | upcoming | paused
  background: '배경 설명...',
  beneficiaries: [
    {
      sector: '수혜 섹터',
      impact: 5,                // -5(리스크) ~ 5(강한수혜)
      pos: true,
      stocks: ['종목명(티커)'],
      etfs: ['ETF티커'],
    }
  ],
  risks: '리스크 설명',
  budgetData: [{ name: '항목', value: 100, max: 500 }],
  timeline: [{ date: '2025.04', event: '이벤트' }],
}
```

git push 하면 Vercel이 자동 배포합니다.

---

## 자산제곱 생태계

| 사이트 | URL | 역할 |
|--------|-----|------|
| **Policy Radar** | (이 사이트) | 정책 분석 & 수혜 산업 |
| Dashboard | assetx2-dashboard.vercel.app | 글로벌 자산 모니터링 |
| GeoMap | assetx2-geomap.vercel.app | 지정학 분석 지도 |

---

채널 링크: [YouTube](https://youtube.com/channel/UCpTC-SMFjA3EDRhZIKOcKuQ) · [Threads @asset.x2](https://threads.com/@asset.x2) · [Telegram](https://t.me/+2Qw1cAZTm8FjMGNl) · [네이버 프리미엄](https://contents.premium.naver.com/assetx2/assetsx2)
