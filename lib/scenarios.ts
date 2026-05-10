export type ScenarioLine = {
  role: 'user' | 'partner';
  text: string;
  japanese: string;
  duration: number; // ms: for partner = silence length, for user = estimated TTS length (unused, waits for end event)
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
        role: 'partner',
        text: "Hey, are you free this weekend? The garden is getting pretty wild and I could really use a hand.",
        japanese: "ねえ、今週末って空いてる？庭がすごいことになってて手伝ってほしいんだけど。",
        duration: 5500,
      },
      {
        role: 'user',
        text: "This weekend? Yeah, I think I'm free on Saturday. What exactly do you need me to do?",
        japanese: "今週末？土曜日なら空いてると思う。具体的に何が必要？",
        duration: 4000,
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
      },
      {
        role: 'partner',
        text: "How about ten in the morning? I'll make us a proper lunch afterward as a thank you.",
        japanese: "午前10時はどう？お礼にちゃんとしたランチ作るよ。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "That sounds great. See you Saturday morning at ten then. I'll be there.",
        japanese: "いいね。土曜の朝10時に行くよ。ちゃんと行くから。",
        duration: 3500,
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
        role: 'partner',
        text: "Hi, sorry to call out of the blue. I have a really big favor to ask you.",
        japanese: "もしもし、突然ごめんね。すごくお願いしたいことがあって。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Hey, no worries at all! What's going on? Is everything okay?",
        japanese: "全然大丈夫だよ！どうしたの？大丈夫？",
        duration: 3000,
      },
      {
        role: 'partner',
        text: "I have to go on a business trip for three days starting tomorrow. Could you possibly look after my cat while I'm gone?",
        japanese: "明日から3日間出張に行かないといけなくて。不在の間、うちの猫の面倒を見てもらえない？",
        duration: 6500,
      },
      {
        role: 'user',
        text: "Of course! You know I love Mochi. I'll be happy to help. Just leave me a spare key.",
        japanese: "もちろん！モチのこと大好きだもん。喜んで。合鍵を置いておいてね。",
        duration: 4000,
      },
      {
        role: 'partner',
        text: "You're an absolute lifesaver. He eats twice a day, morning and evening. The food is in the kitchen cabinet.",
        japanese: "本当に助かる。1日2回、朝と夜にご飯をあげてね。フードはキッチンの棚にあるよ。",
        duration: 5500,
      },
      {
        role: 'user',
        text: "Got it. Twice a day, morning and evening. Don't worry at all. I'll take great care of him.",
        japanese: "了解。朝と夜の2回ね。全然心配しないで。ちゃんと面倒見るよ。",
        duration: 4000,
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
        role: 'partner',
        text: "Hey! Are you still on your way home? I'm in the middle of cooking dinner.",
        japanese: "ねえ！まだ帰り道？今夕飯作ってるんだけど。",
        duration: 4500,
      },
      {
        role: 'user',
        text: "Hey, I'm on my way home. What's up?",
        japanese: "あ、今帰り道だよ。どうしたの？",
        duration: 2500,
      },
      {
        role: 'partner',
        text: "We're completely out of milk and I really need it for the recipe. Can you stop by the store?",
        japanese: "牛乳が全部なくなってて、レシピに必要なの。お店に寄ってもらえる？",
        duration: 5500,
      },
      {
        role: 'user',
        text: "What? Milk? Just one carton? Regular milk, not low-fat, right?",
        japanese: "えっ、牛乳？1パックでいい？低脂肪乳じゃなくて普通のやつ？",
        duration: 3500,
      },
      {
        role: 'partner',
        text: "Yes, exactly. Just one carton of regular milk. Oh, and maybe grab some eggs too if they're not too expensive.",
        japanese: "そう、その通り。普通牛乳1パックだけ。あと、高くなければ卵も買ってきてくれると嬉しい。",
        duration: 6000,
      },
      {
        role: 'user',
        text: "Got it. I'll stop by the supermarket and then head straight home. Won't take long.",
        japanese: "了解。近くのスーパーに寄ってからまっすぐ帰るよ。すぐ戻るから。",
        duration: 3500,
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
        role: 'partner',
        text: "Hi! I just landed! I'm at baggage claim right now. Are you close to the airport?",
        japanese: "もしもし！今着いた！今手荷物受取所にいるんだけど。空港の近くにいる？",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Hey! Welcome back! How was your trip? I'm already here waiting for you.",
        japanese: "おかえり！旅行どうだった？もう着いて待ってるよ。",
        duration: 3500,
      },
      {
        role: 'partner',
        text: "The trip was amazing but I'm completely exhausted. I've missed you so much. Thank you for coming to pick me up.",
        japanese: "旅行は最高だったけど、もうクタクタ。すごく会いたかった。迎えに来てくれてありがとう。",
        duration: 6000,
      },
      {
        role: 'user',
        text: "Of course, I missed you too! I'm parked in Terminal 2. Take your time with your bags.",
        japanese: "当たり前だよ、私も会いたかった！第2ターミナルに停めてあるよ。荷物は急がなくていいから。",
        duration: 4000,
      },
      {
        role: 'partner',
        text: "I actually only have a carry-on today, so I should be out in about ten minutes or so.",
        japanese: "今日は機内持ち込みだけだから、10分くらいで出られると思う。",
        duration: 5000,
      },
      {
        role: 'user',
        text: "Perfect. I'll be right at the exit waiting for you. Just text me when you're coming out.",
        japanese: "いいね。出口のところでずっと待ってるよ。出てくるときにメッセージして。",
        duration: 4000,
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
        role: 'partner',
        text: "Hey, we have a critical situation right now. The payment system just went down and users can't complete any transactions.",
        japanese: "ねえ、今すごく深刻な状況なの。決済システムが落ちてユーザーが取引を完了できなくなってる。",
        duration: 6500,
      },
      {
        role: 'user',
        text: "What? Since when? How many users are affected right now?",
        japanese: "えっ？いつから？今どのくらいのユーザーに影響が出てる？",
        duration: 3000,
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
      },
      {
        role: 'partner',
        text: "Yes, they're on it but they specifically need your input. Can you check the API gateway configuration immediately?",
        japanese: "うん、対応してるけど特にあなたの意見が必要で。今すぐAPIゲートウェイの設定を確認してもらえる？",
        duration: 6000,
      },
      {
        role: 'user',
        text: "I'm pulling up the dashboard right now. Give me two minutes and I'll get back to you with a full update.",
        japanese: "今すぐダッシュボードを開く。2分待って、詳細な状況をまた連絡するよ。",
        duration: 4500,
      },
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
