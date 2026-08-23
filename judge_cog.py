import json, pplx_sdk

with open("/home/user/workspace/gsat-earth-science/data/questions_109_112.json",encoding="utf-8") as f:
    records = json.load(f)

# 對110-112（source非analysis或認知層次來自題型推斷）的題目，用LLM重新判斷認知層次
# 109年LLM已給認知層次，保留
items = []
idx_map = []
for i,r in enumerate(records):
    if r["year"]=="109":
        continue
    idx_map.append(i)
    items.append(json.dumps({"qid":r["qid"],"topic":r["topic"],"concept":r["concept"],"difficulty":r["difficulty"],"hasChart":r["hasChart"]},ensure_ascii=False))

SCHEMA = {
    "type":"object",
    "properties":{
        "cognitiveLevel":{"type":"string","enum":["知識","理解","應用","分析"]},
        "reason":{"type":"string"}
    },
    "required":["cognitiveLevel"]
}
INSTRUCTION = """你是學測地球科學命題分析專家。依據每題的「主題、概念摘要、難易度、是否含圖表」，判斷該題在布魯姆認知層次中屬於哪一層：
- 知識：記憶或辨識事實、定義、分類、條件等，不需推理。
- 理解：解釋、說明、比較概念意義，需理解但少計算。
- 應用：將概念運用於情境，含計算、估算、套用公式、判斷程序。
- 分析：拆解、比較多項資訊、推論因果、綜合圖表得出結論。
原則：需讀圖比較推論者多為「分析」；需計算/估算/套用者為「應用」；純記憶辨識為「知識」；解釋概念為「理解」。請輸出認知層次。"""
results = pplx_sdk.llm.extract(items=items, instruction=INSTRUCTION, output_schema=SCHEMA, max_tokens=16384)
cnt=0
for j,res in enumerate(results):
    i = idx_map[j]
    if res.error:
        print("ERR", res.error, records[i]["qid"]); continue
    cl = res.result.get("cognitiveLevel") if res.result else None
    if cl:
        records[i]["cognitiveLevel"]=cl
        cnt+=1
print("updated",cnt,"of",len(items))

with open("/home/user/workspace/gsat-earth-science/data/questions_109_112.json","w",encoding="utf-8") as f:
    json.dump(records,f,ensure_ascii=False,indent=2)

from collections import Counter
print("認知層次分布:",dict(Counter(r["cognitiveLevel"] for r in records)))
for y in ["109","110","111","112"]:
    c=Counter(r["cognitiveLevel"] for r in records if r["year"]==y)
    print(y,dict(c))
