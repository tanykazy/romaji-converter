/**
 * ローマ字変換クラス
 * * 【優先度1】内閣告示「ローマ字のつづり方」ルール (標準)
 * 【優先度2】外務省「ヘボン式ローマ字綴方表」ルール (内閣告示で変換できない文字のみ)
 */
class RomajiConverter {
  constructor() {
    // 1. 内閣告示「ローマ字のつづり方」本表（標準ルール）
    // ※ここに定義されている文字は、いかなる場合でもこのルールが最優先されます
    this.cabinetMap = {
      'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
      'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
      'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
      'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
      'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
      'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
      'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
      'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
      'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
      'ヂャ': 'ja', 'ヂュ': 'ju', 'ヂョ': 'jo',
      'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
      'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',

      'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
      'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
      'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
      'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
      'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
      'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
      'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
      'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
      'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
      'ワ': 'wa', 'ヲ': 'o',

      'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
      'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
      'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
      'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
      'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',

      'ン': 'n' // 撥音はB,M,Pの前でも常に 'n' (内閣告示ルール優先)
    };

    // 2. 外務省「ヘボン式ローマ字綴方表」（フォールバック用ルール）
    // ※内閣告示に存在しない文字のみを定義。存在しない外来音への対処としてのみ機能します。
    this.passportFallbackMap = {
      'ヰ': 'i', 'ヱ': 'e',
      'ヴァ': 'ba', 'ヴィ': 'bi', 'ヴ': 'bu', 'ヴェ': 'be', 'ヴォ': 'bo',
      'シェ': 'shie', 'チェ': 'chie', 'ティ': 'tei', 'ニイ': 'nii', 'ニエ': 'nie',
      'ファ': 'fua', 'フィ': 'fui', 'フェ': 'fue', 'フォ': 'fuo', 'ジェ': 'jie',
      'ディ': 'dei', 'デュ': 'deyu', 'ウィ': 'ui', 'ウェ': 'ue', 'ウォ': 'uo'
    };
  }

