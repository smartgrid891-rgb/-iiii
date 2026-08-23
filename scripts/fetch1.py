import pplx_sdk, json, sys

urls = [
    "https://tcloud2.sanmin.com.tw/DocUploads/Earth/113學測地科解析PDF.pdf",
    "https://tcloud2.sanmin.com.tw/DocUploads/Earth/%E3%80%90%E4%B8%89%E6%B0%91%E6%9B%B8%E5%B1%80%E3%80%91114%E5%AD%B8%E5%B9%B4%E5%BA%A6%E5%AD%B8%E6%B8%AC%E5%9C%B0%E7%A7%91%E8%A9%A6%E9%A1%8C%E8%A7%A3%E6%9E%90.pdf",
    "https://www.ceec.edu.tw/files/file_pool/1/0q054346117821958325/06-115學測自然試卷.pdf",
]

prompt = (
    "這是一份學測自然考科地球科學試題解析或官方試卷。請逐題列出所有『地球科學』題目（不要物理、化學、生物題）。"
    "對每道地科題目輸出一行，格式：題號 | 主題 | 概念摘要（一行，勿照錄完整題幹） | 認知層次（知識/理解/應用/分析） | 難易度（易/中/難） | 是否含圖表（是/否）。"
    "若是官方試卷，請依據題目內容判斷是否為地科題。題號請用實際題號（如28、51等）。若為非選題請標註。"
    "若頁面無法讀取或為空，請說明。"
)

results = pplx_sdk.content.fetch(urls, prompt=prompt, cache_enabled=False)
out = []
for r in results:
    rec = {k: getattr(r, k, None) for k in ["url","title","error","content"]}
    out.append(rec)

with open("/home/user/workspace/gsat-earth-science/data/fetch_raw.json","w",encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

for r in results:
    print("="*80)
    print("URL:", r.url)
    print("ERROR:", getattr(r,"error",None))
    print("CONTENT:")
    print(getattr(r,"content",None))
