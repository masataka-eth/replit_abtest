import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users } from "lucide-react";
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
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                ペルソナ {result.respondent_id}
                <span className="ml-auto text-sm font-normal">
                  推奨: コピー{result.preferred_option}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-blue-600">心理的反応メカニズム</h4>
                <p className="text-sm text-gray-600">{result.analysis_reasons.psychological_mechanism}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-blue-600">購買行動への影響</h4>
                <p className="text-sm text-gray-600">{result.analysis_reasons.purchase_behavior_impact}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-blue-600">競合との差別化</h4>
                <p className="text-sm text-gray-600">{result.analysis_reasons.competitive_advantage}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-blue-600">改善提案</h4>
                <p className="text-sm text-gray-600">{result.analysis_reasons.improvement_suggestions}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => downloadCSV(results)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          CSVダウンロード
        </Button>
      </div>
    </div>
  );
}
