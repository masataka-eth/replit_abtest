import React, { useState } from "react";
import { TestTubes, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { PersonaCard } from "@/components/PersonaCard";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { analyzeABTest } from "@/lib/api";
import type { PersonaAttribute, AnalysisResult } from "@/lib/types";

const initialPersonaAttribute: PersonaAttribute = {
  gender: "",
  age: "",
  values: "",
  lifestage: "",
  income: "",
  consumerBehavior: "",
  techAttitude: "",
};

export function ABTest() {
  const [copyA, setCopyA] = useState("");
  const [copyB, setCopyB] = useState("");
  const [personas, setPersonas] = useState(Array(4).fill(null).map(() => ({ ...initialPersonaAttribute })));
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeABTest(copyA, copyB, personas.map((p, i) => ({ number: i + 1, attributes: p }))),
    onSuccess: (data) => {
      setResults(data.results);
    },
    onError: () => {
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

      {results.length === 0 ? (
        <>
          <div className="flex gap-4">
            <Card className="flex-1 bg-white shadow-lg">
              <CardHeader className="p-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  コピーA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={copyA}
                  onChange={(e) => setCopyA(e.target.value)}
                  className="h-32 resize-none"
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
                <Textarea
                  value={copyB}
                  onChange={(e) => setCopyB(e.target.value)}
                  className="h-32 resize-none"
                  placeholder="2つ目のキャッチコピーや説明文を入力してください"
                />
              </CardContent>
            </Card>
          </div>

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

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => analyzeMutation.mutate()}
              disabled={analyzeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2"
            >
              <TestTubes className="h-5 w-5" />
              {analyzeMutation.isPending ? "分析中..." : "分析する"}
            </Button>
          </div>
        </>
      ) : (
        <ResultsDisplay results={results} />
      )}
    </div>
  );
}
