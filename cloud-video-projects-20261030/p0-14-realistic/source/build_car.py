"""Original unbranded automobile, modelled from primitives and custom meshes.
Run with installed Blender: blender -b -t 2 --python source/build_car.py
"""
import bpy, math, pathlib, json, time
from mathutils import Vector
P=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)

def material(name,color,metal=0,rough=.3):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1)
 bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough
 return m
paint=material('Original petrol teal metallic paint',(.015,.22,.25),.72,.22)
glass=material('Smoked reflective glass',(.018,.045,.065),.35,.13)
rubber=material('Tire rubber',(.012,.016,.019),0,.69)
alloy=material('Satin forged alloy',(.45,.52,.55),.85,.23)
dark=material('Dark trim',(.015,.021,.025),.25,.34)
brake=material('Brake steel',(.14,.17,.18),.75,.45)
red=material('Brake caliper',(.6,.055,.025),.3,.3)
led=material('LED ivory',(.9,.98,1),.3,.14)
bs=led.node_tree.nodes.get('Principled BSDF');bs.inputs['Emission Color'].default_value=(.7,.9,1,1);bs.inputs['Emission Strength'].default_value=2
tail=material('Tail light red',(.65,.015,.025),.45,.16)

def finish(o,mat,bevel=0):
 o.data.materials.append(mat)
 if bevel:
  m=o.modifiers.new('Soft manufactured edges','BEVEL');m.width=bevel;m.segments=3
 for p in o.data.polygons:p.use_smooth=True
 return o
def box(name,loc,scale,mat,bevel=.04):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 return finish(o,mat,bevel)
def mesh(name,verts,faces,mat,bevel=0):
 m=bpy.data.meshes.new(name);m.from_pydata(verts,[],faces);m.update()
 o=bpy.data.objects.new(name,m);bpy.context.collection.objects.link(o);return finish(o,mat,bevel)
def line(name,pts,radius,mat):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=16
 s=c.splines.new('POLY');s.points.add(len(pts)-1)
 for p,co in zip(s.points,pts):p.co=(*co,1)
 c.bevel_depth=radius;c.bevel_resolution=3
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.data.materials.append(mat);return o
def cyl(name,loc,r,depth,mat,vertices=64):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc,rotation=(math.pi/2,0,0))
 o=bpy.context.object;o.name=name;return finish(o,mat,.012)

# Custom longitudinal body shell, shaped at the hood, shoulder and trunk.
sections=[(-2.30,.69,.89),(-2.20,.85,1.02),(-1.82,.92,1.08),(-1.20,.94,1.10),
 (-.45,.95,1.09),(.35,.95,1.08),(1.10,.94,1.06),(1.80,.91,.99),(2.15,.83,.91),(2.30,.69,.82)]
verts=[]
for x,w,z in sections:
 ring=[(0,z+.025),(w*.65,z),(w*.94,z-.06),(w,z-.18),(w*.99,.53),(w*.84,.40),
       (0,.38),(-w*.84,.40),(-w*.99,.53),(-w,z-.18),(-w*.94,z-.06),(-w*.65,z)]
 verts.extend((x,y,h) for y,h in ring)
n=12;faces=[]
for j in range(len(sections)-1):
 for k in range(n):faces.append((j*n+k,j*n+(k+1)%n,(j+1)*n+(k+1)%n,(j+1)*n+k))
faces.extend([tuple(range(n-1,-1,-1)),tuple((len(sections)-1)*n+k for k in range(n))])
body=mesh('Sculpted automobile body',verts,faces,paint,.065)
# Actual wheel-arch cutouts in the body, not painted black circles.
for x in (-1.43,1.42):
 bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=.49,depth=2.5,location=(x,0,.49),rotation=(math.pi/2,0,0))
 cutter=bpy.context.object
 bpy.context.view_layer.objects.active=body
 mod=body.modifiers.new('Wheel arch cut','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cutter
 bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)

# The passenger cabin has a curved roof and black glass with painted pillars.
roof_sections=[(-1.35,.77,1.08),(-.78,.69,1.64),(-.55,.66,1.73),(.25,.65,1.72),(.87,.78,1.08)]
rv=[]
for x,w,z in roof_sections:
 rv.extend([(x,-w,1.03),(x,-w*.94,z-.035),(x,-w*.64,z+.02),(x,0,z+.045),
            (x,w*.64,z+.02),(x,w*.94,z-.035),(x,w,1.03)])
rf=[]
for j in range(len(roof_sections)-1):
 for k in range(6):rf.append((j*7+k,j*7+k+1,(j+1)*7+k+1,(j+1)*7+k))
rf.extend([tuple(range(6,-1,-1)),tuple(28+k for k in range(7))])
mesh('Roof and cabin structure',rv,rf,paint,.025)
for sign in (-1,1):
 # Windows sit just above the structural shell.
 y=lambda h:sign*h
 mesh('Rear side window', [(-1.19,y(.773),1.105),(-.73,y(.665),1.58),(-.47,y(.652),1.63),(-.40,y(.788),1.12)],[(0,1,2,3)],glass,.008)
 mesh('Front side window',[(-.33,y(.787),1.12),(-.38,y(.65),1.64),(.21,y(.65),1.63),(.71,y(.79),1.12)],[(0,1,2,3)],glass,.008)
 # Door gaps and flush handles.
 line('Rear door seam',[(-.39,y(.953),.56),(-.38,y(.958),1.035)],.006,dark)
 line('Front door seam',[(.90,y(.925),.57),(.87,y(.956),1.03)],.006,dark)
 line('Lower sill',[(-.92,y(.96),.49),(.91,y(.96),.49)],.023,dark)
 for x in (-.75,.48):box('Flush handle',(x,y(.952),1.015),(.19,.024,.029),alloy,.012)
 # Mirror housing with dark reflective inset.
 mirror=box('Painted door mirror',(.70,y(.97),1.205),(.27,.22,.12),paint,.055)
 box('Mirror glass',(.58,y(.985),1.205),(.015,.17,.077),glass,.02)

