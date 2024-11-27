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
  const headers = ["Persona", "Preferred Option", "Psychological Mechanism", "Purchase Behavior Impact", "Competitive Advantage", "Improvement Suggestions"];
  const rows = data.map(result => [
    `Persona ${result.respondent_id}`,
    result.preferred_option,
    result.analysis_reasons.psychological_mechanism,
    result.analysis_reasons.purchase_behavior_impact,
    result.analysis_reasons.competitive_advantage,
    result.analysis_reasons.improvement_suggestions,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "ab_test_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
