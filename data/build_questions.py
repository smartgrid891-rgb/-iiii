import json, os

EXAM_URL = {
  "106": "https://www.ceec.edu.tw/files/file_pool/1/0j076534426200207059/05-106學測自然試卷定稿.pdf",
  "107": "https://student.104.com.tw/api/v1.0/file/apply/107/05-107學測自然試卷.pdf",
  "108": "https://student.104.com.tw/api/v1.0/file/apply/108/05-108學測自然試卷.pdf",
}

NODE_NAME = {
 "Ea1-1":"地球的起源與演變","Ea1-2":"探索地球的歷史",
 "Ea2-1":"地震波與地球內部分層","Ea2-2":"地表與地殼的變動","Ea2-3":"地震災害與防治",
 "Ea3-1":"大氣的結構","Ea3-2":"大氣中的水氣變化","Ea3-3":"大氣的運動與天氣系統",
 "Ea3-4":"天氣圖判讀與氣象觀測","Ea3-5":"氣象災害－颱風",
 "Ea4-1":"海洋的結構","Ea4-2":"海水的運動","Ea4-3":"大氣與海洋的交互作用",
 "Ea5-1":"從太空看地球","Ea5-2":"從地球看太空","Ea5-3":"宇宙",
 "Ea6-1":"多重時間尺度的氣候變遷","Ea6-2":"氣候變遷的環境影響",
 "Ea6-3":"人類活動與近期氣候變化","Ea6-4":"因應氣候變遷",
 "Ea7-1":"永續發展","Ea7-2":"節用資源與合理開發",
}

# fields: qid, nodeId, concept, cognitiveLevel, difficulty, hasChart, source
rows = []

# ===== 106 (source=analysis, from visionbook; qids aligned via official exam) =====
y106 = [
 ("18","Ea4-1","副熱帶海域表面鹽度極大值的成因","知識","易",False),
 ("19","Ea1-2","判斷地質材料重建環境演變的適用性","知識","易",False),
 ("20","Ea5-3","依黑體輻射判讀恆星與物體的電磁波","理解","易",True),
 ("21","Ea5-2","地球軌道形狀改變對季節溫差的影響","分析","中",False),
 ("22","Ea4-1","漂浮海冰融化對海水鹽度的影響","理解","易",False),
 ("33","Ea2-2","土石流的成因、流動與沉積特性","理解","中",False),
 ("34","Ea2-1","比較大陸地殼與海洋地殼的特性","知識","易",False),
 ("35","Ea4-3","辨識海洋與大氣交互作用影響的現象","理解","中",False),
 ("36","Ea3-4","分析數值天氣預報不確定性的來源","理解","中",False),
 ("39","Ea6-3","依能量守恆計算地表傳給大氣的熱量","分析","中",True),
 ("62","Ea3-3","判斷有助地球年度溫度平衡的能量傳送","理解","中",False),
 ("63","Ea3-2","分析石門水庫集水區的降水特性","分析","中",True),
 ("64","Ea7-2","分析降水、水位與限水措施的關聯","分析","中",True),
 ("65","Ea2-2","大理岩峽谷形成的地質與地形作用","知識","易",False),
 ("66","Ea7-2","依地下資源特性選擇地球物理探勘方法","理解","中",True),
 ("67","Ea5-1","提高無線電波望遠鏡解析度的方法","理解","中",False),
 ("68","Ea2-3","判斷斷層類型與上、下盤災害差異","知識","中偏難",True),
]
for qid,nid,concept,cog,diff,chart in y106:
    rows.append({"year":"106","qid":qid,"nodeId":nid,"nodeName":NODE_NAME[nid],
        "concept":concept,"cognitiveLevel":cog,"difficulty":diff,"hasChart":chart,
        "source":"analysis","examUrl":EXAM_URL["106"]})

