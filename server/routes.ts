import type { Express } from "express";

export function registerRoutes(app: Express) {
  app.post("/api/analyze", async (req, res) => {
    try {
      const { copyA, copyB, personas } = req.body;

      const personaInputs = personas.map((p: any) => ({
        number: p.number,
        gender: p.attributes.gender,
        age: p.attributes.age,
        values: p.attributes.values,
        lifestage: p.attributes.lifestage,
        income: p.attributes.income,
        consumerBehavior: p.attributes.consumerBehavior,
        techAttitude: p.attributes.techAttitude,
      }));

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
            persona_no: personaInputs.map(p => p.number).join(","),
            persona_gender: personaInputs.map(p => p.gender).join(","),
            persona_age: personaInputs.map(p => p.age).join(","),
            persona_values: personaInputs.map(p => p.values).join(","),
            persona_lifestage: personaInputs.map(p => p.lifestage).join(","),
            persona_income: personaInputs.map(p => p.income).join(","),
            persona_consump: personaInputs.map(p => p.consumerBehavior).join(","),
            persona_tech: personaInputs.map(p => p.techAttitude).join(","),
          },
          response_mode: "blocking",
          user: "abc-123"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze");
      }

      const data = await response.json();
      res.json({ results: data });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Analysis failed" });
    }
  });
}
