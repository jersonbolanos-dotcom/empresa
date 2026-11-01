import math
c=299792458.0; a=9.80665; ly=9.4607304725808e15; yr=365.25*86400
for Dly in (2.5e6, 2.537e6):
    D=Dly*ly
    tau=2*(c/a)*math.acosh(1+a*D/(2*c*c)); t=2*(c/a)*math.sinh(a*tau/(2*c))
    vmax=math.tanh(a*tau/(2*c)); g=math.cosh(a*tau/(2*c))
    print(f"D={Dly:.3e} ly  tau={tau/yr:.2f} a  t={t/yr:,.0f} a  t-D/c={(t-D/c)/yr:.1f} a  gamma_max={g:.4e}  1-v/c={1-vmax:.3e}")
# hitos en la ida (D=2.5e6)
D=2.5e6*ly
for tau_y in (1,2,3,5,10,14.5):
    tau=tau_y*yr; x=(c*c/a)*(math.cosh(a*tau/c)-1); t=(c/a)*math.sinh(a*tau/c); v=math.tanh(a*tau/c)
    print(f"tau={tau_y:>5} a  t={t/yr:,.1f} a  x={x/ly:,.2f} al  v={v:.12f} c")
