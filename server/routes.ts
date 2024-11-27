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
      try {
        console.log("APIレスポンスの構造:", {
          hasData: 'data' in data,
          hasOutputs: data.data && 'outputs' in data.data,
          outputKeys: data.data?.outputs ? Object.keys(data.data.outputs) : []
        });

        const results = [];
        for (let i = 1; i <= 4; i++) {
          const resultKey = `result_${i}`;
          try {
            if (data.data?.outputs?.[resultKey]) {
              const resultString = data.data.outputs[resultKey].toString();
              console.log(`ペルソナ${i}の生データ:`, resultString);
              
              // 文字列の整形（不正な文字の除去）
              const cleanedString = resultString
                .replace(/\n/g, ' ')
                .replace(/\"/g, '"')
                .replace(/\\/g, '\\\\');
              
              const resultData = JSON.parse(cleanedString);
              console.log(`ペルソナ${i}の解析結果:`, resultData);
              results.push(resultData);
            }
          } catch (error) {
            console.error(`ペルソナ${i}の解析エラー:`, error);
            console.error('問題のある文字列:', data.data?.outputs?.[resultKey]);
          }
        }

        // 結果の検証
        if (results.length === 0) {
          throw new Error('No valid results could be parsed from the API response');
        }

        console.log("=== 最終レスポンス ===");
        console.log("10. クライアントへの返信データ:", JSON.stringify({ results }, null, 2));

        res.json({ results });
      } catch (error) {
        console.error("レスポンス解析エラー:", error);
        throw new Error(`Failed to parse API response: ${error.message}`);
      }
    } catch (error: unknown) {
      console.error("=== エラー詳細 ===");
      const err = error as Error;
      console.error("エラーメッセージ:", err.message);
      console.error("スタックトレース:", err.stack);
      console.error("エラーの種類:", err.constructor.name);
      if ('cause' in err) {
        console.error("エラーの原因:", err.cause);
      }
      res.status(500).json({ 
        error: "Analysis failed",
        details: err.message
      });
    }
  });
}
