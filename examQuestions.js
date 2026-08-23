/* ============================================================
   學測五年考題一覽（111–115學測）
   與108課綱部定十五篇核心古文（N31–N45）相關之題目
   每題含：題號、題型、題幹摘要、考點(能力)、涉及古文、來源
   來源為教師解題評析與官方試題互證，非大考中心官方逐題公布
   ============================================================ */

const SCRIBD_114 = 'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90';

const examQuestions = [
  /* ===== 111學測 ===== */
  { year:'111', qNum:'26', type:'單選題', stem:'比較〈諫逐客書〉、〈項脊軒志〉、〈鹿港乘桴記〉、〈鴻門宴〉等篇章引文之字義異同', skill:'字義辨識與應用', textIds:['N33','N40','N44','N34'], sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { year:'111', qNum:'未明', type:'待查', stem:'歷屆矩陣標示〈燭之武退秦師〉、〈大同與小康〉、〈師說〉、〈虯髯客傳〉曾出現，惟未見題號舉證', skill:'題號待官方逐題核對', textIds:['N31','N32','N37','N38'], sourceUrl:'https://tw.amazingtalker.com/blog/zh-tw/k12/74304/', sourceName:'amazingtalker矩陣(題號待考)' },

  /* ===== 112學測 ===== */
  { year:'112', qNum:'1', type:'單選題', stem:'考查字音，選項引文出自〈畫菊自序〉(胡笳之拍)、〈勸和論〉(釁起鬩牆)、〈勞山道士〉(驀然而踣)、〈虯髯客傳〉(吁嗟而去)', skill:'字音辨識、核心古文形音義', textIds:['N45','N43','N42','N38'], sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { year:'112', qNum:'5', type:'單選題', stem:'閱讀〈燭之武退秦師〉與〈鴻門宴〉進行兩篇對讀', skill:'閱讀理解、課文對讀與統整', textIds:['N31','N34'], sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { year:'112', qNum:'35', type:'混合題', stem:'以明代雜劇《赤壁遊》(〈赤壁賦〉之改編作品)為材料命題', skill:'精準閱讀、適切表達', textIds:['N39'], sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },

  /* ===== 113學測 ===== */
  { year:'113', qNum:'29', type:'混合題', stem:'以硃砂科普知識連結〈項脊軒志〉與《天工開物》，進行跨領域整合', skill:'跨領域連結、知識整合、課文融會貫通', textIds:['N40'], sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { year:'113', qNum:'未逐條', type:'字音/字義(題號未公布)', stem:'解題群稱除〈師說〉、〈大同與小康〉外，其餘13篇多以字音字義入題；《cwtc評析》則稱台灣核心古文皆未出現，來源分歧待考', skill:'字音字義辨識(來源分歧)', textIds:['N31','N33','N34','N35','N36','N38','N39','N41','N42','N43','N44','N45'], sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報 vs cwtc' },

  /* ===== 114學測 ===== */
  { year:'114', qNum:'1', type:'單選題', stem:'辨識「舁、臾、啗、諂、迤、弛、畛、殄」讀音前後是否相同，引文涉及〈虯髯客傳〉、〈赤壁賦〉、〈鴻門宴〉、〈勸和論〉', skill:'字音辨識與應用', textIds:['N38','N39','N34','N43'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'15-19', type:'單選題組', stem:'改寫田曉菲《赤壁之戟》，討論杜牧〈赤壁〉、蘇軾〈赤壁賦〉與「赤壁」意象建構，並判斷〈赤壁賦〉中「客」的角色與論據適當性', skill:'文意理解、比較、分析、統整；文學作家作品體類流派知識', textIds:['N39'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'25', type:'多選題', stem:'比較各組引號內詞語意義是否相同，涉及〈大同與小康〉、〈項脊軒志〉、〈鹿港乘桴記〉、〈勸和論〉、〈諫逐客書〉、〈勞山道士〉、〈出師表〉、〈畫菊自序〉、〈虯髯客傳〉', skill:'字義辨識與應用', textIds:['N32','N40','N44','N43','N33','N42','N35','N45','N38'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'28', type:'多選題', stem:'改寫石守謙《移動的桃花源》，結合陶淵明〈桃花源記〉，判斷桃花源文字與圖繪、理想化山水形象之敘述是否適當', skill:'文意理解比較分析、文學文化詮釋鑑賞', textIds:['N36'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'29', type:'多選題', stem:'詞性、句型、文法語法結構，命題材料涉及〈出師表〉、〈項脊軒志〉、〈勞山道士〉、〈勸和論〉、〈諫逐客書〉', skill:'語法辨識與應用', textIds:['N35','N40','N42','N43','N33'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'30', type:'單選題', stem:'三則晚明西湖遊記，乙文袁宏道〈晚遊六橋待月記〉、丙文王思任〈遊杭州諸勝記〉，綜合判斷晚明文人記遊', skill:'文意理解比較分析、文學作家作品知識、內容延伸反思', textIds:['N41'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'31', type:'單選題', stem:'依〈晚遊六橋待月記〉與〈遊杭州諸勝記〉設計「跟著袁進士、王進士遊西湖」行程，判斷介紹文字是否符合兩文內容', skill:'文意理解比較、文學文化詮釋鑑賞', textIds:['N41'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'32', type:'混合題(單選)', stem:'〈虯髯客傳〉片段與以〈虯髯客傳〉、〈西遊記〉為材料之對話，討論「概念框架」', skill:'文意理解比較分析、形式推究', textIds:['N38'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'33', type:'混合題(單選)', stem:'從〈孟子·梁惠王上〉、〈畫菊自序〉、〈庖丁解牛〉、〈燭之武退秦師〉判斷哪一句表達「有其他概念框架可選擇」', skill:'文意理解比較分析、文學作家作品知識', textIds:['N45','N31'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'34', type:'混合題(手寫)', stem:'依〈虯髯客傳〉與《西遊記》「身分框架」：李靖為何對虬髯客躺臥觀張氏梳頭動怒；唐僧對孫悟空打死強盜介意之身分框架', skill:'內容延伸反思、文學作家作品知識', textIds:['N38'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'35', type:'混合題(手寫)', stem:'紅拂以「兄妹」身分框架界定與虬髯客之關係及「遽拜之」用意；東海龍王提醒孫悟空在「仙」框架下之取捨', skill:'文意理解比較、內容延伸反思、文學文化詮釋鑑賞', textIds:['N38'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },
  { year:'114', qNum:'36', type:'混合題(手寫)', stem:'虬髯客問李靖「何以致斯異人」之推測前提；舉李靖符合「真丈夫」身分框架之行為與特質', skill:'文意理解比較、內容延伸反思、文學文化詮釋', textIds:['N38'], sourceUrl:SCRIBD_114, sourceName:'scribd 114解析' },

  /* ===== 115學測 ===== */
  { year:'115', qNum:'4', type:'單選題', stem:'以韓非六項發言列表為材料，對讀〈鴻門宴〉、〈燭之武退秦師〉、〈諫逐客書〉及孟子選文，判斷各篇所指國家缺失及敘述正確性', skill:'推論研判、短時間統整四篇內容', textIds:['N34','N31','N33'], sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' },
  { year:'115', qNum:'混合題', type:'混合題', stem:'以「聽見她的聲音」為共同主題，閱讀歸有光〈項脊軒志〉、〈先妣事略〉、〈祭外姑文〉三篇，並結合李欣倫〈水面下〉及曾林阿珠訪問稿，探究女性聲音', skill:'探究精神、多重文本閱讀、統整、女性聲音判讀', textIds:['N40'], sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' },
  { year:'115', qNum:'30-31', type:'選項(推測)', stem:'列舉諸葛亮與曹操作品，呈現以「表」陳情之聲音；是否直接涉及〈出師表〉待官方核對', skill:'題號待官方逐題核對', textIds:['N35'], sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' },
];

/* 依年份分組 */
function questionsByYear(){
  const map = {};
  examYears.forEach(y => { map[y.id] = []; });
  examQuestions.forEach(q => { if(map[q.year]) map[q.year].push(q); });
  return map;
}
