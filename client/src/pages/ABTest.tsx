import React, { useState } from "react";
import { TestTubes, Sparkles, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { PersonaCard } from "@/components/PersonaCard";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { analyzeABTest } from "@/lib/api";
import type { PersonaAttribute, AnalysisResult } from "@/lib/types";
import { defaultCopyA, defaultCopyB, defaultPersonas } from "@/lib/defaultTestData";

export function ABTest() {
  const [copyA, setCopyA] = useState('');
  const [copyB, setCopyB] = useState('');
  const [personas, setPersonas] = useState(defaultPersonas);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<'result' | 'edit'>(results.length > 0 ? 'result' : 'edit');
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: () => {
      return analyzeABTest(copyA, copyB, personas.map((p, i) => ({ number: i + 1, attributes: p })));
    },
    onSuccess: (data) => {
      setResults(data.results);
      setActiveTab('result');
    },
    onError: (error) => {
      console.error("分析エラー詳細:", error);
      toast({
        title: "エラー",
        description: "分析に失敗しました。入力内容を確認して再度お試しください。",
        variant: "destructive",
      });
    },
  });

  const CopyInputs = () => (
    <div className="flex gap-4">
      <Card className="flex-1 bg-white shadow-lg">
        <CardHeader className="p-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            コピーA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={copyA}
            onChange={(e) => setCopyA(e.target.value)}
            className="w-full h-32 p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1つ目のキャッチコピーや説明文を入力してください"
          />
        </CardContent>
      </Card>
      <Card className="flex-1 bg-white shadow-lg">
        <CardHeader className="p-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            コピーB
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={copyB}
            onChange={(e) => setCopyB(e.target.value)}
            className="w-full h-32 p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2つ目のキャッチコピーや説明文を入力してください"
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg shadow-lg">
          <TestTubes className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white ml-2">ABテストの沼</h1>
        </div>
      </div>

      <div className="space-y-6">
        <CopyInputs readOnly={activeTab === 'result'} />

        {results.length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('result')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'result' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                分析結果
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'edit' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                属性編集
              </button>
            </div>
          </div>
        )}

        {(results.length === 0 || activeTab === 'edit') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {personas.map((persona, index) => (
              <PersonaCard
                key={index}
                number={index + 1}
                value={persona}
                onChange={(newValue) => {
                  const newPersonas = [...personas];
                  newPersonas[index] = newValue;
                  setPersonas(newPersonas);
                }}
              />
            ))}
          </div>
        )}

        {results.length > 0 && activeTab === 'result' && (
          <ResultsDisplay results={results} />
        )}

        <div className="flex justify-between items-center">
          <div className="flex-1" />
          <div className="flex-1 flex justify-center">
            <Button
              onClick={() => analyzeMutation.mutate()}
              disabled={analyzeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-lg shadow-lg flex items-center gap-2"
            >
              <TestTubes className="h-5 w-5" />
              {analyzeMutation.isPending ? "分析中..." : "分析する"}
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            {results.length > 0 && (
              <Button
                onClick={() => downloadCSV(results)}
                className="bg-white hover:bg-gray-50 text-blue-600 px-8 h-12 rounded-lg shadow-lg flex items-center gap-2 border border-blue-600"
              >
                <Download className="h-5 w-5" />
                CSV出力
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
