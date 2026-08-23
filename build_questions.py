#!/usr/bin/env python3
# 組裝 109-112 學測地科試題結構化資料
# 題號：以官方大考中心試卷題號為準（110-112 分析PDF題號為私人區碼亂碼，經主題對應至官方題號）
# 難易度/題型：取自 visionbook 分析PDF 雙向細目表
# 認知層次：依題型推斷（基本題→理解/知識；素養圖表判斷/邏輯推論/閱讀理解→分析；素養情境題/運算→應用）
# nodeId：依主題對應 108 課綱節點

# 認知層次推斷規則（依分析PDF題型欄）
def cog_from_type(topic, concept, dtype, diff):
    t = (topic + concept + dtype)
    if '基本題' in dtype:
        if any(k in t for k in ['定年','歷史','週期','類型','結構','分類','條件','基本','定律','單位','物質波','量子']):
            return '知識'
        return '理解'
    if '情境題' in dtype or '基本運算' in dtype or '單位因次' in dtype:
        return '應用'
    if '圖表判斷' in dtype or '邏輯推論' in dtype or '閱讀理解' in dtype or '圖形判斷' in dtype or '分析' in dtype:
        return '分析'
    if '素養' in dtype:
        return '應用'
    return '理解'

# node 主題對應
def node_of(topic, concept):
    s = topic + concept
    if any(k in s for k in ['海嘯','洋流','潮汐','波浪','湧浪','黑潮','溫鹽','海流','海面高度']):
        if '聖嬰' in s or '湧升' in s or '海氣' in s:
            return ('Ea4-3','大氣與海洋的交互作用')
        return ('Ea4-2','海水的運動')
    if any(k in s for k in ['聲速','海水溫度','海水組成','水圈','海洋的結構','鹽度','海水鹽度']):
        return ('Ea4-1','海洋的結構')
    if any(k in s for k in ['颱風','熱帶氣旋','西北颱','共伴']):
        return ('Ea3-5','氣象災害－颱風')
    if any(k in s for k in ['天氣圖','數值預報','大氣模式','解析度','氣象觀測']):
        return ('Ea3-4','天氣圖判讀與氣象觀測')
    if any(k in s for k in ['氣壓','風','氣團','鋒面','氣旋','季風','環流','白貝羅','輻散','高壓','下沉']):
        if '臭氧' in s or '光化學' in s or '污染' in s or '煙霧' in s:
            return ('Ea3-3','大氣的運動與天氣系統')
        return ('Ea3-3','大氣的運動與天氣系統')
    if any(k in s for k in ['濕度','露點','水氣','凝結','潛熱','雲','降水','降雨','相變','三相','凝華']):
        return ('Ea3-2','大氣中的水氣變化')
    if any(k in s for k in ['大氣的結構','氣壓計','高度','垂直','對流層','平流層','大氣穩定','穩定度','溫度垂直','遞減率','氣溫']):
        if '水氣' in s or '濕度' in s or '露點' in s or '潛熱' in s or '相變' in s:
            return ('Ea3-2','大氣中的水氣變化')
        if '穩定' in s or '對流' in s or '雲層' in s:
            return ('Ea3-2','大氣中的水氣變化')
        return ('Ea3-1','大氣的結構')
    if any(k in s for k in ['天球','星座','周日','周年','視運動','星跡','月相','日月食','黃道','太陽視','恆星日','潮汐與日地月']):
        return ('Ea5-2','從地球看太空')
    if any(k in s for k in ['遙測','太空望遠','電磁波','大氣窗','觀測','電波天文','海洋遙測']):
        if '電波' in s or '望遠鏡' in s:
            return ('Ea5-3','宇宙')
        return ('Ea5-1','從太空看地球')
    if any(k in s for k in ['恆星','星等','光譜','亮度','顏色','太陽黑子','宇宙','行星','星系','天體距離','紅移','絕對星等','火星','隕石','太空探測','轉移軌道']):
        return ('Ea5-3','宇宙')
    if any(k in s for k in ['地震波','震央','走時','P波','S波','不連續','內部分層']):
        return ('Ea2-3','地震災害與防治')
    if any(k in s for k in ['地震','規模','震度','土壤液化','斷層','震源','預警']):
        return ('Ea2-3','地震災害與防治')
    if any(k in s for k in ['板塊','大陸漂移','海底擴張','隱沒','地質構造','地層','岩層','走向','傾斜','煤層','山崩','沉積','海蝕','海階','變質']):
        return ('Ea2-2','地表與地殼的變動')
    if any(k in s for k in ['定年','相對地質年代','絕對地質年代','標準化石','疊置','截切','地質年代','碳-14','碳14','放射性定年','岩心']):
        return ('Ea1-2','探索地球的歷史')
    if any(k in s for k in ['起源','太陽系結構','地球形成','適居','氧氣演化','行星形成','宇宙演化']):
        return ('Ea1-1','地球的起源與演變')
    if any(k in s for k in ['冰期','間冰期','米蘭科','古氣候','海水面','多重時間']):
        return ('Ea6-1','多重時間尺度的氣候變遷')
    if any(k in s for k in ['全球暖化','極端氣候','海平面上升','海洋酸化','氣候變遷之影響','氣候變化','溫度機率','近期氣候']):
        return ('Ea6-2','氣候變遷的環境影響')
    if any(k in s for k in ['溫室氣體','溫室效應','碳循環','人為排放','化石燃料','黑碳','二氧化碳','鉛同位素','工業革命']):
        return ('Ea6-3','人類活動與近期氣候變化')
    if any(k in s for k in ['再生能源','風光電','COP','巴黎','減緩','調適','SDG','永續','水力發電','能源']):
        return ('Ea7-1','永續發展')
    if any(k in s for k in ['礦物','水資源','地下水','探勘','資源']):
        return ('Ea7-2','節用資源與合理開發')
    return ('Ea5-3','宇宙')

