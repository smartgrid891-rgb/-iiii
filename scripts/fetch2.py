import pplx_sdk, json

urls = [
    "https://www.ceec.edu.tw/files/file_pool/1/0o051419133380092609/06-113學測自然試題定稿.pdf",
    "https://www.ceec.edu.tw/files/file_pool/1/0P036405762283063557/114學測自然試題.pdf",
    "https://www.ceec.edu.tw/files/file_pool/1/0q054346117821958325/06-115學測自然試卷.pdf",
]

prompt = (
    "這是一份學測自然考科官方試卷，含物理、化學、生物、地球科學四科。請逐題判斷哪些是『地球科學』題目（依題目內容判斷，"
    "地震、板塊、地質、岩石、礦物、大氣、天氣、颱風、濕度露點、海洋、潮汐、洋流、聖嬰、天文、星空、日月食、星等、"
    "太陽系天體、電磁波與大氣窗、氣候變遷、米蘭科維奇、溫室效應、能源資源等屬地科）。"
    "對每道地科題目輸出：題號 | 主題領域 | 概念摘要（一行，勿照錄完整題幹或選項） | 認知層次（知識/理解/應用/分析擇一） | 難易度（易/中/難擇一） | 是否含圖表（是/否）。"
    "題號請用試卷上實際題號；非選題請在題號後標註（非選）。"
    "若某題同時涉及地科與其他科，仍視為地科題並標註。每題一行。若無地科題請說明。"
)

results = pplx_sdk.content.fetch(urls, prompt=prompt, cache_enabled=False)
out = []
for r in results:
    rec = {k: getattr(r, k, None) for k in ["url","title","error","content"]}
    out.append(rec)
with open("/home/user/workspace/gsat-earth-science/data/fetch_official.json","w",encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

for r in results:
    print("="*90)
    print("URL:", r.url)
    print("ERROR:", getattr(r,"error",None))
    print("CONTENT:")
    print(getattr(r,"content",None))