  /**
   * ひらがなをカタカナに変換するユーティリティメソッド
   */
  hiraToKata(str) {
    return str.replace(/[\u3041-\u3096]/g, function (match) {
      const chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  }

  /**
   * 次の文字のローマ字表現を先読みして取得する（促音「ッ」の処理用）
   */
  peekNextRomaji(katakana, index) {
    if (index >= katakana.length) return '';

    // 優先度1: 2文字（内閣告示） -> 優先度2: 2文字（パスポート）
    let char2 = katakana.substring(index, index + 2);
    if (this.cabinetMap[char2]) return this.cabinetMap[char2];
    if (this.passportFallbackMap[char2]) return this.passportFallbackMap[char2];

    // 優先度3: 1文字（内閣告示） -> 優先度4: 1文字（パスポート）
    let char1 = katakana.substring(index, index + 1);
    if (this.cabinetMap[char1]) return this.cabinetMap[char1];
    if (this.passportFallbackMap[char1]) return this.passportFallbackMap[char1];

    return '';
  }

  /**
   * カタカナ（またはひらがな）をローマ字に変換します。
   */
  convert(text) {
    const katakana = this.hiraToKata(text);
    let result = '';
    let i = 0;

    // ローマ字を結果に追加する際のヘルパー関数 (撥音の直後のアポストロフィ処理)
    const appendRomaji = (romaji) => {
      // 直前が「ン(n)」で、次が母音または「y」の場合は「'」で区切る (内閣告示ルール 添え書き4)
      if (result.endsWith('n') && romaji.match(/^[aiueoy]/)) {
        result += "'";
      }
      result += romaji;
    };

    while (i < katakana.length) {
      let char1 = katakana.substring(i, i + 1);
      let char2 = katakana.substring(i, i + 2);

      // 【内閣告示ルール】 促音（ッ）の処理
      // ※CHの前であっても「t」ではなく、内閣告示通りに次の子音を重ねる
      if (char1 === 'ッ') {
        let nextRomaji = this.peekNextRomaji(katakana, i + 1);
        if (nextRomaji) {
          result += nextRomaji.charAt(0);
        }
        i++;
        continue;
      }

      // 【内閣告示ルール】 長音（ー）の処理
      // ※パスポートルールのように省略せず、直前の母音を繰り返す
      if (char1 === 'ー') {
        if (result.length > 0) {
          let lastChar = result.charAt(result.length - 1);
          if (lastChar.match(/[aiueo]/)) {
            result += lastChar;
          }
        }
        i++;
        continue;
      }

      // 優先度1: 2文字（内閣告示ルール）
      if (this.cabinetMap[char2]) {
        appendRomaji(this.cabinetMap[char2]);
        i += 2;
        continue;
      }

      // 優先度2: 2文字（パスポートルール・フォールバック）
      if (this.passportFallbackMap[char2]) {
        appendRomaji(this.passportFallbackMap[char2]);
        i += 2;
        continue;
      }

      // 優先度3: 1文字（内閣告示ルール）
      if (this.cabinetMap[char1]) {
        appendRomaji(this.cabinetMap[char1]);
        i++;
        continue;
      }

      // 優先度4: 1文字（パスポートルール・フォールバック）
      if (this.passportFallbackMap[char1]) {
        appendRomaji(this.passportFallbackMap[char1]);
        i++;
        continue;
      }

      // どちらの表にも存在しない文字（記号等）はそのまま出力
      result += char1;
      i++;
    }

    return result;
  }
}

// ==========================================
// テストコード（行単位でコメントアウト可能）
// ==========================================
// const converter = new RomajiConverter();

// console.log("=== 【1】内閣告示ルール：直音・拗音 ===");
// console.log("ア行: " + converter.convert("アイウエオ")); // 期待値: aiueo
// console.log("カ行: " + converter.convert("カキクケコ")); // 期待値: kakikukeko
// console.log("拗音: " + converter.convert("キャキュキョ")); // 期待値: kyakyukyo
// // 任意の行をコメントアウトして実行確認できます
// // console.log("シャ行: " + converter.convert("シャシュショ")); // 期待値: shashusho

// console.log("\n=== 【2】内閣告示ルール：撥音（ン） ===");
// // B, M, P の前でもパスポートルール(m)に上書きされず 'n' になること
// console.log("シンブン -> " + converter.convert("シンブン")); // 期待値: shinbun
// console.log("アンマン -> " + converter.convert("アンマン")); // 期待値: anman
// console.log("サンペイ -> " + converter.convert("サンペイ")); // 期待値: sanpei
// // 次の文字が母音や 'y' の場合はアポストロフィで区切られること
// console.log("タンイ -> " + converter.convert("タンイ")); // 期待値: tan'i
// console.log("トンヤ -> " + converter.convert("トンヤ")); // 期待値: ton'ya
// console.log("シンアイ -> " + converter.convert("シンアイ")); // 期待値: shin'ai

// console.log("\n=== 【3】内閣告示ルール：促音（ッ） ===");
// // 子音を重ねる。CHの前でもパスポートルール(t)に上書きされず 'c' になること
// console.log("マッチャ -> " + converter.convert("マッチャ")); // 期待値: maccha (NOT: matcha)
// console.log("ハッチョウ -> " + converter.convert("ハッチョウ")); // 期待値: hacchou (NOT: hatchou)
// console.log("ザッシ -> " + converter.convert("ザッシ")); // 期待値: zasshi
// console.log("テッパン -> " + converter.convert("テッパン")); // 期待値: teppan
// console.log("ヤッキョク -> " + converter.convert("ヤッキョク")); // 期待値: yakkyoku

// console.log("\n=== 【4】内閣告示ルール：長音（ー） ===");
// // パスポートルールのように省略されず、直前の母音が繰り返されること
// console.log("コーヒー -> " + converter.convert("コーヒー")); // 期待値: koohii
// console.log("スーパー -> " + converter.convert("スーパー")); // 期待値: suupaa
// console.log("セーラー -> " + converter.convert("セーラー")); // 期待値: seeraa
// console.log("タクシー -> " + converter.convert("タクシー")); // 期待値: takushii
// // 長音が連続する場合
// console.log("ブーブー -> " + converter.convert("ブーブー")); // 期待値: buubuu

// console.log("\n=== 【5】パスポート表記ルール（フォールバック） ===");
// // 内閣告示ルールに存在しない外来音のみ、ヘボン式が適用されること
// console.log("ヴァイオリン -> " + converter.convert("ヴァイオリン")); // 期待値: baiorin (ヴァ->ba)
// console.log("ヴィヴィアン -> " + converter.convert("ヴィヴィアン")); // 期待値: bibian (ヴィ->bi)
// console.log("ファミレス -> " + converter.convert("ファミレス")); // 期待値: fuamiresu (ファ->fua)
// console.log("パーティ -> " + converter.convert("パーティ")); // 期待値: paatei (ティ->tei)
// console.log("ウィキペディア -> " + converter.convert("ウィキペディア")); // 期待値: uikipedia (ウィ->ui, ディ->dei)
// console.log("ジェリー -> " + converter.convert("ジェリー")); // 期待値: jierii (ジェ->jie)
// console.log("チェロ -> " + converter.convert("チェロ")); // 期待値: chiero (チェ->chie)
// console.log("ティッシュ -> " + converter.convert("ティッシュ")); // 期待値: teisshu (ティ->tei)

// console.log("\n=== 【6】ひらがな・記号の対応 ===");
// // ひらがなはカタカナに変換されて処理される
// console.log("こんにちは -> " + converter.convert("こんにちは")); // 期待値: konnichiha (「は」はhaのまま)
// console.log("あっさり -> " + converter.convert("あっさり")); // 期待値: assari
// // 記号などはそのまま出力される
// console.log("テスト(Test) -> " + converter.convert("テスト(Test)")); // 期待値: tesuto(Test)
// console.log("あ、はい。 -> " + converter.convert("あ、はい。")); // 期待値: a、hai。