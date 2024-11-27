import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { PersonaAttribute } from "@/lib/types";

const attributes = {
  gender: ["男性", "女性", "その他"],
  age: ["10代", "20-24歳", "25-29歳", "30-34歳", "35-39歳", "40-44歳", "45-49歳", "50-54歳", "55-59歳", "60-64歳", "65歳以上"],
  values: ["品質重視", "価格重視", "トレンド重視", "環境配慮重視", "社会貢献重視"],
  lifestage: ["学生", "独身・若手社会人", "独身・キャリア充実期", "子育て初期家族", "子育て充実期家族", "子育て終了期家族", "夫婦二人暮らし"],
  income: ["～300万円", "300～500万円", "500～700万円", "700～1000万円", "1000万円～"],
  consumerBehavior: ["徹底的に調査して慎重に選ぶ", "必要に応じて素早く決定する", "感覚的・感情的に選ぶ", "他者の推奨を重視する", "ブランドを重視する"],
  techAttitude: ["最新技術に敏感で積極的に活用", "新しい技術は比較的早めに採用", "周囲で評価が定まってから採用", "必要に迫られてから採用", "新技術の利用には消極的"],
};

interface PersonaCardProps {
  number: number;
  value: PersonaAttribute;
  onChange: (value: PersonaAttribute) => void;
}

export function PersonaCard({ number, value, onChange }: PersonaCardProps) {
  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          想定ユーザー {number}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {Object.entries(attributes).map(([key, options]) => (
          <div key={key} className="space-y-1">
            <label className="text-sm text-gray-600">
              {key === "gender" ? "性別" :
               key === "age" ? "年齢層" :
               key === "values" ? "価値観" :
               key === "lifestage" ? "ライフステージ" :
               key === "income" ? "世帯年収" :
               key === "consumerBehavior" ? "消費行動特性" :
               "テクノロジーへの態度"}
            </label>
            <Select
              value={value[key as keyof PersonaAttribute]}
              onValueChange={(newValue) =>
                onChange({ ...value, [key]: newValue })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