records = []

# ============ 109 年（分析PDF題號乾淨，與官方一致）15題 ============
y109 = [
    ("18","大氣：氣壓與溫度垂直變化","由水銀氣壓計高度差判斷山頂氣壓與山高，並依溫度遞減率估算山頂氣溫","應用","易",True,"analysis"),
    ("19-20","海洋：海嘯","由海嘯抵達各地的延時圖判讀臺灣東岸抵達時間，並由距離與時間推知海嘯行進速度","分析","易",True,"analysis"),
    ("21","地質：板塊構造與地震分布","由臺灣周遭震源深度分布推論菲律賓海板塊與歐亞板塊的隱沒關係","分析","中",True,"analysis"),
    ("22","地質：山崩","判斷板塊運動、含水量、節理、坡度及岩層傾向對臺灣山崩發生的影響","理解","易",False,"analysis"),
    ("23","地質：地震","理解地震規模、地震波、震源定位、震度與土壤液化等地震相關概念","理解","易",False,"analysis"),
    ("33","天文：太陽黑子","判斷太陽黑子的觀測安全方式、磁場與太陽活動，以及黑子數目的約十一年週期","知識","難",False,"analysis"),
    ("34","天文：星際塵埃與星等","判斷星際塵埃造成的消光及其對觀測星等與天體距離的影響","理解","中",False,"analysis"),
    ("35","大氣：颱風","判斷颱風的性質、形成條件、路徑主要受力及氣壓垂直分布","知識","中",False,"analysis"),
    ("62","天文：天體距離尺度","依天體與地球的距離尺度排列銀河系內外的天體與星系團","理解","中",False,"analysis"),
    ("63","大氣：空氣塊溫度與露點溫度","依未飽和與飽和空氣塊的溫度直減率，判斷空氣塊上升後的氣溫與露點溫度","應用","中",False,"analysis"),
    ("64","大氣：大氣模式解析度","依大氣模式的水平解析尺度判斷其適用於鋒面等不同空間尺度的大氣現象","應用","中",False,"analysis"),
    ("65","海洋：海水聲速","由海水溫度與壓力的垂直變化判斷兩者對海水聲速的影響","理解","中",True,"analysis"),
    ("66","地質：地層與火成岩相對年代","依疊置定律、截切關係與地層拱起判斷岩層及火成岩體的生成順序","分析","難",True,"analysis"),
    ("67","氣候變遷與永續發展：石油與環境","判斷石油燃燒、臭氧層破壞、海洋酸化及海洋塑膠污染等敘述的正誤","分析","中",False,"analysis"),
    ("68","天文：電波天文學與恆星日","由不明電波每隔二十三小時五十六分出現最大值，推論其與地球自轉及宇宙方向的關係","分析","難",False,"analysis"),
]
for qid,topic,concept,cog,diff,chart,src in y109:
    nid,nname = node_of(topic,concept)
    records.append({"year":"109","qid":qid,"nodeId":nid,"nodeName":nname,"concept":concept,
                    "topic":topic,"cognitiveLevel":cog,"difficulty":diff,"hasChart":chart,
                    "source":src,"examUrl":"https://student.104.com.tw/api/v1.0/file/apply/109/05-109%E5%AD%B8%E6%B8%AC%E8%87%AA%E7%84%B6%E8%A9%A6%E5%8D%B7.pdf"})

