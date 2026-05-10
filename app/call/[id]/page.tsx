"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getScenario, type ScenarioLine } from "@/lib/scenarios";
import { AudioEngine, type VoiceGender, type PlaybackSpeed } from "@/lib/audioEngine";

type CallPhase = "incoming" | "calling" | "complete";
type LinePhase = "partner" | "beeping" | "speaking" | "idle";

interface ActiveLine {
  index: number;
  phase: LinePhase;
  line: ScenarioLine;
}

export default function CallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const scenario = getScenario(id);

  const gender = (searchParams.get("gender") ?? "female") as VoiceGender;
  const speed = (searchParams.get("speed") ?? "normal") as PlaybackSpeed;

  const [phase, setPhase] = useState<CallPhase>("incoming");
  const [elapsed, setElapsed] = useState(0);
  const [activeLine, setActiveLine] = useState<ActiveLine | null>(null);
  const [isRinging, setIsRinging] = useState(true);

  const engineRef = useRef<AudioEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const endCall = useCallback(() => {
    engineRef.current?.cancel();
    stopTimer();
    setPhase("complete");
    setActiveLine(null);
  }, []);

  const runCallSequence = useCallback(async () => {
    if (!scenario || startedRef.current) return;
    startedRef.current = true;

    const engine = new AudioEngine();
    engineRef.current = engine;

    const voice = await engine.getVoice(gender);

    for (let i = 0; i < scenario.lines.length; i++) {
      if (engine.isCancelled()) break;
      const line = scenario.lines[i];

      if (line.role === "partner") {
        setActiveLine({ index: i, phase: "partner", line });
        await engine.wait(line.duration);
      } else {
        setActiveLine({ index: i, phase: "beeping", line });
        await engine.playBeeps();
        if (engine.isCancelled()) break;

        setActiveLine({ index: i, phase: "speaking", line });
        await engine.speak(line.text, voice, speed);
        if (engine.isCancelled()) break;

        await engine.wait(800);
      }
    }

    if (!engine.isCancelled()) {
      stopTimer();
      setPhase("complete");
      setActiveLine(null);
    }
  }, [scenario, gender, speed]);

  const answerCall = useCallback(() => {
    // iOS/Android requires audio APIs to be unlocked synchronously within a user gesture.
    // Calling speak() and resuming AudioContext here ensures subsequent async calls work.
    if (typeof window !== "undefined") {
      const ctx = new AudioContext();
      ctx.resume();

      if (window.speechSynthesis) {
        const unlock = new SpeechSynthesisUtterance(" ");
        unlock.volume = 0;
        window.speechSynthesis.speak(unlock);
      }
    }

    setPhase("calling");
    startTimer();
    runCallSequence();
  }, [runCallSequence]);

  // Ringtone
  useEffect(() => {
    if (phase !== "incoming") return;
    const engine = new AudioEngine();
    const timer = setTimeout(() => {
      engine.playRingtone(30000);
    }, 300);
    return () => {
      clearTimeout(timer);
      engine.cancel();
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      stopTimer();
      engineRef.current?.cancel();
    };
  }, []);

  if (!scenario) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">シナリオが見つかりません</p>
      </div>
    );
  }

  if (phase === "complete") {
    return <CompleteScreen scenario={scenario} onHome={() => router.push("/")} onRetry={() => router.push(`/call/${id}?gender=${gender}&speed=${speed}`)} />;
  }

  if (phase === "incoming") {
    return (
      <IncomingScreen
        scenario={scenario}
        isRinging={isRinging}
        onAnswer={answerCall}
        onDecline={() => router.push("/")}
      />
    );
  }

  // Calling phase
  return (
    <CallingScreen
      scenario={scenario}
      elapsed={elapsed}
      activeLine={activeLine}
      formatTime={formatTime}
      onEnd={endCall}
    />
  );
}

/* ─── Incoming Screen ─────────────────────────────── */

