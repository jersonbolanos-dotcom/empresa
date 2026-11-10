import math, sys
def bez(p0,p1,p2,p3,n=40):
    return [tuple((1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d for a,b,c,d in zip(p0,p1,p2,p3)) for t in [i/n for i in range(1,n+1)]]
def arrugas(pts, amp, n):
    # ondulación perpendicular (arrugas) sobre una polilínea
    L=[0]
    for i in range(1,len(pts)): L.append(L[-1]+math.dist(pts[i-1],pts[i]))
    out=[]
    for i,p in enumerate(pts):
        a=pts[max(0,i-1)]; b=pts[min(len(pts)-1,i+1)]; dx,dy=b[0]-a[0],b[1]-a[1]; d=math.hypot(dx,dy) or 1
        nx,ny=dy/d,-dx/d; u=L[i]/L[-1]; w=math.sin(math.pi*u)  # se desvanece en los extremos
        s=abs(math.sin(u*n*math.pi))*amp*w
        out.append((p[0]+nx*s,p[1]+ny*s))
    return out
segs=[]; cur=(165,300)
def C(*v):
    global cur
    p1,p2,p3=(v[0],v[1]),(v[2],v[3]),(v[4],v[5]); segs.append(('C',p1,p2,p3)); cur=p3
def Lpts(pts):
    global cur
    for p in pts: segs.append(('L',p)); cur=p
# lomo: llega al borde trasero-superior de la oreja (B) y sigue por su contorno: la oreja tapa el hombro (el lomo NO la atraviesa)
C(180,210,290,148,410,138); C(440,134,458,136,472,140)
EAR_TOP = [(485,112,530,94,566,98), (594,102,606,130,612,162)]   # borde superior de la oreja (B → F, unión con el cráneo)
for c in EAR_TOP: C(*c)
# OREJA: borde delantero baja junto a la cabeza, lóbulo en punta, borde trasero ondulado sube hasta B
C(640,190,668,250,684,312); C(698,368,694,420,664,458); C(648,478,636,500,630,524)
C(616,500,590,486,560,474); C(522,456,500,420,494,384); C(488,344,470,320,474,280); C(478,238,464,190,472,140)
# … y repasa el borde superior (misma curva) para volver a F sin cruzar nada
for c in EAR_TOP: C(*c)
# cráneo y frente
C(650,130,720,104,790,106); C(850,110,894,140,906,192)
# OJO (almendra con su pliegue)
C(912,210,915,220,917,230); C(905,229,895,226,887,226); C(878,214,858,214,852,228); C(848,242,872,248,886,238); C(895,240,907,243,918,246)
# cara hasta la base de la trompa
C(922,272,926,300,927,328)
# TROMPA: borde exterior con arrugas, punta que se enrosca hacia delante y borde interior liso
outer=[]; p=cur
for seg in [((927,328),(958,370),(990,420),(1004,478)),((1004,478),(1016,532),(1012,580),(1026,612))]:
    outer+=bez(*seg,n=60)
Lpts(arrugas(outer,7,16))
C(1036,634,1068,632,1073,606); C(1077,586,1061,575,1049,585); C(1043,590,1045,600,1038,598)
C(1020,585,1004,560,990,520); C(976,480,962,452,942,428); C(926,412,908,404,889,402)
# COLMILLO (más grande; se rellena de marfil)
C(908,440,935,478,965,488); C(985,494,1000,480,1002,462); C(990,486,968,500,945,498); C(915,494,894,468,882,432)
# mandíbula y pecho
C(868,436,844,446,818,448); C(792,452,774,472,770,502)
# PATAS: columnas gruesas que se ensanchan hacia el pie, con uñas en las cercanas
# delantera cercana
C(780,560,786,620,790,676); C(792,690,796,700,798,706)
C(792,716,780,718,772,714); C(764,720,752,720,746,714); C(738,720,726,720,720,714); C(706,716,694,714,690,706)
C(694,660,698,604,694,560)
# delantera lejana (detrás)
C(690,562,688,564,686,566); C(684,610,680,660,678,700); C(678,708,672,714,664,714); C(650,716,612,716,600,710); C(598,660,600,606,606,556)
# vientre
C(570,560,510,566,470,562); C(445,560,430,556,420,552)
# trasera lejana
C(424,600,424,650,422,700); C(422,708,416,714,408,714); C(394,716,360,716,350,710); C(346,660,346,604,350,560)
C(342,560,334,558,330,556)
# trasera cercana y muslo
C(336,604,342,656,346,700); C(348,708,344,716,336,716); C(328,722,316,722,310,716); C(302,722,290,722,284,716); C(276,722,264,722,258,716); C(246,716,236,712,232,704)
C(228,650,224,600,216,540); C(204,472,184,422,174,382)
# COLA con mechón
C(172,366,170,352,168,340); C(152,362,144,420,140,468)
C(132,480,122,494,126,506); C(130,512,136,502,139,512); C(142,520,148,508,151,516); C(156,522,158,500,153,492)
C(151,484,150,478,150,470); C(154,420,160,380,170,352); C(170,330,166,315,165,300)
out=['M 165 300']
for s in segs:
    if s[0]=='C': out.append('C '+' '.join(f'{v:.1f}' for p in s[1:] for v in p))
    else: out.append(f'L {s[1][0]:.1f} {s[1][1]:.1f}')
open(sys.argv[1],'w').write('\n'.join(out)+'\n')