# ============ 110 年（分析PDF題號亂碼，經主題對應至官方題號）============
# 雙向細目表12題（屬108課綱）+ 6題官方辨識（屬99課綱特有，分析PDF未列）
y110 = [
    # qid(官方), topic, concept, 難易度, 題型, hasChart, source
    ("16","地震波走時曲線、震央測距","利用P波與S波到達時間差，判斷震源與測站距離","中","素養導向：圖表判斷",True,"analysis"),
    ("17","海洋的結構","根據溫度、鹽度與壓力隨海水深度的變化，判斷聲速剖面的趨勢","中","素養導向：圖表判斷",True,"analysis"),
    ("18","地球的歷史、相對與絕對地質年代","辨識疊置定律、截切定律、均變說與放射性定年等地球歷史研究方法","易","基本題",False,"analysis"),
    ("19","大氣的運動","判斷地表摩擦力對風向與白貝羅定律適用性的影響","中","素養導向：邏輯推論",False,"analysis"),
    ("20","從地球觀察恆星視運動","由北極星仰角判斷觀測地點的緯度","易","基本題",False,"analysis"),
    ("21","侵臺颱風的路徑與風雨影響","依颱風路徑、時間與迎風面位置，判斷臺灣各地降雨分布的先後","中","素養導向：邏輯推論",True,"analysis"),
    ("22","潮汐的變化與潮間帶之關係","綜合潮汐時間、太陽位置與山脈遮蔽，選擇適合潮間帶調查的時段","中","素養導向：圖表判斷",True,"analysis"),
    ("35","全球近期氣候變化","根據長期降雨量、降雨時數與降雨強度資料，判斷豐水年和枯水年的變化","中","素養導向：邏輯推論",True,"analysis"),
    ("36","海水的運動","辨識表面洋流與溫鹽環流的主要生成原因","易","基本題",False,"analysis"),
    ("63","天體的亮度與光度對距離的影響","利用視星等與絕對星等的關係比較恆星距離","難","素養導向：邏輯推論",True,"analysis"),
    ("65","海水的運動、海洋遙測","由海面高度梯度與海流速度判斷南太平洋海面高度等高線分布","中","素養導向：閱讀理解、圖表判斷、邏輯推論",True,"analysis"),
    ("66","恆星的表面溫度、天文觀測","比較紅、藍色濾光影像以判斷恆星表面溫度","難","素養導向：閱讀理解",False,"analysis"),
    # 6題官方辨識（分析PDF雙向細目表未列，屬99課綱特有單元）
    ("12","宇宙演化","排列宇宙由粒子、氦原子形成至恆星開始形成的先後順序","中","素養導向：閱讀理解",False,"exam"),
    ("56","行星與太空探測","依地球與火星公轉週期及橢圓轉移軌道，估算太空船抵達火星所需時間","中","素養導向：閱讀理解",True,"exam"),
    ("62","地質構造與地層","根據煤層走向、傾向、傾角及地形，判斷挖掘方向以找到煤層","中","素養導向：圖表判斷",True,"exam"),
    ("64","恆星與光譜","依恆星光譜型判斷其表面溫度最高者","中","素養導向：圖表判斷",True,"exam"),
    ("67","沉積岩與沉積環境","依頁岩、砂岩與礫岩的垂直層序，判斷沉積環境水深與水流速度的變化","中","素養導向：邏輯推論",False,"exam"),
    ("68","大氣穩定度與雲層","由兩天大氣溫度垂直分布及相同水氣含量，判斷大氣穩定度、對流、雲層發展與空氣污染","中","素養導向：圖表判斷",True,"exam"),
]
for qid,topic,concept,diff,dtype,chart,src in y110:
    cog = cog_from_type(topic,concept,dtype,diff)
    nid,nname = node_of(topic,concept)
    records.append({"year":"110","qid":qid,"nodeId":nid,"nodeName":nname,"concept":concept,
                    "topic":topic,"cognitiveLevel":cog,"difficulty":diff,"hasChart":chart,
                    "source":src,"examUrl":"https://go100.com.tw/file/exam/S110-GSAT/110GSAT_Nature.pdf"})

