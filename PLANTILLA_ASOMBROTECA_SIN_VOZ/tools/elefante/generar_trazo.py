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
# lomo
C(180,210,290,148,410,138); C(480,132,555,142,612,162)
# OREJA (bucle cerrado en el mismo sentido que el cuerpo): borde delantero baja junto a la cabeza, lóbulo en punta, borde trasero ondulado sube, borde superior sobresale y vuelve al cuello
C(640,190,668,250,684,312); C(698,368,694,420,664,458); C(648,478,636,500,630,524)   # punta del lóbulo
C(616,500,590,486,560,474); C(522,456,500,420,494,384); C(488,344,470,320,474,280)
C(478,238,462,200,476,160); C(490,118,530,96,566,100); C(594,104,606,130,612,162)
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
# COLMILLO (marfil, sale entre la barbilla y la trompa con la punta hacia arriba)
C(905,430,925,462,950,474); C(962,479,972,474,976,462); C(966,478,950,486,934,482); C(912,472,896,450,884,428)
# mandíbula y pecho
C(868,436,844,446,818,448); C(792,452,774,472,770,502)
# PATA DELANTERA cercana (con rodilla y uñas)
C(778,548,786,598,780,646); C(776,676,779,692,788,702)
C(790,712,780,718,770,714); C(762,720,750,720,744,714); C(736,720,726,720,720,714); C(712,716,704,714,702,708)
C(700,664,698,606,704,548)
# PATA DELANTERA lejana (detrás)
C(694,552,682,554,672,556); C(670,604,667,652,666,690); C(666,704,662,712,654,714); C(642,716,628,716,618,712); C(612,664,612,606,620,548)
# vientre
C(582,552,520,560,470,556); C(440,553,416,548,402,542)
# PATA TRASERA lejana
C(406,592,406,642,402,690); C(402,704,398,712,390,714); C(378,716,364,716,354,712); C(350,662,348,604,346,550)
C(338,550,328,548,320,546)
# PATA TRASERA cercana (rodilla y uñas) y muslo
C(326,600,334,648,328,690); C(330,704,328,712,320,716); C(312,722,300,722,294,716); C(286,722,274,722,268,716); C(260,720,252,718,246,712)
C(240,664,232,604,220,542); C(206,472,184,422,174,382)
# COLA con mechón
C(172,366,170,352,168,340); C(152,362,144,420,140,468)
C(132,480,122,494,126,506); C(130,512,136,502,139,512); C(142,520,148,508,151,516); C(156,522,158,500,153,492)
C(151,484,150,478,150,470); C(154,420,160,380,170,352); C(170,330,166,315,165,300)
out=['M 165 300']
for s in segs:
    if s[0]=='C': out.append('C '+' '.join(f'{v:.1f}' for p in s[1:] for v in p))
    else: out.append(f'L {s[1][0]:.1f} {s[1][1]:.1f}')
open(sys.argv[1],'w').write('\n'.join(out)+'\n')
