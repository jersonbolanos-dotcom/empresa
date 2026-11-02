# Ajuste del perfil de la cúpula (ykR2) y del encaje de la foto: mide la silueta de la foto de Meybod y busca por mínimos cuadrados
# el perfil r = R0·(1-h)^p·(1+q·sen πh) y la transformación (escala, x, y) que mejor la superponen vista desde la cámara MC.
# Resultado: p = 0,70 · q = 0,22 con remate redondeado (parabólico desde h ≈ 0,8) · s = 1,0957 · x = -55,24 · y = 550,25 → ≈ 10 px rms.
import numpy as np, math
sil=np.loadtxt('../07_QC/silueta_foto_medida.csv', delimiter=','); sil=sil[sil[:,0]<=575]
R0,Hh=100,175
pos=np.array([300,14,-30.]); tgt=np.array([0,80,0.]); f=1250
fw=tgt-pos; fw/=np.linalg.norm(fw); rt=np.cross(fw,[0,1,0]); rt/=np.linalg.norm(rt); up=np.cross(rt,fw)
A=np.linspace(0,2*math.pi,180,endpoint=False); Y=np.linspace(0,Hh,160)
def silh(p,q):
    h=Y/Hh; r=R0*np.maximum(0,1-h)**p*(1+q*np.sin(math.pi*h))
    P=np.stack([np.outer(r,np.cos(A)), np.repeat(Y[:,None],len(A),1), np.outer(r,np.sin(A))],-1).reshape(-1,3)-pos
    z=P@fw; x=540+f*(P@rt)/z; y=960-f*(P@up)/z
    ys=np.arange(int(y.min())+1,int(y.max())); idx=np.clip(np.round(y).astype(int)-ys[0],0,len(ys)-1)
    mn=np.full(len(ys),1e9); mx=np.full(len(ys),-1e9); np.minimum.at(mn,idx,x); np.maximum.at(mx,idx,x); return ys,mn,mx
def err(ys,mn,mx,s,ox,oy):
    e=[]
    for y,l,r in sil:
        i=int(round(oy+s*y-ys[0]))
        if i<0 or i>=len(ys) or mn[i]>1e8: e.append(60); continue
        e.append(ox+s*l-mn[i]);
        if y<=400: e.append(ox+s*r-mx[i])
    return float(np.sqrt((np.array(e)**2).mean()))
def fit_xf(p,q,x0):
    ys,mn,mx=silh(p,q); x=np.array(x0,float); st=np.array([0.02,8,8]); E=err(ys,mn,mx,*x)
    for it in range(400):
        imp=False
        for k in range(3):
            for d in (1,-1):
                y=x.copy(); y[k]+=d*st[k]; Ey=err(ys,mn,mx,*y)
                if Ey<E: x,E,imp=y,Ey,True
        if not imp: st/=2
        if st[0]<1e-4: break
    return E,x
best=None; x0=[1.252,-154.9,532.2]
if 0:
 for p in [0.45]:
    for q in [0,0.05,0.1,0.15]:
        E,x=fit_xf(p,q,x0); print(p,q,round(E,1),np.round(x,3))
        if best is None or E<best[0]: best=(E,p,q,x)
print('BEST',best)
print('--- extendido')
best=None
for p in [0.5,0.55,0.6,0.7,0.8]:
    for q in [0.15,0.2,0.25,0.3,0.35]:
        for s0 in [1.15,1.25,1.35]:
            E,x=fit_xf(p,q,[s0,540-555*s0,600-60*s0])
            if best is None or E<best[0]: best=(E,p,q,x)
    print(p,best[:3])
print('BEST',best)
