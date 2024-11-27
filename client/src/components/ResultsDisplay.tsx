import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import { downloadCSV } from "@/lib/api";

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((result) => (
          <Card key={result.respondent_id} className="bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  想定ユーザー {result.respondent_id}
                </h3>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    result.preferred_option === 'A' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Sparkles className="h-6 w-6" />
                    <span className="text-sm font-bold">A</span>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    result.preferred_option === 'B' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Sparkles className="h-6 w-6" />
                    <span className="text-sm font-bold">B</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <h4>心理的反応メカニズム</h4>
                </div>
                <p className="text-sm text-gray-600 pl-2">{result.analysis_reasons.psychological_mechanism}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <h4>購買行動への影響</h4>
                </div>
                <p className="text-sm text-gray-600 pl-2">{result.analysis_reasons.purchase_behavior_impact}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <h4>競合との差別化</h4>
                </div>
                <p className="text-sm text-gray-600 pl-2">{result.analysis_reasons.competitive_advantage}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <h4>改善提案</h4>
                </div>
                <p className="text-sm text-gray-600 pl-2">{result.analysis_reasons.improvement_suggestions}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
}
