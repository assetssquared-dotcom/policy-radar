// 새 정책 하나의 스키마 (Claude API가 반환해야 하는 구조)
export const NEW_POLICY_SCHEMA = `
{
  "countryId": "us | kr | cn | eu | jp",
  "policy": {
    "id": "snake_case_unique_id",
    "name": "정책명 (한글)",
    "budget": "예산 규모 (문자열)",
    "date": "2025-MM~",
    "themes": ["theme_id_1", "theme_id_2"],
    "status": "active | upcoming | paused",
    "background": "정책 배경 설명 (2~4문단, 한글)",
    "beneficiaries": [
      {
        "sector": "수혜 섹터명",
        "impact": 5,
        "pos": true,
        "stocks": ["종목명(티커)"],
        "etfs": ["ETF티커"]
      }
    ],
    "risks": "리스크 설명 (한 문단)",
    "budgetData": [
      { "name": "항목명", "value": 100 }
    ],
    "timeline": [
      { "date": "2025.MM", "event": "이벤트 설명" }
    ]
  }
}
`;

export const VALID_THEMES = [
  'dollar_hegemony', 'petrodollar', 'stablecoin', 'reshoring',
  'energy_transition', 'semiconductor', 'yuan_intl', 'defense',
  'ai_policy', 'critical_minerals', 'nuclear', 'debt_fiscal',
  'supply_chain', 'real_estate', 'biotech',
];

export const VALID_COUNTRIES = ['us', 'kr', 'cn', 'eu', 'jp'];
