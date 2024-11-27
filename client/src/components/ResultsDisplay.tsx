import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Brain, ShoppingCart, Target, Lightbulb, CheckCircle2 } from "lucide-react";
import { AnalysisResult } from "@/lib/types";

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((result) => (
        <Card key={result.respondent_id} className="bg-white shadow-lg">
          <CardHeader className={`p-6 ${
            result.preferred_option === 'A' ? 'bg-blue-50' : 'bg-purple-50'
          }`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">
                ペルソナ {result.respondent_id}
              </CardTitle>
              <div className={`flex items-center gap-2 ${
                result.preferred_option === 'A' ? 'text-blue-600' : 'text-purple-600'
              }`}>
                <CheckCircle2 className="h-8 w-8" />
                <span className="text-lg font-bold">
                  コピー{result.preferred_option}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {[
              { icon: Brain, title: '心理的反応メカニズム', content: result.analysis_reasons.psychological_mechanism },
              { icon: ShoppingCart, title: '購買行動への影響', content: result.analysis_reasons.purchase_behavior_impact },
              { icon: Target, title: '競合との差別化', content: result.analysis_reasons.competitive_advantage },
              { icon: Lightbulb, title: '改善提案', content: result.analysis_reasons.improvement_suggestions }
            ].map(({ icon: Icon, title, content }, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${
                    result.preferred_option === 'A' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                  <h4 className="font-semibold">{title}</h4>
                </div>
                <p className="text-gray-600 pl-7">{content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
