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
      console.log("=== リクエスト受信 ===");
      console.log("1. 元のリクエストボディ:", JSON.stringify(req.body, null, 2));
      
      const { copyA, copyB, personas } = req.body;
      
      console.log("2. 抽出したデータ:");
      console.log("- copyA:", copyA);
      console.log("- copyB:", copyB);
      console.log("- personas:", JSON.stringify(personas, null, 2));

      const personaInputs: PersonaInput[] = personas.map((p: PersonaRequest) => {
        console.log(`3. ペルソナ${p.number}の変換:`, JSON.stringify(p.attributes, null, 2));
        return {
          number: p.number,
          gender: p.attributes.gender,
          age: p.attributes.age,
          values: p.attributes.values,
          lifestage: p.attributes.lifestage,
          income: p.attributes.income,
          consumerBehavior: p.attributes.consumerBehavior,
          techAttitude: p.attributes.techAttitude,
        };
      });

      console.log("=== Dify APIリクエスト準備 ===");
      const requestBody = {
        inputs: {
          model_A: copyA,
          model_B: copyB,
          persona_no: personaInputs.map(p => p.number).join(','),
          persona_gender: personaInputs.map(p => p.gender).join(','),
          persona_age: personaInputs.map(p => p.age).join(','),
          persona_values: personaInputs.map(p => p.values).join(','),
          persona_lifestage: personaInputs.map(p => p.lifestage).join(','),
          persona_income: personaInputs.map(p => p.income).join(','),
          persona_consumption: personaInputs.map(p => p.consumerBehavior).join(','),
          persona_tech: personaInputs.map(p => p.techAttitude).join(',')
        },
        response_mode: "blocking",
        user: "abc-123"
      };

      console.log("4. Difyリクエストボディ:", JSON.stringify(requestBody, null, 2));

      const response = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("=== Dify APIレスポンス ===");
      console.log("5. レスポンスステータス:", response.status, response.statusText);

      if (!response.ok) {
        const errorBody = await response.text();
        console.log("6. エラーレスポンス本文:", errorBody);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("7. 成功レスポンス:", JSON.stringify(data, null, 2));

      console.log("=== レスポンス解析 ===");
      const responseText = data.answer;
      console.log("8. 解析前のテキスト:", responseText);

      const results = personaInputs.map((persona, index) => {
        console.log(`9. ペルソナ${index + 1}の解析開始`);
        const personaSection = responseText.split(`ペルソナ${index + 1}`)[1]?.split(`ペルソナ${index + 2}`)[0] || '';
        console.log(`- セクション抽出結果:`, personaSection);
        
        const result = {
          respondent_id: index + 1,
          preferred_option: personaSection.toLowerCase().includes('コピーa') ? 'A' : 'B',
          analysis_reasons: {
            psychological_mechanism: personaSection.split('心理的反応メカニズム')[1]?.split('購買行動')[0]?.trim() || '',
            purchase_behavior_impact: personaSection.split('購買行動への影響')[1]?.split('競合')[0]?.trim() || '',
            competitive_advantage: personaSection.split('競合との差別化')[1]?.split('改善提案')[0]?.trim() || '',
            improvement_suggestions: personaSection.split('改善提案')[1]?.trim() || ''
          }
        };
        console.log(`- 解析結果:`, JSON.stringify(result, null, 2));
        return result;
      });

      console.log("=== 最終レスポンス ===");
      console.log("10. クライアントへの返信データ:", JSON.stringify({ results }, null, 2));

      res.json({ results });
    } catch (error) {
      console.error("=== エラー詳細 ===");
      console.error("エラーメッセージ:", error.message);
      console.error("スタックトレース:", error.stack);
      console.error("エラーの種類:", error.constructor.name);
      if (error.cause) {
        console.error("エラーの原因:", error.cause);
      }
      res.status(500).json({ 
        error: "Analysis failed",
        details: error.message
      });
    }
  });
}