# ============ 111 年（分析PDF題號亂碼，經主題對應至官方題號）13筆組題 ============
y111 = [
    # qid(官方組題), topic, concept, 難易度, 題型, hasChart, source
    ("1-2","颱風路徑與大氣運動","由颱風預測路徑判斷移動速率、速度方向與合力關係","中","素養導向：圖表判斷",True,"analysis"),
    ("7-8","氣候系統與溫室效應","分析地球氣候系統的輻射收支、向外熱輻射與二氧化碳增加造成的溫度變化","中","素養導向：圖表判斷",True,"analysis"),
    ("28-29","火星與行星地質","判斷火星的行星分類、表面流水痕跡，以及隕石坑、風成沙丘與三角洲的地貌形成先後","中","素養導向：圖表判斷",True,"analysis"),
    ("30","星跡與地理緯度","由面向東方拍攝的長時間曝光星跡判斷觀測地點所在半球與緯度","易","素養導向：圖表判斷",True,"analysis"),
    ("31","天體顏色與物理性質","利用恆星與行星的顏色比較天體表面溫度及發光能力","中","基本題",False,"analysis"),
    ("32","水循環與相變潛熱","判斷凝結、凝固、融化與昇華等水相變化所伴隨的潛熱釋放或吸收","易","基本題",False,"analysis"),
    ("33","天球與太陽周年視運動","依據黃道與天球赤道的關係判斷北半球由春分至冬至的太陽視運動順序","中","素養導向：圖表判斷",True,"analysis"),
    ("34","東亞天氣系統與衛星雲圖","由東亞衛星雲圖判斷天氣系統類型、氣團交會及臺灣地區可能受到的天氣影響","中","素養導向：圖表判斷",True,"analysis"),
    ("35-36","黑潮與沿岸海洋環境","利用日本鰻幼魚漂游路徑、黑潮流速與水體鹽度分析海流分布及河海水混合比例","中","素養導向：圖表判斷",False,"analysis"),
    ("39","黑碳與氣候變遷","評估大氣黑碳對地球氣溫影響時所需蒐集的黑碳總量與太陽輻射吸收資料","中","素養導向：閱讀理解",False,"analysis"),
    ("40","黑碳與冰雪消融","判斷黑碳沉降於極區冰川表面對冰雪消融速率的影響","易","基本題",False,"analysis"),
    ("42","全球碳循環與氣候調節","分析火山、植物作用、化石燃料使用與大氣二氧化碳之間的碳循環關係","中","基本題",False,"analysis"),
    ("43-45","海階、海蝕地形與地震抬升","探討海蝕凹壁與海階的形成作用、碳十四定年，以及間歇性地震抬升造成的高程變化與平均抬升速率","難","素養導向：圖表判斷",True,"analysis"),
]
for qid,topic,concept,diff,dtype,chart,src in y111:
    cog = cog_from_type(topic,concept,dtype,diff)
    nid,nname = node_of(topic,concept)
    records.append({"year":"111","qid":qid,"nodeId":nid,"nodeName":nname,"concept":concept,
                    "topic":topic,"cognitiveLevel":cog,"difficulty":diff,"hasChart":chart,
                    "source":src,"examUrl":"https://go100.com.tw/file/exam/S111-GSAT/111GSAT_Nature.pdf"})

