import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TestTubes, ChevronDown, Sparkles } from 'lucide-react';

const ABTestUI = () => {
  const userAttributes = [
    { label: "性別", id: "gender" },
    { label: "年齢層", id: "age" },
    { label: "価値観", id: "values" },
    { label: "ライフステージ", id: "lifestage" },
    { label: "世帯収入", id: "income" },
    { label: "消費行動特性", id: "consumer_behavior" },
    { label: "テクノロジーへの態度", id: "tech_attitude" }
  ];

  const UserCard = ({ number }) => (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          想定ユーザー {number}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {userAttributes.map((attr) => (
          <div key={attr.id} className="space-y-1">
            <label className="text-sm text-gray-600">{attr.label}</label>
            <div className="relative">
              <select className="w-full p-2 border rounded-md appearance-none bg-white pr-8 text-sm cursor-pointer hover:border-blue-500 transition-colors">
                <option>選択してください</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* ロゴ部分 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg shadow-lg">
          <TestTubes className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white ml-2">ABテストの沼</h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="space-y-6">
        {/* コピー入力部分 - 常に横並び */}
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
                className="w-full h-32 p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2つ目のキャッチコピーや説明文を入力してください"
              />
            </CardContent>
          </Card>
        </div>

        {/* 想定ユーザー部分 - 常に4カラム */}
        <div>
          <div className="flex justify-between gap-4">
            <div className="flex-1"><UserCard number="1" /></div>
            <div className="flex-1"><UserCard number="2" /></div>
            <div className="flex-1"><UserCard number="3" /></div>
            <div className="flex-1"><UserCard number="4" /></div>
          </div>
        </div>

        {/* 分析ボタン */}
        <div className="flex justify-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2">
            <TestTubes className="h-5 w-5" />
            分析する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ABTestUI;