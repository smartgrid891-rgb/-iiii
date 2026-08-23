/* ====================================================================
   學測國文 — 五年命題矩陣資料（111–115 學測）
   範圍：108課綱部定十五篇核心古文（N31–N45）
   證據強度：direct=直接引文/題組；option=選項/字音字義層級；
            disputed=來源分歧待考；none=未見該年入題
   注意：nodeId 對應為「本站考點分類」，非大考中心官方分類。
   ==================================================================== */

const examYears = [
  { id:'111', label:'111學測', year:'2022', srcName:'國文教師評析(cwtc)＋歷屆矩陣', srcUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF' },
  { id:'112', label:'112學測', year:'2023', srcName:'112試題分析(vocus)＋未來親子', srcUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5' },
  { id:'113', label:'113學測', year:'2024', srcName:'聯合報解題團＋未來親子', srcUrl:'https://udn.com/news/story/123858/7724250' },
  { id:'114', label:'114學測', year:'2025', srcName:'114試題解析＋大考中心官方試題', srcUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90' },
  { id:'115', label:'115學測', year:'2026', srcName:'國語文學科中心＋大考中心官方試卷', srcUrl:'https://cerclearning.tp.edu.tw/news/datapage/115' }
];

/* 每筆：nodeId / 年 / 強度 / 題號 / 題型 / 命題舉證 / 來源 */
const examMatrix = [
  /* ===== 111學測 ===== */
  { nodeId:'N42', year:'111', level:'direct', q:'第20-22題組', type:'閱讀題組', evidence:'直接引文，〈勞山道士〉為十五古文唯二直接取材之一（與畫菊自序合計6題）', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N45', year:'111', level:'direct', q:'題組(6題)', type:'閱讀題組/對讀', evidence:'〈畫菊自序〉與呂碧城〈女界近況雜談〉對讀，為唯二直接引文之一', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N43', year:'111', level:'direct', q:'第20-22題', type:'閱讀題組', evidence:'鄭用錫〈勸和論〉作者於題組中為配角，1題', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N38', year:'111', level:'option', q:'第24題', type:'選項/人物', evidence:'題幹出現〈虯髯客傳〉中的楊素', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N33', year:'111', level:'option', q:'第26題', type:'字義比較', evidence:'字義題，〈諫逐客書〉與項脊軒志、鹿港乘桴記、鴻門宴等並列比較', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N34', year:'111', level:'option', q:'第26題', type:'字義比較', evidence:'字義題，〈鴻門宴〉與項脊軒志、鹿港乘桴記、諫逐客書等並列比較', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N40', year:'111', level:'option', q:'第26題', type:'字義比較', evidence:'字義題，〈項脊軒志〉與鹿港乘桴記、諫逐客書、鴻門宴等並列比較', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N44', year:'111', level:'option', q:'第26題', type:'字義比較', evidence:'字義題，〈鹿港乘桴記〉與項脊軒志、諫逐客書、鴻門宴等並列比較', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=346C044B3AC94022F47DC2AF9C5D33FF', sourceName:'cwtc評析' },
  { nodeId:'N31', year:'111', level:'unverified', q:'未明', type:'待查', evidence:'歷屆矩陣標示111學測曾出，惟未見題號舉證', sourceUrl:'https://tw.amazingtalker.com/blog/zh-tw/k12/74304/', sourceName:'amazingtalker矩陣' },
  { nodeId:'N32', year:'111', level:'unverified', q:'未明', type:'待查', evidence:'歷屆矩陣標示111學測曾出，惟未見題號舉證', sourceUrl:'https://tw.amazingtalker.com/blog/zh-tw/k12/74304/', sourceName:'amazingtalker矩陣' },

  /* ===== 112學測 ===== */
  { nodeId:'N31', year:'112', level:'direct', q:'單選第5題', type:'對讀/閱讀理解', evidence:'〈燭之武退秦師〉與〈鴻門宴〉進行對讀', sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { nodeId:'N34', year:'112', level:'direct', q:'單選第5題', type:'對讀/閱讀理解', evidence:'〈鴻門宴〉與〈燭之武退秦師〉進行對讀', sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { nodeId:'N39', year:'112', level:'direct', q:'混合題第35題', type:'混合題', evidence:'明代雜劇《赤壁遊》為〈赤壁賦〉的改編作品', sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { nodeId:'N38', year:'112', level:'option', q:'單選第1題', type:'字音', evidence:'「吁嗟而去」出自〈虯髯客傳〉', sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { nodeId:'N42', year:'112', level:'option', q:'單選第1題', type:'字音', evidence:'「驀然而踣」出自〈勞山道士〉', sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { nodeId:'N43', year:'112', level:'option', q:'單選第1題', type:'字音', evidence:'「釁起鬩牆」出自〈勸和論〉', sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },
  { nodeId:'N45', year:'112', level:'option', q:'單選第1題', type:'字音', evidence:'「胡笳之拍」出自〈畫菊自序〉', sourceUrl:'https://vocus.cc/article/63dcb8ecfd89780001508db5', sourceName:'vocus 112分析' },

  /* ===== 113學測 ===== */
  { nodeId:'N40', year:'113', level:'direct', q:'第29題', type:'混合題', evidence:'以硃砂科普知識連結〈項脊軒志〉與《天工開物》', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N31', year:'113', level:'option', q:'未逐條', type:'字義/讀音', evidence:'15篇除師說、大同與小康外13篇均入題，多為單選選項', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N33', year:'113', level:'disputed', q:'未逐條', type:'字義/讀音(分歧)', evidence:'聯合報/未來親子稱13篇均入題；cwtc評析9篇未含諫逐客書，分歧待考', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報 vs cwtc' },
  { nodeId:'N34', year:'113', level:'option', q:'未逐條', type:'字義/讀音', evidence:'13篇均入題之一', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N35', year:'113', level:'option', q:'未逐條', type:'字義/讀音', evidence:'13篇均入題之一', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N36', year:'113', level:'option', q:'未逐條', type:'字義/讀音', evidence:'13篇均入題之一', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N38', year:'113', level:'option', q:'未逐條', type:'字義/讀音', evidence:'13篇均入題之一', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N39', year:'113', level:'option', q:'未逐條', type:'字義/讀音', evidence:'13篇均入題之一', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N41', year:'113', level:'disputed', q:'未逐條', type:'字義/讀音(分歧)', evidence:'聯合報/未來親子稱13篇均入題；cwtc評析9篇未含晚遊六橋待月記，分歧待考', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報 vs cwtc' },
  { nodeId:'N42', year:'113', level:'option', q:'未逐條', type:'字義/讀音', evidence:'13篇均入題之一', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報解題團' },
  { nodeId:'N37', year:'113', level:'disputed', q:'未逐條', type:'字義/讀音(分歧)', evidence:'cwtc評析9篇含師說；聯合報/未來親子稱師說未入題，分歧待考', sourceUrl:'https://www.cwtc.org.tw/NewsContent.aspx?Key=6A9F431D16ACEA2B2B669D62E3389FF5', sourceName:'cwtc vs 聯合報' },
  { nodeId:'N43', year:'113', level:'disputed', q:'未逐條', type:'字義/讀音(分歧)', evidence:'聯合報/未來親子稱13篇均入題；cwtc則稱台灣核心古文皆未出現，分歧待考', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報 vs cwtc' },
  { nodeId:'N44', year:'113', level:'disputed', q:'未逐條', type:'字義/讀音(分歧)', evidence:'聯合報/未來親子稱13篇均入題；cwtc則稱台灣核心古文皆未出現，分歧待考', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報 vs cwtc' },
  { nodeId:'N45', year:'113', level:'disputed', q:'未逐條', type:'字義/讀音(分歧)', evidence:'聯合報/未來親子稱13篇均入題；cwtc則稱台灣核心古文皆未出現，分歧待考', sourceUrl:'https://udn.com/news/story/123858/7724250', sourceName:'聯合報 vs cwtc' },

  /* ===== 114學測 ===== */
  { nodeId:'N36', year:'114', level:'direct', q:'第28題', type:'閱讀題組', evidence:'結合「桃花源」文本與圖象，展示意象形塑與東亞傳布', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N38', year:'114', level:'direct', q:'題組', type:'閱讀題組', evidence:'〈虯髯客傳〉以閱讀測驗題組出現，測文意理解與比較分析', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N39', year:'114', level:'direct', q:'第17-18題', type:'閱讀題組', evidence:'蘇軾〈赤壁賦〉以閱讀題組出現', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N41', year:'114', level:'direct', q:'第30-31題', type:'閱讀題組', evidence:'〈晚遊六橋待月記〉以閱讀題組出現', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N31', year:'114', level:'option', q:'未逐條', type:'字義/讀音', evidence:'除師說外14篇均入題之一', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N32', year:'114', level:'option', q:'第23-24題區', type:'字義/讀音', evidence:'《禮記‧大同與小康》入題', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N33', year:'114', level:'option', q:'第29題區', type:'字義/讀音', evidence:'〈諫逐客書〉入題（第29題區）', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N34', year:'114', level:'option', q:'第1題區', type:'字義/讀音', evidence:'〈鴻門宴〉入題（第1題區）', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N35', year:'114', level:'option', q:'第29題區', type:'字義/讀音', evidence:'〈出師表〉入題（第29題區）', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N40', year:'114', level:'option', q:'第29題區', type:'字義/讀音', evidence:'〈項脊軒志〉入題（第29題區）', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N42', year:'114', level:'option', q:'第29題區', type:'字義/讀音', evidence:'〈勞山道士〉入題（第29題區）', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N43', year:'114', level:'option', q:'第1,29題區', type:'字義/讀音', evidence:'〈勸和論〉入題（第1題與第29題區）', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N44', year:'114', level:'option', q:'第1題區', type:'字義/讀音', evidence:'〈鹿港乘桴記〉入題（第1題區）', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },
  { nodeId:'N45', year:'114', level:'option', q:'未逐條', type:'字義/讀音', evidence:'除師說外14篇均入題之一', sourceUrl:'https://www.scribd.com/document/902835994/114%E5%AD%B8%E7%A7%91%E8%83%BD%E5%8A%9B%E6%B8%AC%E9%A9%97%E5%9C%8B%E6%96%87%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90', sourceName:'scribd 114解析' },

  /* ===== 115學測 ===== */
  { nodeId:'N31', year:'115', level:'direct', q:'第4題', type:'對讀/推論研判', evidence:'以韓非六項發言列表，對讀鴻門宴、燭之武退秦師、諫逐客書及孟子選文', sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' },
  { nodeId:'N33', year:'115', level:'direct', q:'第4題', type:'對讀/推論研判', evidence:'第4題三篇對讀之一（與鴻門宴、燭之武退秦師、孟子）', sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' },
  { nodeId:'N34', year:'115', level:'direct', q:'第4題', type:'對讀/推論研判', evidence:'第4題三篇對讀之一', sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' },
  { nodeId:'N40', year:'115', level:'direct', q:'混合題', type:'混合題/多重文本', evidence:'混合題「聽見她的聲音」列〈項脊軒志〉為多重文本素材，與先妣事略等探究女性聲音', sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' },
  { nodeId:'N35', year:'115', level:'unverified', q:'第30-31題', type:'選項/作品引用(推測)', evidence:'列舉諸葛亮與曹操作品，呈現以「表」陳情；是否直接涉出師表待官方核對', sourceUrl:'https://cerclearning.tp.edu.tw/news/datapage/115', sourceName:'cerclearning' }
];

/* 由 examMatrix 推導每個 15 古文節點的五年出現次數（不含 disputed？這裡含 disputed 視為有出） */
function examFreqForNode(nodeId) {
  // 只計「確認入題」的唯一年份（direct/option），disputed/unverified 不計入頻次
  const yrs = new Set(examMatrix.filter(e => e.nodeId === nodeId && (e.level === 'direct' || e.level === 'option')).map(e => e.year));
  return yrs.size;
}
/* 待考（disputed/unverified）年份數，供UI顯示「X + Y待考」 */
function examPendingForNode(nodeId) {
  return new Set(examMatrix.filter(e => e.nodeId === nodeId && (e.level === 'disputed' || e.level === 'unverified')).map(e => e.year)).size;
}