mesh('Front windscreen',[(.29,-.62,1.68),(.29,.62,1.68),(.855,.745,1.10),(.855,-.745,1.10)],[(0,1,2,3)],glass,.012)
mesh('Rear windscreen',[(-1.31,-.71,1.105),(-1.31,.71,1.105),(-.80,.62,1.60),(-.80,-.62,1.60)],[(0,1,2,3)],glass,.012)
for sign in (-1,1):
 line('Glass surround',[(-1.27,sign*.774,1.10),(-.74,sign*.69,1.64),(-.45,sign*.665,1.70),(.24,sign*.665,1.69),(.83,sign*.79,1.10)],.014,alloy)
 line('Hood crease',[(.93,sign*.48,1.094),(1.55,sign*.52,1.045),(2.09,sign*.47,.946)],.007,paint)

# Original fascia: narrow lamps, grille slats and no badge or number plate.
box('Front intake',(2.278,0,.585),(.12,1.17,.23),dark,.075)
for y in [-.46,-.30,-.15,0,.15,.30,.46]:box('Intake vane',(2.345,y,.585),(.025,.018,.13),alloy,.006)
box('Front lip',(2.25,0,.435),(.17,1.48,.065),dark,.025)
for sign in (-1,1):
 box('Headlight surround',(2.208,sign*.56,.858),(.16,.42,.12),dark,.05)
 box('LED headlamp',(2.292,sign*.56,.872),(.012,.34,.034),led,.012)
 box('Rear lamp',(-2.226,sign*.56,.91),(.08,.38,.065),tail,.025)
box('Rear diffuser',(-2.245,0,.47),(.12,1.43,.13),dark,.035)

for x in (-1.43,1.42):
 for sy in (-1,1):
  y=sy*.88
  # Tyre torus axis is along the axle, producing visible sidewall thickness.
  bpy.ops.mesh.primitive_torus_add(major_radius=.343,minor_radius=.105,major_segments=64,minor_segments=16,
    location=(x,y,.49),rotation=(math.pi/2,0,0))
  finish(bpy.context.object,rubber);bpy.context.object.name='Rounded radial tire'
  cyl('Alloy barrel',(x,sy*.977,.49),.29,.065,dark)
  cyl('Brake rotor',(x,sy*1.005,.49),.245,.02,brake)
  for k in range(32):
   a=2*math.pi*k/32
   cyl('Rotor drill',(x+.204*math.cos(a),sy*1.019,.49+.204*math.sin(a)),.008,.005,dark,12)
  box('Caliper',(x+.17,sy*1.025,.54),(.07,.05,.20),red,.02)
  for k in range(10):
   a=2*math.pi*k/10
   sp=box('Forged spoke',(x+.151*math.cos(a),sy*1.052,.49+.151*math.sin(a)),(.25,.035,.037),alloy,.012)
   sp.rotation_euler[1]=-a
  cyl('Wheel centre',(x,sy*1.075,.49),.064,.025,alloy)
  for k in range(5):
   a=2*math.pi*k/5;cyl('Lug',(x+.04*math.cos(a),sy*1.094,.49+.04*math.sin(a)),.009,.01,dark,12)
  # Sidewall contour rings.
  for r in (.31,.397):
   pts=[(x+r*math.cos(a*2*math.pi/96),sy*.982,.49+r*math.sin(a*2*math.pi/96)) for a in range(97)]
   line('Tire moulding',pts,.003,dark)

# Studio illumination, using no HDRI or photographic environment assets.
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU'
scene.cycles.samples=64;scene.cycles.use_denoising=False
scene.cycles.max_bounces=5
scene.world.color=(.3,.3,.3)
def area(name,loc,power,size,color):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name
 o.data.energy=power;o.data.shape='RECTANGLE';o.data.size=size;o.data.size_y=size*.45;o.data.color=color
 o.rotation_euler=(Vector((0,0,.7))-o.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox key',(1,-4,6),1700,6,(.9,.97,1))
area('Roof strip',(-1,2,5),2000,5,(1,.94,.85))
area('Front fill',(5,3,2.5),900,4,(.7,.9,1))
area('Rear rim',(-4,-1,3),1000,3,(.65,1,.94))
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,.025));ground=bpy.context.object
ground.name='Studio shadow catcher';ground.is_shadow_catcher=True
finish(ground,material('Ground',(.7,.76,.75),0,.5))
bpy.ops.object.camera_add();cam=bpy.context.object;scene.camera=cam
cam.data.type='ORTHO';cam.data.ortho_scale=6.0;cam.data.lens=55
scene.render.resolution_x=1080;scene.render.resolution_y=860;scene.render.resolution_percentage=100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.view_settings.view_transform='AgX'
shots={'hero':(6.3,-7.8,4.2),'side':(2.0,-9,3.3),'front':(7.8,-6,3.2)}
start=time.monotonic()
for name,pos in shots.items():
 cam.location=pos;cam.rotation_euler=(Vector((0,0,.78))-cam.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(P/'assets'/f'car_{name}.png')
 bpy.ops.render.render(write_still=True)
 print('SHOT_DONE',name,flush=True)
bpy.ops.wm.save_as_mainfile(filepath=str(P/'source'/'original_car.blend'))
(P/'assets'/'model_render_metrics.json').write_text(json.dumps({'elapsed_seconds':time.monotonic()-start,'engine':'Cycles CPU','samples':64,'denoising':False,'shots':list(shots)},indent=2))
