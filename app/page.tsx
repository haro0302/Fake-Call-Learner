"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { scenarios } from "@/lib/scenarios";
import type { VoiceGender, PlaybackSpeed } from "@/lib/audioEngine";

const TAG_COLORS: Record<string, string> = {
  日常: "bg-green-100 text-green-700",
  買い物: "bg-blue-100 text-blue-700",
  ロマンス: "bg-pink-100 text-pink-700",
  仕事: "bg-orange-100 text-orange-700",
};

export default function HomePage() {
  const [gender, setGender] = useState<VoiceGender>("female");
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");

  useEffect(() => {
    const g = localStorage.getItem("fcl-gender") as VoiceGender | null;
    const s = localStorage.getItem("fcl-speed") as PlaybackSpeed | null;
    if (g) setGender(g);
    if (s) setSpeed(s);
  }, []);

  const saveGender = (g: VoiceGender) => {
    setGender(g);
    localStorage.setItem("fcl-gender", g);
  };

  const saveSpeed = (s: PlaybackSpeed) => {
    setSpeed(s);
    localStorage.setItem("fcl-speed", s);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Fake Call Learner</h1>
              <p className="text-xs text-gray-400">英語電話フリで周りに流暢に見せよう</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Settings card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">声の設定</h2>

          {/* Gender */}
          <div>
            <p className="text-sm text-gray-600 mb-2">音声の性別</p>
            <div className="flex gap-2">
              {(["female", "male"] as VoiceGender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => saveGender(g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    gender === g
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {g === "female" ? "👩 女性" : "👨 男性"}
                </button>
              ))}
            </div>
          </div>

          {/* Speed */}
          <div>
            <p className="text-sm text-gray-600 mb-2">再生スピード</p>
            <div className="flex gap-2">
              {([
                { key: "slow", label: "🐢 ゆっくり" },
                { key: "normal", label: "🚶 普通" },
                { key: "fast", label: "🚀 速め" },
              ] as { key: PlaybackSpeed; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => saveSpeed(key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    speed === key
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-4">
          <h2 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">使い方</h2>
          <ol className="space-y-2">
            {[
              "シナリオを選んでスクリプトを確認する",
              "「電話をかける」をタップ",
              "着信音の後、画面をタップして電話に出る",
              "ビープ音3回 → 流れてくる英語を復唱！",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-700">
                <span className="w-5 h-5 bg-emerald-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Scenario list */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            シナリオ一覧
          </h2>
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <Link
                key={scenario.id}
                href={`/scenario/${scenario.id}?gender=${gender}&speed=${speed}`}
                className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-gray-300 transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none mt-0.5">{scenario.callerEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm">{scenario.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          TAG_COLORS[scenario.tag] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {scenario.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{scenario.situation}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-300">
                        発話{scenario.lines.filter((l) => l.role === "user").length}回
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-300 text-xl leading-none mt-1">›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 pb-6">
          シナリオは順次追加予定
        </p>
      </div>
    </main>
  );
}
