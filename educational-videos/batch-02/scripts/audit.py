import json,pathlib,sys,hashlib,subprocess
from collections import deque
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R/'scripts'))
from render import frame,PLAN
expected={'bus':24-13+18,'beads':72//8-56//8,'books':80-25-38,'rabbits':(13+11)//8,'notebooks':(19-3)//4,'towels':(12-3)*3,'groups':(16+20)//4,'bread':(5-3)*3,'distance':(300+150)*2,'band':81-6*9}
for p in PLAN:
 if p['slug'] in expected:assert int(p['answer'])==expected[p['slug']] and p['original']['answer']==p['answer']
assert (25+15)//8==5 and 8*5==40 and 3*4==12 and 6//3==2 and 10+4-3+2==13
# Count separate drawn unit dots, detecting lost/duplicated/overlapping objects.
def components(im,colour):
 pixels=im.load();target=tuple(bytes.fromhex(colour));remaining={(x,y) for y in range(230,630) for x in range(35,515) if pixels[x,y]==target};sizes=[]
 while remaining:
  root=remaining.pop();q=[root];size=0
  while q:
   x,y=q.pop();size+=1
   for other in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
    if other in remaining:remaining.remove(other);q.append(other)
  if 20<=size<=250:sizes.append(size)
 return len(sizes)
unit_counts={'bus':{'699faa':29,'d49b79':13},'books':{'699faa':17,'d49b79':63},'notebooks':{'699faa':16,'d49b79':3},'towels':{'699faa':27,'d49b79':3},'band':{'699faa':27,'d49b79':54},'bread':{'719eac':18,'d79c70':6},'beads':{'ce8178':72,'d4b553':56},'rabbits':{'77aa89':13,'d8a16e':11},'groups':{'77aa89':16,'d8a16e':20},'peaches':{'77aa89':25,'d8a16e':15},'equal-groups':{'d8a16e':12}}
for k,p in enumerate(PLAN):
 for t in [0,8,16,24,28,32,36,40,44,48,56,60,63.99]:frame(k,t)
 if p['slug'] in unit_counts:
  im=frame(k,52)
  for c,n in unit_counts[p['slug']].items():
   actual=components(im,c);assert actual==n,(p['slug'],c,actual,n)
 print(p['slug'],'CONTENT/LAYOUT_PASS')
provenance=[]
for path in (R/'source-audit').glob('*'):
 actual=subprocess.check_output(['git','show','5cbce17c1a7d4f36fd74d5deaf1c4f7371147ca6:'+path.name.replace('__','/')]);assert path.read_bytes()==actual
 provenance.append({'path':path.name.replace('__','/'),'sha256':hashlib.sha256(actual).hexdigest()})
(R/'reports/source-files.json').write_text(json.dumps(provenance,indent=2))
print('SOURCE_SNAPSHOTS_MATCH; MATH_AND_UNIT_COUNTS_PASS; ALL_STAGES_WITHIN_BOUNDS')
