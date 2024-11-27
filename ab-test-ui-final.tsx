import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Download, Brain, ShoppingCart, Target, Lightbulb, TestTubes, Sparkles } from 'lucide-react';

const ABTestUI = () => {
  const [activeTab, setActiveTab] = useState('result');

  const CopyInputs = () => (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4 px-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold">コピーA</h3>
          </div>
          <textarea 
            className="w-full h-32 p-3 border rounded-md resize-none bg-gray-50"
            placeholder="1つ目のキャッチコピーや説明文を入力してください"
            readOnly
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-bold">コピーB</h3>
          </div>
          <textarea 
            className="w-full h-32 p-3 border rounded-md resize-none bg-gray-50"
            placeholder="2つ目のキャッチコピーや説明文を入力してください"
            readOnly
          />
        </div>
      </div>
    </div>
  );

  const UserSection = () => {
    const attributes = [
      { label: "性別", id: "gender" },
      { label: "年齢層", id: "age" },
      { label: "価値観", id: "values" },
      { label: "ライフステージ", id: "lifestage" },
      { label: "世帯収入", id: "income" },
      { label: "消費行動特性", id: "consumer_behavior" },
      { label: "テクノロジーへの態度", id: "tech_attitude" }
    ];

    return (
      <div className="grid grid-cols-4 gap-4 mb-16">
        {[1, 2, 3, 4].map(num => (
          <Card key={num} className="bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4">想定ユーザー {num}</h3>
              <div className="space-y-3">
                {attributes.map((attr) => (
                  <div key={attr.id} className="space-y-1">
                    <label className="text-sm text-gray-600">{attr.label}</label>
                    <select className="w-full p-2 border rounded-md bg-white text-sm">
                      <option>選択してください</option>
                    </select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const UserAnalysis = ({ userNumber, winner }) => {
    const analysis = {
      mechanism: `• 年齢層と価値観から、シンプルで直接的な表現が好まれる傾向\n• 安心感を重視する心理的特性が強い\n• 具体的な数値による信頼性の向上`,
      behavior: `• 比較検討期間が短く、即断即決の傾向\n• オンラインでの情報収集を重視\n• 口コミによる影響を受けやすい`,
      differentiation: `• 競合他社との明確な違いを示す表現が効果的\n• 独自の価値提案が響きやすい\n• ブランドイメージとの整合性が高い`,
      improvement: `• より具体的な数値やデータの活用\n• 信頼性を高める要素の追加\n• ユーザー体験談の導入を検討`
    };

    return (
      <Card className="bg-white shadow-md">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className={`text-lg font-bold ${winner === 'A' ? 'text-blue-600' : 'text-purple-600'}`}>
                想定ユーザー {userNumber} → コピー{winner}
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Brain, title: '心理的反応メカニズム', content: analysis.mechanism },
                { icon: ShoppingCart, title: '購買行動への影響', content: analysis.behavior },
                { icon: Target, title: '競合との差別化', content: analysis.differentiation },
                { icon: Lightbulb, title: '改善提案', content: analysis.improvement }
              ].map(({ icon: Icon, title, content }, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Icon className="h-4 w-4" />
                    <h4>{title}</h4>
                  </div>
                  <div className="text-sm text-gray-600 pl-6 whitespace-pre-line">
                    {content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full p-6">
      {/* ロゴ */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg shadow-lg">
          <TestTubes className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white ml-2">ABテストの沼</h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="space-y-6">
        {/* コピー入力部分 */}
        <CopyInputs />

        {/* タブ切り替え */}
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

        {/* 分析結果/属性編集 */}
        {activeTab === 'result' ? (
          <div className="grid grid-cols-2 gap-6 mb-16">
            <UserAnalysis userNumber={1} winner="A" />
            <UserAnalysis userNumber={2} winner="B" />
            <UserAnalysis userNumber={3} winner="A" />
            <UserAnalysis userNumber={4} winner="B" />
          </div>
        ) : (
          <UserSection />
        )}

        {/* ボタンエリア */}
        <div className="flex justify-between items-center">
          <div className="flex-1" /> {/* 左側の空きスペース */}
          <div className="flex-1 flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-lg shadow-lg flex items-center gap-2">
              <TestTubes className="h-5 w-5" />
              分析する
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <button className="bg-white hover:bg-gray-50 text-blue-600 px-8 h-12 rounded-lg shadow-lg flex items-center gap-2 border border-blue-600">
              <Download className="h-5 w-5" />
              CSV出力
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABTestUI;