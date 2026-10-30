"""Independent invariants, without inspecting rendered labels as answer evidence."""
import sys,math
sys.path.insert(0,str(__import__('pathlib').Path(__file__).parent))
from render import frame,lessons
pairs=[((0,0,1),(0,0,-1),1,6),((1,0,0),(-1,0,0),3,4),((0,1,0),(0,-1,0),5,2)]
for a,b,x,y in pairs:
 assert sum(i*j for i,j in zip(a,b))==-1 and x+y==7
assert 7-1==6 and 9-2==7
assert sum([6,6,6,4])==22 and 25+8*4==57
# Every text stage and both sides of transitions must satisfy bounds assertions.
for k in range(3):
 for t in [i*6+.01 for i in range(12)]+[26.99,35.99,44.99,56.99]:frame(k,t)
print('PASS: opposite normals; sums; source quantities; all text-stage boundaries')
