import React, { useState, memo } from "react";
import { TestTubes, Sparkles, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { PersonaCard } from "@/components/PersonaCard";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { analyzeABTest, downloadCSV } from "@/lib/api";
import type { PersonaAttribute, AnalysisResult } from "@/lib/types";

const CopyInputs = memo(({ copyA, copyB, setCopyA, setCopyB }: {
  copyA: string;
  copyB: string;
  setCopyA: (value: string) => void;
  setCopyB: (value: string) => void;
}) => (
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
          className="w-full h-32 p-3 border rounded-md resize-none"
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
          className="w-full h-32 p-3 border rounded-md resize-none"
          placeholder="2つ目のキャッチコピーや説明文を入力してください"
        />
      </CardContent>
    </Card>
  </div>
));

const getRandomAttribute = (options: string[]): string => {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};

const getRandomPersona = (): PersonaAttribute => {
  const attributes = {
    gender: ["男性", "女性"], // 「その他」を除外
    age: ["10代", "20-24歳", "25-29歳", "30-34歳", "35-39歳", "40-44歳", "45-49歳", "50-54歳", "55-59歳", "60-64歳", "65歳以上"],
    values: ["品質重視", "価格重視", "トレンド重視", "環境配慮重視", "社会貢献重視"],
    lifestage: ["学生", "独身・若手社会人", "独身・キャリア充実期", "子育て初期家族", "子育て充実期家族", "子育て終了期家族", "夫婦二人暮らし"],
    income: ["～300万円", "300～500万円", "500～700万円", "700～1000万円", "1000万円～"],
    consumerBehavior: ["徹底的に調査して慎重に選ぶ", "必要に応じて素早く決定する", "感覚的・感情的に選ぶ", "他者の推奨を重視する", "ブランドを重視する"],
    techAttitude: ["最新技術に敏感で積極的に活用", "新しい技術は比較的早めに採用", "周囲で評価が定まってから採用", "必要に迫られてから採用", "新技術の利用には消極的"]
  };

  return {
    gender: getRandomAttribute(attributes.gender),
    age: getRandomAttribute(attributes.age),
    values: getRandomAttribute(attributes.values),
    lifestage: getRandomAttribute(attributes.lifestage),
    income: getRandomAttribute(attributes.income),
    consumerBehavior: getRandomAttribute(attributes.consumerBehavior),
    techAttitude: getRandomAttribute(attributes.techAttitude)
  };
};

export function ABTest() {
  const [copyA, setCopyA] = useState('');
  const [copyB, setCopyB] = useState('');
  const [personas, setPersonas] = useState<PersonaAttribute[]>([]);
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

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg shadow-lg">
          <TestTubes className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white ml-2">ABテストの沼</h1>
        </div>
      </div>

      <div className="space-y-6">
        <CopyInputs
          copyA={copyA}
          copyB={copyB}
          setCopyA={setCopyA}
          setCopyB={setCopyB}
        />

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
          <div>
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => {
                  const randomPersonas = Array.from({ length: 4 }, () => getRandomPersona());
                  setPersonas(randomPersonas);
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.168 8A10.003 10.003 0 0 0 12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10a10.003 10.003 0 0 0 8.132-4.168" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17 8h4.4a.6.6 0 0 0 .6-.6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                想定ユーザーの属性をランダムで設定する
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <PersonaCard
                  key={index}
                  number={index + 1}
                  value={personas[index] || {
                    gender: '',
                    age: '',
                    values: '',
                    lifestage: '',
                    income: '',
                    consumerBehavior: '',
                    techAttitude: '',
                  }}
                  onChange={(newValue) => {
                    const newPersonas = [...personas];
                    newPersonas[index] = newValue;
                    setPersonas(newPersonas);
                  }}
                />
              ))}
            </div>
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
              className={`bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-lg shadow-lg flex items-center gap-2 ${
                analyzeMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {analyzeMutation.isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>分析中...</span>
                </>
              ) : (
                <>
                  <TestTubes className="h-5 w-5" />
                  分析する
                </>
              )}
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

      {analyzeMutation.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold">分析中...</p>
            <p className="text-sm text-gray-500 mt-2">しばらくお待ちください</p>
          </div>
        </div>
      )}
    </div>
  );
}
