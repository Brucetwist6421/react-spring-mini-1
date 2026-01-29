/* eslint-disable @typescript-eslint/no-explicit-any */
export const TYPE_COLORS: { [key: string]: string } = {
  // 기존 데이터
  fire: '#ef4444', 
  water: '#3b82f6', 
  grass: '#22c55e', 
  electric: '#f59e0b',
  psychic: '#ec4899', 
  ice: '#6ee7b7', 
  dragon: '#8b5cf6', 
  dark: '#334155',
  normal: '#94a3b8', 
  fighting: '#b91c1c', 
  flying: '#818cf8', 
  poison: '#a855f7',
  bug: '#84cc16',      // 밝은 연두색 (Lime 500)
  steel: '#64748b',    // 차가운 금속색 (Slate 500)
  ground: '#d97706',   // 짙은 흙색 (Amber 600)
  rock: '#78350f',     // 바위색 (Brown/Stone 계열)
  ghost: '#6366f1',    // 영적인 보라/청색 (Indigo 500)
  fairy: '#f472b6',    // 화사한 핑크 (Pink 400)
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPrimaryColor = (types: any[]) => {
  if (!types || types.length === 0) return '#94a3b8';
  return TYPE_COLORS[types[0].type.name] || '#94a3b8';
};

export const ALL_TYPE_STATS = [
  { name: '물', value: 158, fill: '#3b82f6' },
  { name: '노말', value: 125, fill: '#94a3b8' },
  { name: '풀', value: 115, fill: '#22c55e' },
  { name: '벌레', value: 95, fill: '#a8a878' },
  { name: '불꽃', value: 85, fill: '#ef4444' },
  { name: '에스퍼', value: 105, fill: '#f85888' },
  { name: '전기', value: 75, fill: '#f59e0b' },
  { name: '바위', value: 70, fill: '#b8a038' },
  { name: '땅', value: 72, fill: '#e0c068' },
  { name: '독', value: 78, fill: '#a040a0' },
  { name: '비행', value: 102, fill: '#a890f0' },
  { name: '격투', value: 65, fill: '#c03028' },
  { name: '얼음', value: 55, fill: '#98d8d8' },
  { name: '드래곤', value: 71, fill: '#7038f8' },
  { name: '고스트', value: 61, fill: '#705898' },
  { name: '강철', value: 66, fill: '#b8b8d0' },
  { name: '악', value: 68, fill: '#705848' },
  { name: '페어리', value: 63, fill: '#ee99ac' },
].sort((a, b) => b.value - a.value); // 높은 순서대로 정렬

export const SUMMARY_METRICS = [
  { label: 'Total Species', key: 'count', color: '#1e293b' },
  { label: 'Total Types', value: '18', color: '#3b82f6' },
  { label: 'Avg. Base Stat', value: '432', color: '#10b981' },
  { label: 'Generations', value: 'IX', color: '#f59e0b' },
];

