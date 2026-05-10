export type ScenarioLine = {
  role: 'user' | 'partner';
  text: string;
  japanese: string;
  duration: number;
  pitch?: number; // 0.5–2.0, default 1.0 (for emotional variation)
};

export type Scenario = {
  id: string;
  title: string;
  situation: string;
  callerName: string;
  callerEmoji: string;
  tag: string;
  lines: ScenarioLine[];
};

export const scenarios: Scenario[] = [
  {
    id: 'weeding',
    title: '草むしりを頼まれる',
    situation: 'パートナーから週末の庭仕事を手伝ってほしいとお願い電話が入ってきた',
    callerName: 'Alex',
    callerEmoji: '🌿',
    tag: '日常',
    lines: [
      {
        role: 'user',
        text: "Hey Alex! Good timing, I was just thinking about you!",
        japanese: "あ、アレックス！ちょうどよかった、考えてたとこだよ！",
        duration: 0,
        pitch: 1.1,
      },
      {
        role: 'partner',
        text: "Hey! Are you free this weekend? The garden is getting pretty wild and I could really use a hand.",
        japanese: "ねえ、今週末って空いてる？庭がすごいことになってて手伝ってほしいんだけど。",
        duration: 5500,
      },
      {
        role: 'user',
        text: "This weekend? Yeah, I think I'm free on Saturday. What exactly do you need me to do?",
        japanese: "今週末？土曜日なら空いてると思う。具体的に何が必要？",
        duration: 4000,
        pitch: 1.05,
      },
      {
        role: 'partner',
        text: "The weeds are completely out of control. It should only take a couple of hours, I promise.",
        japanese: "雑草がもう手がつけられなくて。2時間もあれば終わるから、本当に。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Sure, no problem. I'll bring my gardening gloves. What time should I come over?",
        japanese: "いいよ、問題ない。軍手持っていくよ。何時に行けばいい？",
        duration: 3500,
        pitch: 1.0,
      },
      {
        role: 'partner',
        text: "How about ten in the morning? I'll make us a proper lunch afterward as a thank you.",
        japanese: "午前10時はどう？お礼にちゃんとしたランチ作るよ。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "That sounds great. See you Saturday morning at ten. Talk to you later, bye!",
        japanese: "いいね。土曜の朝10時に行くよ。またね、バイバイ！",
        duration: 3500,
        pitch: 1.1,
      },
    ],
  },
  {
    id: 'cat-feeding',
    title: '猫の餌やりをお願い',
    situation: '友人が急な出張で不在になるため、飼い猫のモチの世話を頼まれた',
    callerName: 'Jordan',
    callerEmoji: '🐱',
    tag: '日常',
    lines: [
      {
        role: 'user',
        text: "Hey Jordan! What's up? Everything okay?",
        japanese: "やあ、ジョーダン！どうしたの？大丈夫？",
        duration: 0,
        pitch: 1.05,
      },
      {
        role: 'partner',
        text: "Hi, sorry to call out of the blue. I have a really big favor to ask you.",
        japanese: "もしもし、突然ごめんね。すごくお願いしたいことがあって。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Of course, what is it? You know you can always count on me.",
        japanese: "もちろん、何？いつでも頼っていいよ。",
        duration: 3000,
        pitch: 1.05,
      },
      {
        role: 'partner',
        text: "I have to go on a business trip for three days starting tomorrow. Could you possibly look after my cat while I'm gone?",
        japanese: "明日から3日間出張に行かないといけなくて。不在の間、うちの猫の面倒を見てもらえない？",
        duration: 6500,
      },
      {
        role: 'user',
        text: "Oh, Mochi! Of course! I'd love to. Just leave me a spare key.",
        japanese: "モチか！もちろん！喜んで。合鍵を置いておいてね。",
        duration: 3500,
        pitch: 1.15,
      },
      {
        role: 'partner',
        text: "You're an absolute lifesaver. He eats twice a day, morning and evening. The food is in the kitchen cabinet.",
        japanese: "本当に助かる。1日2回、朝と夜にご飯をあげてね。フードはキッチンの棚にあるよ。",
        duration: 5500,
      },
      {
        role: 'user',
        text: "Got it. Morning and evening. Mochi's in good hands, don't worry! Safe travels, bye!",
        japanese: "了解。朝と夜ね。モチは任せて、心配しないで！気をつけてね、バイバイ！",
        duration: 4000,
        pitch: 1.1,
      },
    ],
  },
  {
    id: 'milk',
    title: '晩御飯の牛乳を買ってきて',
    situation: '料理中のパートナーから「牛乳がない！」と緊急入電があった',
    callerName: 'Sam',
    callerEmoji: '🥛',
    tag: '買い物',
    lines: [
      {
        role: 'user',
        text: "Hey babe! I'm almost home, what's up?",
        japanese: "あ、もうすぐ帰るよ！どうしたの？",
        duration: 0,
        pitch: 1.05,
      },
      {
        role: 'partner',
        text: "Hey! Are you still on your way home? I'm in the middle of cooking dinner.",
        japanese: "ねえ！まだ帰り道？今夕飯作ってるんだけど。",
        duration: 4500,
      },
      {
        role: 'user',
        text: "Yeah, I'm on my way home right now. What's going on?",
        japanese: "うん、今帰り道だよ。どうしたの？",
        duration: 2500,
        pitch: 1.0,
      },
      {
        role: 'partner',
        text: "We're completely out of milk and I really need it for the recipe. Can you stop by the store?",
        japanese: "牛乳が全部なくなってて、レシピに必要なの。お店に寄ってもらえる？",
        duration: 5500,
      },
      {
        role: 'user',
        text: "Milk? Just one carton? Regular milk, not low-fat, right?",
        japanese: "牛乳？1パックでいい？低脂肪乳じゃなくて普通のやつ？",
        duration: 3000,
        pitch: 1.0,
      },
      {
        role: 'partner',
        text: "Yes, exactly. Just one carton of regular milk. Oh, and maybe grab some eggs too if they're not too expensive.",
        japanese: "そう、その通り。普通牛乳1パックだけ。あと、高くなければ卵も買ってきてくれると嬉しい。",
        duration: 6000,
      },
      {
        role: 'user',
        text: "Got it! Milk and eggs. I'll be home soon, see you in a bit! Bye!",
        japanese: "了解！牛乳と卵ね。すぐ帰るよ、もうちょっと待ってて！バイバイ！",
        duration: 3500,
        pitch: 1.1,
      },
    ],
  },
  {
    id: 'airport',
    title: '恋人を空港に迎えに行く',
    situation: '旅行から帰ってきた恋人が空港に着いたと連絡してきた',
    callerName: 'Riley',
    callerEmoji: '✈️',
    tag: 'ロマンス',
    lines: [
      {
        role: 'user',
        text: "Riley! Oh my gosh, are you here already? Welcome back!",
        japanese: "ライリー！もう着いたの？おかえり！",
        duration: 0,
        pitch: 1.2,
      },
      {
        role: 'partner',
        text: "Hi! I just landed! I'm at baggage claim right now. Are you close to the airport?",
        japanese: "もしもし！今着いた！今手荷物受取所にいるんだけど。空港の近くにいる？",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Yes! I've been here for twenty minutes already. I missed you so much!",
        japanese: "うん！もう20分前から来てるよ。すごく会いたかった！",
        duration: 3500,
        pitch: 1.15,
      },
      {
        role: 'partner',
        text: "The trip was amazing but I'm completely exhausted. I've missed you so much. Thank you for coming to pick me up.",
        japanese: "旅行は最高だったけど、もうクタクタ。すごく会いたかった。迎えに来てくれてありがとう。",
        duration: 6000,
      },
      {
        role: 'user',
        text: "Of course! I'm parked in Terminal 2. Take your time with your bags, no rush.",
        japanese: "当たり前だよ！第2ターミナルに停めてあるよ。荷物は急がなくていいから。",
        duration: 4000,
        pitch: 1.05,
      },
      {
        role: 'partner',
        text: "I actually only have a carry-on today, so I should be out in about ten minutes or so.",
        japanese: "今日は機内持ち込みだけだから、10分くらいで出られると思う。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Perfect! I'll be right at the exit. I can't wait to see you! Hurry up, bye!",
        japanese: "いいね！出口でずっと待ってるよ。早く会いたい！急いでね、バイバイ！",
        duration: 3500,
        pitch: 1.2,
      },
    ],
  },
  {
    id: 'bug-report',
    title: 'バグ対応の緊急報告',
    situation: '決済システムが落ちたと同僚から緊急の電話が入った',
    callerName: 'Taylor',
    callerEmoji: '🔥',
    tag: '仕事',
    lines: [
      {
        role: 'user',
        text: "Taylor, hey! What's going on? You're calling me at this hour?",
        japanese: "テイラー、やあ！どうしたの？この時間に電話？",
        duration: 0,
        pitch: 1.0,
      },
      {
        role: 'partner',
        text: "Hey, we have a critical situation right now. The payment system just went down and users can't complete any transactions.",
        japanese: "ねえ、今すごく深刻な状況なの。決済システムが落ちてユーザーが取引を完了できなくなってる。",
        duration: 6500,
      },
      {
        role: 'user',
        text: "What?! Since when? How many users are affected right now?",
        japanese: "えっ！いつから？今どのくらいのユーザーに影響が出てる？",
        duration: 3000,
        pitch: 1.1,
      },
      {
        role: 'partner',
        text: "It started about thirty minutes ago. We're seeing hundreds of failed transactions every single minute.",
        japanese: "30分くらい前から始まって。毎分何百件もの取引が失敗してる。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Okay, I'm on it right now. Is the engineering team already looking at the server logs?",
        japanese: "了解、今すぐ対応する。エンジニアチームはもうサーバーログを確認してる？",
        duration: 4000,
        pitch: 0.95,
      },
      {
        role: 'partner',
        text: "Yes, they're on it but they specifically need your input. Can you check the API gateway configuration immediately?",
        japanese: "うん、対応してるけど特にあなたの意見が必要で。今すぐAPIゲートウェイの設定を確認してもらえる？",
        duration: 6000,
      },
      {
        role: 'user',
        text: "I'm already on the dashboard. Two minutes and I'll call you back with an update. Stay on it, bye!",
        japanese: "もうダッシュボード開いてる。2分後に状況を折り返すよ。引き続き対応して、バイバイ！",
        duration: 4000,
        pitch: 0.95,
      },
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
