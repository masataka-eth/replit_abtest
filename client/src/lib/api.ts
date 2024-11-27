import { PersonaConfig } from "./types";

export async function analyzeABTest(copyA: string, copyB: string, personas: PersonaConfig[]) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      copyA,
      copyB,
      personas,
    }),
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return response.json();
}

export function downloadCSV(data: any[]) {
  // CSVデータの作成
  const rows = data.map(result => [
    `ペルソナ${result.respondent_id}`,
    `コピー${result.preferred_option}`,
    // ペルソナ属性
    result.persona?.gender || '',
    result.persona?.age || '',
    result.persona?.values || '',
    result.persona?.lifestage || '',
    result.persona?.income || '',
    result.persona?.consumerBehavior || '',
    result.persona?.techAttitude || '',
    // 分析結果
    result.analysis_reasons.psychological_mechanism.replace(/,/g, '、'),
    result.analysis_reasons.purchase_behavior_impact.replace(/,/g, '、'),
    result.analysis_reasons.competitive_advantage.replace(/,/g, '、'),
    result.analysis_reasons.improvement_suggestions.replace(/,/g, '、')
  ]);

  const headers = [
    'ペルソナ',
    '推奨コピー',
    // ペルソナ属性のヘッダー
    '性別',
    '年齢層',
    '価値観',
    'ライフステージ',
    '世帯年収',
    '消費行動特性',
    'テクノロジーへの態度',
    // 分析結果のヘッダー
    '心理的反応メカニズム',
    '購買行動への影響',
    '競合との差別化',
    '改善提案'
  ];
  
  // BOMを追加してUTF-8エンコーディングを使用
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ab_test_results.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
