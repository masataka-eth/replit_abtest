export type PersonaAttribute = {
  gender: string;
  age: string;
  values: string;
  lifestage: string;
  income: string;
  consumerBehavior: string;
  techAttitude: string;
};

export type PersonaConfig = {
  number: number;
  attributes: PersonaAttribute;
};

export type AnalysisResult = {
  respondent_id: number;
  preferred_option: "A" | "B";
  analysis_reasons: {
    psychological_mechanism: string;
    purchase_behavior_impact: string;
    competitive_advantage: string;
    improvement_suggestions: string;
  };
};

export type AnalysisResponse = {
  results: AnalysisResult[];
};