function IncomingScreen({
  scenario,
  isRinging,
  onAnswer,
  onDecline,
}: {
  scenario: ReturnType<typeof getScenario>;
  isRinging: boolean;
  onAnswer: () => void;
  onDecline: () => void;
}) {
  if (!scenario) return null;
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between py-16 px-6">
      {/* Caller info */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <p className="text-gray-400 text-sm tracking-wide">着信中...</p>
        <div className="relative">
          {/* Wave rings */}
          <div className="absolute inset-0 rounded-full bg-white/10 animate-ring-wave" />
          <div className="absolute inset-0 rounded-full bg-white/10 animate-ring-wave-delay" />
          <div className="absolute inset-0 rounded-full bg-white/10 animate-ring-wave-delay2" />
          {/* Avatar */}
          <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-6xl relative animate-ring-pulse">
            {scenario.callerEmoji}
          </div>
        </div>
        <div className="text-center mt-2">
          <h2 className="text-3xl font-bold text-white">{scenario.callerName}</h2>
          <p className="text-gray-400 text-sm mt-1">{scenario.title}</p>
        </div>
      </div>

      {/* Swipe hint */}
      <p className="text-gray-500 text-xs">タップして電話に出る</p>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-20 w-full">
        {/* Decline */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onDecline}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <PhoneDownIcon />
          </button>
          <span className="text-gray-400 text-xs">拒否</span>
        </div>
        {/* Answer */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onAnswer}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <PhoneIcon />
          </button>
          <span className="text-gray-400 text-xs">応答</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Calling Screen ──────────────────────────────── */

function CallingScreen({
  scenario,
  elapsed,
  activeLine,
  formatTime,
  onEnd,
}: {
  scenario: ReturnType<typeof getScenario>;
  elapsed: number;
  activeLine: ActiveLine | null;
  formatTime: (s: number) => string;
  onEnd: () => void;
}) {
  if (!scenario) return null;

  const isUserTurn = activeLine?.phase === "speaking" || activeLine?.phase === "beeping";
  const isPartnerTurn = activeLine?.phase === "partner";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between py-12 px-6">
      {/* Top: caller info */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl">
          {scenario.callerEmoji}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{scenario.callerName}</h2>
          <p className="text-green-400 text-sm mt-0.5">{formatTime(elapsed)}</p>
        </div>
      </div>

      {/* Middle: status / speech bubble */}
      <div className="w-full max-w-sm min-h-40 flex flex-col items-center justify-center gap-4">
        {isPartnerTurn && (
          <div className="animate-fade-in text-center">
            <p className="text-gray-400 text-sm mb-3">相手が話しています</p>
            <div className="flex items-center gap-1.5 justify-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full dot-1" />
              <div className="w-2 h-2 bg-gray-500 rounded-full dot-2" />
              <div className="w-2 h-2 bg-gray-500 rounded-full dot-3" />
            </div>
          </div>
        )}

        {activeLine?.phase === "beeping" && (
          <div className="animate-fade-in text-center">
            <p className="text-yellow-400 text-sm font-medium">あなたのターン…</p>
            <div className="flex items-center gap-2 mt-2 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-yellow-400 rounded-full"
                  style={{ animation: `dot-bounce 0.6s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}

        {activeLine?.phase === "speaking" && activeLine.line && (
          <div className="animate-fade-in w-full">
            <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-4 border border-white/10">
              <p className="text-xs text-green-400 font-medium mb-2">復唱してください ▶</p>
              <p className="text-white text-lg font-medium leading-snug">
                {activeLine.line.text}
              </p>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {activeLine.line.japanese}
              </p>
            </div>
          </div>
        )}

        {!activeLine && (
          <p className="text-gray-600 text-sm">接続中…</p>
        )}
      </div>

      {/* Bottom: controls */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Dummy controls row */}
        <div className="flex gap-10">
          <DummyButton icon="🔇" label="ミュート" />
          <DummyButton icon="🔊" label="スピーカー" />
          <DummyButton icon="⌨️" label="キーパッド" />
        </div>
        {/* End call */}
        <button
          onClick={onEnd}
          className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <PhoneDownIcon />
        </button>
        <span className="text-gray-500 text-xs">通話を終了</span>
      </div>
    </div>
  );
}

function DummyButton({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl">
        {icon}
      </div>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
}

/* ─── Complete Screen ─────────────────────────────── */

function CompleteScreen({
  scenario,
  onHome,
  onRetry,
}: {
  scenario: ReturnType<typeof getScenario>;
  onHome: () => void;
  onRetry: () => void;
}) {
  if (!scenario) return null;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top banner */}
      <div className="bg-gray-900 text-white px-4 py-8 text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-xl font-bold">お疲れ様でした！</h2>
        <p className="text-gray-400 text-sm mt-1">周りには流暢に見えたはず…！</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        {/* Full script review */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            今回の会話スクリプト
          </h3>
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
                      : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {line.role === "partner" && (
                    <p className="text-xs font-medium mb-1 text-gray-400">{scenario.callerName}</p>
                  )}
                  {line.role === "user" && (
                    <p className="text-xs font-medium mb-1 text-gray-400">あなた</p>
                  )}
                  <p className="text-sm leading-relaxed">{line.text}</p>
                  <p className="text-xs mt-1 leading-relaxed text-gray-400">{line.japanese}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <span>🔄</span> もう一度やってみる
          </button>
          <button
            onClick={onHome}
            className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <span>🏠</span> シナリオ一覧へ戻る
          </button>
        </div>

        <div className="pb-8" />
      </div>
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────── */

function PhoneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

function PhoneDownIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" transform="rotate(135)">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}