# ===== 107 (source=ceec_exam; ltedu contaminated, official exam authoritative;
#       difficulty/cognitive inferred; q59 from official, q62=ltedu#15) =====
y107 = [
 ("19","Ea1-1","由月球岩石推論月球曾經歷熔融狀態","理解","易",False),
 ("20","Ea5-2","半日潮週期與隔日同時段潮位變化","應用","易",True),
 ("21","Ea4-2","波浪成因與波浪對海岸地形的作用","理解","中",False),
 ("22","Ea3-3","北半球低氣壓近地面風向逆時針旋入","應用","中",True),
 ("23","Ea3-5","颱風接近與遠離造成氣壓先降後升","分析","中偏難",True),
 ("32","Ea2-3","板塊擠壓形成逆斷層及上盤位置判定","應用","中",True),
 ("33","Ea2-2","岩漿黏滯性、火山爆發頻率與監測方法","分析","難",True),
 ("34","Ea6-2","都市地表改變對日夜溫度與氣候的影響","應用","中",False),
 ("35","Ea3-2","由氣溫與露點溫度判斷相對濕度和霧","分析","中偏難",True),
 ("38","Ea4-2","西風帶與北太平洋海流的污染傳播方向","分析","難",False),
 ("46","Ea6-3","人類活動增加的主要溫室氣體種類","知識","易",False),
 ("59","Ea5-3","由星系紅移估算光訊號傳播抵達時間","分析","中偏難",True),
 ("62","Ea7-1","水資源措施的環境經濟與社會永續性","應用","中",False),
 ("63","Ea5-3","光球亮度過強使日冕平時不易觀察","理解","易",True),
 ("64","Ea5-2","朔望月週期與二次滿月的月份限制","應用","中",False),
 ("65","Ea5-2","依恆星月週期推算月球近地點日期","應用","中偏難",False),
 ("66","Ea4-1","比較溫壓條件判斷天然氣水合物生成深度","分析","難",True),
 ("67","Ea2-1","依地球內部分層比較岩石與鐵隕石密度","理解","中",False),
 ("68","Ea2-3","依地震波到達時間與震度推論居住地","分析","難",False),
]
for qid,nid,concept,cog,diff,chart in y107:
    rows.append({"year":"107","qid":qid,"nodeId":nid,"nodeName":NODE_NAME[nid],
        "concept":concept,"cognitiveLevel":cog,"difficulty":diff,"hasChart":chart,
        "source":"ceec_exam","examUrl":EXAM_URL["107"]})

# ===== 108 (source=analysis, from visionbook; qids aligned via official exam) =====
y108 = [
 ("1","Ea5-3","太陽風帶電粒子與極光的關係","知識","易",False),
 ("2","Ea4-3","聖嬰現象的大氣與海洋變化","知識","易",False),
 ("3","Ea5-3","恆星表面溫度與星光顏色的關係","理解","中",False),
 ("4","Ea4-2","波浪接近海岸時的折射與傳播路徑","分析","中偏難",True),
 ("17","Ea3-1","低風速穩定大氣中PM2.5的沉降時間","應用","中",False),
 ("18","Ea5-2","月球公轉方向改變對潮汐的影響","應用","中",False),
 ("19","Ea4-2","海嘯浪高與溯上高度的影響因素","理解","中",False),
 ("20","Ea5-2","日月地位置、月相與月球東升時間","應用","中偏難",True),
 ("37","Ea3-5","依颱風路徑間距判斷平均速率變化","分析","中偏難",True),
 ("38","Ea3-5","颱風不同位置的風速比較","應用","中偏難",True),
 ("40","Ea3-2","雲滴大小與雲反射陽光能力的關係","應用","中偏難",True),
 ("43","Ea2-2","GPS測站速度與斷層兩側地殼變形","分析","中偏難",True),
 ("44","Ea2-2","由測站速度差與距離計算應變率","應用","中偏難",True),
 ("45","Ea2-2","依走向與傾角繪製地質剖面","分析","難",True),
 ("46","Ea7-2","背斜與斷層構造的油氣封閉條件","應用","中偏難",True),
 ("47","Ea3-2","氣團升降中的氣溫與露點變化","分析","中偏難",True),
 ("48","Ea4-1","溫度與鹽度造成的海水密度差異","分析","難",True),
 ("49","Ea4-2","地中海蒸發與海峽水量鹽度平衡","分析","中偏難",True),
]
for qid,nid,concept,cog,diff,chart in y108:
    rows.append({"year":"108","qid":qid,"nodeId":nid,"nodeName":NODE_NAME[nid],
        "concept":concept,"cognitiveLevel":cog,"difficulty":diff,"hasChart":chart,
        "source":"analysis","examUrl":EXAM_URL["108"]})

os.makedirs("/home/user/workspace/gsat-earth-science/data", exist_ok=True)
out = "/home/user/workspace/gsat-earth-science/data/questions_106_108.json"
with open(out, "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

# ---- summary ----
from collections import Counter
print("總題數:", len(rows))
for y in ["106","107","108"]:
    ys = [r for r in rows if r["year"]==y]
    print(f"\n=== {y} 學年度: {len(ys)} 題 ===")
    nc = Counter(r["nodeId"] for r in ys)
    for nid in sorted(nc):
        qs = ",".join(r["qid"] for r in ys if r["nodeId"]==nid)
        print(f"  {nid} {NODE_NAME[nid]}: {nc[nid]} 題 (題號 {qs})")
    # qid cleanliness
    clean = all(r["qid"].isdigit() for r in ys)
    print(f"  題號乾淨(純數字): {clean}")
    print(f"  含圖表題數: {sum(1 for r in ys if r['hasChart'])}")
    print(f"  認知層次分布: {dict(Counter(r['cognitiveLevel'] for r in ys))}")
    print(f"  難易度分布: {dict(Counter(r['difficulty'] for r in ys))}")
    print(f"  資料來源: {dict(Counter(r['source'] for r in ys))}")
print("\n已寫入:", out)