# ============ 112 年（分析PDF題號亂碼，經主題對應至官方題號）15題 ============
y112 = [
    ("1","氣象災害、颱風、西北颱","依颱風中心通過前後的位置與逆時針旋轉特性判斷基隆及彭佳嶼的風向變化","易","基本題",False,"analysis"),
    ("2","氣候變遷之影響與調適、極端氣候","比較現今與未來氣候的溫度機率分布，判斷平均溫度、極端低溫與高溫事件及作物適應機率的變化","中","素養導向：圖表判斷",True,"analysis"),
    ("3","地球的起源、太陽系行星形成","利用隕石的元素同位素比例與火星特徵進行來源判定","難","素養導向：閱讀理解",False,"analysis"),
    ("4","海水的運動、波浪成因、瘋狗浪","由風浪、湧浪、碎浪、暴潮與海嘯的特性判斷瘋狗浪的成因","中","基本題",False,"analysis"),
    ("5","海水的運動、潮汐","判讀不同測站潮汐週期、乾潮時間與潮差的圖表資料","中","素養導向：圖表判斷",True,"analysis"),
    ("6","飽和水氣量、乾溼球溫度計、相對濕度","由乾球與濕球溫度判斷飽和狀態、相對濕度及實際水氣含量的關係","易","基本題",False,"analysis"),
    ("7","大氣中的水氣變化、降雨量","由各月份降雨量、降雨日數與平均日降雨量資料進行比較與計算","中","素養導向：圖表判斷",True,"analysis"),
    ("8","海洋的結構","由降雨量、蒸發量及大氣環流狀態判斷海水鹽度的變化","易","基本題",False,"analysis"),
    ("9","地表與地殼的變動、環太平洋地震帶","判斷環太平洋地震帶的板塊邊界類型、隱沒作用、地震深度分布與斷層型態","易","基本題",False,"analysis"),
    ("41","行星、火星環境與太空移民","比較火星與地球的距離、質量、表面重力、大氣壓力及液態水存在條件","中","素養導向：圖表判斷",True,"analysis"),
    ("42","恆星的表面溫度與顏色","由恆星表面溫度判斷其顏色，並比較在地球與火星觀測時的顏色","中","素養導向：圖表判斷",True,"analysis"),
    ("43","火星自轉軸傾角與季節","比較火星與地球的自轉軸傾角、季節長度、太陽潮汐力、太陽仰角及抵禦太陽風的能力","中","素養導向：圖表判斷",True,"analysis"),
    ("44","絕對星等與觀測者位置","判斷從火星與地球觀察織女星所得絕對星等是否相同，說明絕對星等由恆星本身亮度定義","中","素養導向：圖表判斷",True,"analysis"),
    ("53","環境污染與鉛同位素示蹤","由湖泊岩心鉛濃度及鉛-206與鉛-207同位素比例的變化，推論不同化石燃料使用對環境的影響","中","素養導向：圖表判斷",True,"analysis"),
    ("54","工業革命與化石燃料使用歷史","根據岩心鉛濃度及鉛同位素比例隨年代的變化，推論蒸汽機運輸開始大量使用煤作為燃料的時間","中","素養導向：圖表判斷",True,"analysis"),
]
for qid,topic,concept,diff,dtype,chart,src in y112:
    cog = cog_from_type(topic,concept,dtype,diff)
    nid,nname = node_of(topic,concept)
    records.append({"year":"112","qid":qid,"nodeId":nid,"nodeName":nname,"concept":concept,
                    "topic":topic,"cognitiveLevel":cog,"difficulty":diff,"hasChart":chart,
                    "source":src,"examUrl":"https://img.ltn.com.tw/Upload/features/GSAT/2023/pdf/112-naturalscience-1.pdf"})

import json, os
out = "/home/user/workspace/gsat-earth-science/data/questions_109_112.json"
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out,"w",encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

# 報告
from collections import Counter, defaultdict
print("總題數:", len(records))
by_year = Counter(r["year"] for r in records)
print("各年題數:", dict(sorted(by_year.items())))
print("\n各年題號:")
for y in ["109","110","111","112"]:
    qs = [r["qid"] for r in records if r["year"]==y]
    print(f"  {y}: {qs}")
print("\n各節點題數分布:")
node_cnt = Counter(r["nodeId"] for r in records)
for nid in sorted(node_cnt):
    print(f"  {nid} {node_cnt[nid]}")
print("\n認知層次分布:", dict(Counter(r["cognitiveLevel"] for r in records)))
print("難易度分布:", dict(Counter(r["difficulty"] for r in records)))
print("含圖表題數:", sum(r["hasChart"] for r in records))
