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

      const response = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            model_A: copyA,
            model_B: copyB,
            persona_no: personaInputs.map(p => p.number.toString()).join(","),
            persona_gender: personaInputs.map(p => p.gender).join(","),
            persona_age: personaInputs.map(p => p.age).join(","),
            persona_values: personaInputs.map(p => p.values).join(","),
            persona_lifestage: personaInputs.map(p => p.lifestage).join(","),
            persona_income: personaInputs.map(p => p.income).join(","),
            persona_consump: personaInputs.map(p => p.consumerBehavior).join(","),
            persona_tech: personaInputs.map(p => p.techAttitude).join(",")
          },
          response_mode: "blocking",
          conversation_id: "abc-123"
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

      // レスポンスの形式を調整
      const results = Array.from({ length: personaInputs.length }, (_, i) => ({
        respondent_id: i + 1,
        preferred_option: data.answer.includes(`コピーA`) ? "A" : "B",
        analysis_reasons: {
          psychological_mechanism: data.answer,
          purchase_behavior_impact: data.answer,
          competitive_advantage: data.answer,
          improvement_suggestions: data.answer
        }
      }));

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
