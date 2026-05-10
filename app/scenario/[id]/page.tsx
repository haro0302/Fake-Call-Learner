"use client";

import { use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getScenario } from "@/lib/scenarios";

export default function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const scenario = getScenario(id);

  const gender = searchParams.get("gender") ?? "female";
  const speed = searchParams.get("speed") ?? "normal";

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">シナリオが見つかりません</p>
          <Link href="/" className="text-blue-500 text-sm mt-2 block">ホームへ戻る</Link>
        </div>
      </div>
    );
  }

  const handleCall = () => {
    router.push(`/call/${id}?gender=${gender}&speed=${speed}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/?gender=${gender}&speed=${speed}`}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            ‹ 戻る
          </Link>
          <h1 className="font-semibold text-gray-900 text-sm flex-1 truncate">
            {scenario.title}
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-5">
        {/* Caller info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
            {scenario.callerEmoji}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">発信者</p>
            <p className="font-bold text-gray-900">{scenario.callerName}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{scenario.situation}</p>
          </div>
        </div>

        {/* Script */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            スクリプト（事前確認用）
          </h2>
          <div className="space-y-3">
            {scenario.lines.map((line, i) => (
              <div
                key={i}
                className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    line.role === "user"
                      ? "bg-gray-900 text-white rounded-br-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {line.role === "partner" && (
                    <p className="text-xs font-medium mb-1 text-gray-400">{scenario.callerName}</p>
                  )}
                  {line.role === "user" && (
                    <p className="text-xs font-medium mb-1 text-gray-400">あなた（復唱）</p>
                  )}
                  <p className="text-sm leading-relaxed">{line.text}</p>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      line.role === "user" ? "text-gray-400" : "text-gray-400"
                    }`}
                  >
                    {line.japanese}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            💡 <strong>ポイント：</strong>通話中は「あなた（復唱）」の台詞だけが流れます。
            スクリプトをよく読んで雰囲気をつかんでからスタートしよう！
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleCall}
          className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
        >
          <span className="text-xl">📞</span>
          電話をかける
        </button>

        <div className="pb-6" />
      </div>
    </main>
  );
}
