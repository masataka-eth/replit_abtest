import type { Express } from "express";

interface PersonaInput {
  number: number;
  gender: string;
  age: string;
  values: string;
  lifestage: string;
  income: string;
  consumerBehavior: string;
  techAttitude: string;
}

interface PersonaRequest {
  number: number;
  attributes: {
    gender: string;
    age: string;
    values: string;
    lifestage: string;
    income: string;
    consumerBehavior: string;
    techAttitude: string;
  };
}

export function registerRoutes(app: Express) {
  app.post("/api/analyze", async (req, res) => {
    try {
      console.log("リクエストボディ:", req.body);
      const { copyA, copyB, personas } = req.body;

      const personaInputs: PersonaInput[] = personas.map((p: PersonaRequest) => ({
        number: p.number,
        gender: p.attributes.gender,
        age: p.attributes.age,
        values: p.attributes.values,
        lifestage: p.attributes.lifestage,
        income: p.attributes.income,
        consumerBehavior: p.attributes.consumerBehavior,
        techAttitude: p.attributes.techAttitude,
      }));

      console.log("Difyへのリクエストデータ:", {
        copyA,
        copyB,
        personaInputs
      });

      const response = await fetch("https://api.dify.ai/v1/chat-messages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `以下の2つのコピーについて、4つのペルソナそれぞれの視点で分析してください：

コピーA: ${copyA}
コピーB: ${copyB}

ペルソナ情報：
${personaInputs.map((p, i) => `
ペルソナ${p.number}:
- 性別: ${p.gender}
- 年齢: ${p.age}
- 価値観: ${p.values}
- ライフステージ: ${p.lifestage}
- 収入: ${p.income}
- 消費行動: ${p.consumerBehavior}
- 技術態度: ${p.techAttitude}
`).join('\n')}

それぞれのペルソナについて：
1. どちらのコピーが効果的か（AまたはB）
2. 心理的反応メカニズム
3. 購買行動への影響
4. 競合との差別化
5. 改善提案

を分析してください。`,
          user: "user-123",
          response_mode: "blocking"
        }),
      });

      if (!response.ok) {
        console.log("Dify APIエラー:", {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error("Failed to analyze");
      }

      const data = await response.json();
      console.log("Dify APIレスポンス:", data);

      // レスポンスを解析して結果を生成
      const responseText = data.answer;
      const results = personaInputs.map((persona, index) => {
        const personaSection = responseText.split(`ペルソナ${index + 1}`)[1]?.split(`ペルソナ${index + 2}`)[0] || '';
        
        return {
          respondent_id: index + 1,
          preferred_option: personaSection.toLowerCase().includes('コピーa') ? 'A' : 'B',
          analysis_reasons: {
            psychological_mechanism: personaSection.split('心理的反応メカニズム')[1]?.split('購買行動')[0]?.trim() || '',
            purchase_behavior_impact: personaSection.split('購買行動への影響')[1]?.split('競合')[0]?.trim() || '',
            competitive_advantage: personaSection.split('競合との差別化')[1]?.split('改善提案')[0]?.trim() || '',
            improvement_suggestions: personaSection.split('改善提案')[1]?.trim() || ''
          }
        };
      });

      res.json({ results });
    } catch (error) {
      console.error("詳細なエラー情報:", {
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({ error: "Analysis failed" });
    }
  });
}
