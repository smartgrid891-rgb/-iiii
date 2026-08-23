import json, pplx_sdk

with open("/home/user/workspace/gsat-earth-science/data/questions_109_112.json",encoding="utf-8") as f:
    records = json.load(f)

nodes = []
cur = json.load(open("/home/user/workspace/gsat-earth-science/data/curriculum_nodes.json",encoding="utf-8"))
for t in cur["themes"]:
    for n in t["nodes"]:
        nodes.append(f"{n['id']} {n['name']}：{n['concepts']}")
NODE_LIST = "\n".join(nodes)

items=[]
idx_map=[]
for i,r in enumerate(records):
    idx_map.append(i)
    items.append(json.dumps({"qid":r["qid"],"topic":r["topic"],"concept":r["concept"]},ensure_ascii=False))

SCHEMA={
    "type":"object",
    "properties":{
        "nodeId":{"type":"string","enum":[n.split()[0] for n in nodes]},
        "reason":{"type":"string"}
    },
    "required":["nodeId"]
}
INSTRUCTION=f"""你是學測地球科學命題分析專家，依108課綱將每題對應到最合適的課綱節點。可選節點如下（id 名稱：概念）：
{NODE_LIST}

對應原則：依題目核心概念選擇「最主要」的節點（單選）。若跨多節點，選最核心者。輸出nodeId。"""
results=pplx_sdk.llm.extract(items=items,instruction=INSTRUCTION,output_schema=SCHEMA,max_tokens=16384)
nodemap={n.split()[0]:" ".join(n.split()[1:]) for n in nodes}  # not used for name
# build id->name from cur
id2name={}
for t in cur["themes"]:
    for n in t["nodes"]:
        id2name[n["id"]]=n["name"]
cnt=0
for j,res in enumerate(results):
    i=idx_map[j]
    if res.error:
        print("ERR",res.error,records[i]["qid"]);continue
    nid=res.result.get("nodeId") if res.result else None
    if nid and nid in id2name:
        records[i]["nodeId"]=nid
        records[i]["nodeName"]=id2name[nid]
        cnt+=1
print("updated",cnt,"of",len(items))
json.dump(records,open("/home/user/workspace/gsat-earth-science/data/questions_109_112.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
from collections import Counter
print("節點分布:")
for nid,c in sorted(Counter(r["nodeId"] for r in records).items()):
    print(f"  {nid} {id2name.get(nid,'')} {c}")
