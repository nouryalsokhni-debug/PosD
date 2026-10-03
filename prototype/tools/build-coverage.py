"""Rebuilds js/coverage-data.js and js/project-data.js (the Project picture dashboard in requirements.html: areas, module gates, build process, gaps, open questions).
js/coverage-data.js: every requirement in docs/02-requirements/requirements.md mapped to where the prototype shows it.
Run from anywhere:  python prototype/tools/build-coverage.py   (edit the map M below when a screen changes)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import re, json
P="index.html#/hq/electro-cafe"; B=P+"/b/ec-main"; C="pos.html"
def c(label="Cashier app"): return [label, C]
def p(path,label): return [label, P+path]
def b(path,label): return [label, B+path]
M={
"GEN-01":("works",[["All tenants","index.html#/tenants"],p("","Tenant HQ")]),
"GEN-02":("works",[p("/branches","Branches and registers")]),
"GEN-03":("works",[c(),p("","Panel (AR/EN toggle)")]),
"GEN-05":("works",[c("Cashier · sale in 3 taps")]),
"POS-01":("works",[c("Cashier · FLOW-01")]),
"POS-01-01":("works",[c("Cashier · Demo → Pay later"),p("/till","Till rules")]),
"POS-02#1":("works",[c("Cashier · order #"),p("/till","Till rules")]),
"POS-02#2":("works",[c("Cashier · invoice no."),p("/settings","Settings · series")]),
"POS-03":("works",[c()]),"POS-04":("works",[c("Cashier · options sheet")]),
"POS-05":("works",[c("Cashier · Split bill"),p("/till","Till rules")]),
"POS-06":("works",[c("Cashier · Hold / Held")]),"POS-07":("works",[c(),p("/till","Till rules")]),
"POS-08":("phase2",[p("/subscription","Subscription · table service")]),
"POS-09":("works",[c("Cashier · search / barcode"),p("/menu","Menu setup · barcode")]),
"POS-10":("works",[c("Cashier · Invoices → Cancel")]),
"CAT-01":("works",[p("/catalogue","Catalogue"),p("/menu","Menu setup")]),
"CAT-02":("works",[p("/menu","Menu setup · item")]),"CAT-03":("works",[p("/menu","Menu setup · categories")]),
"CAT-04":("works",[p("/menu","Menu setup · options"),c("Cashier · options")]),
"CAT-05":("works",[c("Cashier · item grid"),p("/menu","Menu setup · image")]),
"CAT-06":("works",[b("/items","Branch · Items")]),"CAT-07":("works",[p("/menu","Menu setup · import")]),
"PRC-01":("works",[p("/catalogue","Catalogue")]),"PRC-02":("works",[p("/promotions","Price history"),p("/prices","Prices")]),
"PRC-03":("works",[p("/promotions","Price history")]),"PRC-04":("works",[c("Cashier · combo"),p("/promotions","Offers")]),
"PRC-05":("works",[c("Cashier · offer of the day"),p("/promotions","Offers")]),
"PRC-06":("decision",[p("/promotions","Offers · mall staff")],"D-17"),
"PRC-07":("phase2",[p("/promotions","Offers · loyalty")]),
"PRC-08":("works",[c("Cashier · manual discount"),p("/settings","Settings · cap")],"D-04"),
"PRC-09":("decision",[p("/promotions","Offers · tax")],"D-03"),
"PRC-10":("works",[b("/discounts","Branch · discounts")]),
"PRC-11":("open",[]),
"PAY-01":("works",[p("/payments","Payment methods"),c()]),"PAY-02":("works",[c("Cashier · cash SYP")]),"PAY-03":("works",[c("Cashier · cash USD")]),
"PAY-04":("works",[p("/exchange-rate","Exchange rate"),c("Cashier · pinned rate")]),
"PAY-05":("works",[p("/reports","Reports · Payments")]),
"PAY-06":("decision",[p("/payments","Payment methods · card"),c("Cashier · card")],"D-29"),
"PAY-07":("works",[c("Cashier · Syriatel Cash")]),"PAY-08":("works",[c("Cashier · Sham Cash")]),
"PAY-09":("works",[c("Cashier · mixed payment")],"D-10"),"PAY-10":("works",[c("Cashier · rounding")],"D-11"),
"PAY-11":("phase2",[p("/payments","Payment methods · modules")]),
"PAY-12":("works",[c("Cashier · Refund cash")],"D-05"),
"CSH-01":("works",[c("Cashier · open shift"),p("/till","Till rules")],"D-23"),
"CSH-02":("works",[c("Cashier · close shift"),b("/shifts","Branch · shift reports")]),
"CSH-03":("works",[c("Cashier · close shift"),b("/shifts","Branch · shift reports")]),
"CSH-04":("works",[c("Cashier · variance reason"),b("/shifts","Branch · count")],"D-06"),
"CSH-05":("works",[p("/till","Till rules")]),
"CSH-06":("works",[c("Cashier · Menu → Open drawer"),p("/till","Till rules")]),
"CSH-07":("works",[c("Cashier · shift report"),b("/shifts","Branch · report")]),
"CSH-08":("works",[p("/branches","Branches and registers"),p("/till","Till rules")],"D-13"),
"KDS-01":("works",[c("Cashier · Kitchen")]),"KDS-02":("works",[c("Cashier · Kitchen")]),"KDS-03":("works",[c("Cashier · Kitchen / Orders")]),
"KDS-04":("decision",[c("Cashier · Kitchen stations"),p("/till","Till rules")],"D-14"),
"KDS-05":("works",[c("Cashier · Kitchen timer"),p("/till","Till rules")]),
"KDS-06":("works",[c("Cashier · Orders → Ready / display")]),
"USR-01":("works",[p("/roles","Roles and permissions")]),"USR-02":("works",[p("/roles","Roles and permissions")]),
"USR-03":("works",[c("Cashier · Tap staff card"),p("/roles","Roles · add person")]),
"USR-04":("works",[c("Cashier · Audit log"),p("/reports","Reports · Discounts")]),
"USR-05":("works",[c("Cashier · Audit log"),p("/support-access","Support access · audit log")]),
"USR-06":("works",[p("/roles","Roles · add person")],"D-15"),
"USR-07":("works",[c("Cashier · Staff meal"),p("/till","Till rules")],"D-16"),
"FIS-01":("works",[c("Cashier · every sale · To print"),p("/till","Till rules")]),
"FIS-02":("works",[c("Cashier · 80 mm receipt"),p("/till","Till rules · invoice")]),
"FIS-03":("works",[c("Cashier · invoice no."),p("/settings","Settings · series")],"D-27"),
"FIS-04":("decision",[p("/menu","Menu setup · tax")],"D-03"),
"FIS-05":("shown",[p("/till","Till rules · e-invoicing")]),
"FIS-06":("works",[c("Cashier · Invoice to a company"),p("/till","Till rules")],"D-18"),
"FIS-07":("works",[c("Cashier · Invoices → Reprint")]),
"FIS-08":("works",[c("Cashier · Invoices"),p("/till","Till rules")]),
"STK-01":("works",[p("/inventory","Inventory")]),
"STK-02":("decision",[p("/inventory","Inventory · level")],"D-01"),
"STK-03":("works",[c("Cashier · stock count on tiles"),p("/inventory","Inventory")]),
"STK-04":("works",[p("/inventory","Inventory · Purchasing → Receive")]),
"STK-05":("works",[b("/stock","Branch · Record waste")],"D-07"),
"STK-06":("works",[p("/inventory","Inventory · Stock count")]),
"STK-07":("works",[p("/inventory","Inventory · low stock")]),
"STK-08":("phase2",[p("/inventory","Inventory · Warehouse")],"D-24"),
"STK-09":("works",[p("/inventory","Inventory · Purchasing")]),
"STK-10":("phase2",[p("/inventory","Inventory · Margin")]),
"RPT-01":("works",[p("/reports","Reports · Summary")]),"RPT-02":("works",[p("/reports","Reports · Items")]),
"RPT-03":("works",[p("/reports","Reports · Staff")]),"RPT-04":("works",[p("/reports","Reports · Cash"),b("/shifts","Branch · shift reports")]),
"RPT-05":("works",[p("/reports","Reports · Discounts")]),"RPT-06":("works",[p("/reports","Reports · Branches"),["Cedar Grill (3 branches)","index.html#/hq/sample-cedar-grill/reports"]]),
"RPT-07":("works",[p("/reports","Reports · Hours")]),"RPT-08":("works",[p("/reports","Reports"),b("/reports","Branch reports")]),
"RPT-09":("works",[p("/reports","Reports · Export to Excel")]),
"OFF-01":("works",[c("Cashier · Demo → Go offline, +2 hours, next day")]),"OFF-02":("works",[c("Cashier · offline prep ticket")]),
"OFF-03":("works",[c("Cashier · close shift offline")]),"OFF-04":("works",[c("Cashier · shift report"),p("/reports","Reports · note")]),
"OFF-05":("works",[c("Cashier · Go online → sync report")]),"OFF-06":("works",[c("Cashier · sync report · HQ changes win"),p("/till","Till rules · conflicts")]),
"OFF-07":("works",[c("Cashier · status pill"),["Operations health","index.html#/operations"]]),
"OFF-08":("works",[c("Cashier · power cut, also during payment")]),"OFF-09":("works",[c("Cashier · retention warning"),p("/till","Till rules · retention")],"D-12"),
"HW-01":("works",[p("/devices","Devices")]),"HW-02":("works",[c("Cashier · 80 mm print + printer problems"),p("/devices","Devices")]),
"HW-03":("works",[c("Cashier · drawer opens"),p("/devices","Devices")]),"HW-04":("works",[c("Cashier · barcode"),p("/devices","Devices")]),
"HW-05":("works",[c("Cashier · Menu → Customer display"),p("/devices","Devices")]),
"HW-06":("decision",[p("/devices","Devices · card terminal")],"D-29"),"HW-07":("works",[p("/devices","Devices · approved list"),["Platform settings · approved hardware","index.html#/settings"]]),
"NH-07":("dropped",[p("","Home · live feed instead")],"D-28"),
}
MODULE={"General & Platform":"M1","Users & Permissions":"M1","Items & Menu":"M1","Sales":"M2","Payment & Currencies":"M2","Kitchen Display (KDS)":"M2","Offline Operation":"M2","Invoicing & Compliance":"M2","Cash Drawer & Shifts":"M3","Hardware":"M3","Pricing & Promotions":"M4","Inventory":"M4","Reports":"M4"}
rows=[]; seen={}
for line in open(os.path.join(ROOT, '..', 'docs', '02-requirements', 'requirements.md'), encoding='utf-8'):
    m=re.match(r'^\| ([A-Z]{2,3}-[0-9]+(?:-[0-9]+)?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|',line)
    dm=re.match(r'^## (.+)',line)
    if dm: dom=dm.group(1).strip(); continue
    if not m: continue
    rid=m.group(1); seen[rid]=seen.get(rid,0)+1
    key=rid+"#"+str(seen[rid]) if rid=="POS-02" else rid
    v=M[key]; 
    rows.append({"id":rid,"module":MODULE.get(dom,"—"),"domain":dom,"title":m.group(2),"detail":m.group(3),"priority":m.group(5),"phase":m.group(6),"nov10":m.group(7),"state":v[0],"links":v[1],"decision":v[2] if len(v)>2 else ""})
assert len(rows)==111, len(rows)
open(os.path.join(ROOT, 'js', 'coverage-data.js'), 'w', encoding='utf-8').write("/* Generated from docs/02-requirements/requirements.md + the prototype map. Regenerate when either changes. */\nwindow.COVERAGE = "+json.dumps(rows,ensure_ascii=False,indent=0)+";\n")
from collections import Counter; print(Counter(r["state"] for r in rows))

# ---------- Project picture: docs/08-delivery/project-picture.md + live counts ----------
DOCS=os.path.join(ROOT,'..','docs')
def md_tables(path):
    """Return {section heading: [row dicts]} for every pipe table under a '## ' heading."""
    out={}; sec=None; head=None
    for line in open(path,encoding='utf-8'):
        line=line.rstrip('\n')
        if line.startswith('## '): sec=line[3:].strip(); head=None; continue
        if not line.startswith('|'): head=None if not line.strip() else head; continue
        cells=[c.strip() for c in line.strip('|').split('|')]
        if head is None: head=cells; out.setdefault(sec,[]); continue
        if set(''.join(cells))<=set('-: '): continue
        out[sec].append(dict(zip(head,cells)))
    return out
pp_path=os.path.join(DOCS,'08-delivery','project-picture.md')
pp=md_tables(pp_path)
meta=dict(re.findall(r'^(\w+): (.*)$',open(pp_path,encoding='utf-8').read().split('---')[1],re.M))
dec=Counter(); 
for line in open(os.path.join(DOCS,'06-decisions','decision-log.md'),encoding='utf-8'):
    m=re.match(r'^\| (D-\d+) \|(?:[^|]*\|){4} (open|proposed|decided) \|',line)
    if m: dec[m.group(2)]+=1
scr=Counter(re.findall(r'\| (todo|html-draft|figma-wip|figma-approved|in-dev|done) \|',open(os.path.join(DOCS,'04-design','screen-registry.md'),encoding='utf-8').read()))
oq=md_tables(os.path.join(DOCS,'08-delivery','open-questions.md')).get('Questions',[])
project={"last_analysis":meta.get('last_analysis',''),"areas":pp.get('Area health',[]),"modules":pp.get('Module gates',[]),"gaps":pp.get('Gaps',[]),
  "build":pp.get('Build process',[]),"questions":oq,
  "counts":{"requirements":len(rows),"req_state":dict(Counter(r["state"] for r in rows)),"nov10":dict(Counter(r["nov10"] for r in rows)),"decisions":dict(dec),"screens":dict(scr)}}
assert project["areas"] and project["gaps"] and project["modules"] and project["build"], "project-picture.md tables not found"
assert project["questions"], "open-questions.md table not found"
open(os.path.join(ROOT,'js','project-data.js'),'w',encoding='utf-8').write("/* Generated from docs/08-delivery/project-picture.md + live counts (requirements, decision log, screen registry). Regenerate: python prototype/tools/build-coverage.py */\nwindow.PROJECT = "+json.dumps(project,ensure_ascii=False,indent=0)+";\n")
print("project:",len(project["gaps"]),"gaps ·",dict(dec),"·",dict(scr),"·",len(oq),"questions",dict(Counter(q["Status"] for q in oq)))
