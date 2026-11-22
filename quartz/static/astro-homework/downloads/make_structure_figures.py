from pathlib import Path
import json,numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp,quad
from scipy.optimize import brentq
P=Path(__file__).resolve().parent;OUT=P/'figures';OUT.mkdir(exist_ok=True)
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':13,'axes.labelsize':14,'axes.titlesize':15,'legend.fontsize':11,'text.color':'#17252c','axes.labelcolor':'#17252c','xtick.color':'#263238','ytick.color':'#263238','axes.edgecolor':'#37474f','axes.grid':True,'grid.alpha':.2,'figure.facecolor':'white','axes.facecolor':'white','savefig.facecolor':'white'})
C=['#0072b2','#d55e00','#009e73','#7c3c8c','#263238'];LS=['-','--','-.',':',(0,(5,2,1,2))]
def save(fig,name):fig.savefig(OUT/(name+'.png'),dpi=170);plt.close(fig)
def lane(n):
 eps=1e-6
 def rhs(x,y):return [y[1],-2*y[1]/x-max(y[0],0)**n]
 def surface(x,y):return y[0]
 surface.terminal=True;surface.direction=-1
 sol=solve_ivp(rhs,[eps,40],[1-eps**2/6,-eps/3],rtol=1e-10,atol=1e-12,events=surface,dense_output=True,max_step=.025)
 x1=float(sol.t_events[0][0]);x=np.linspace(eps,x1,1000);th,dth=sol.sol(x);th=np.maximum(th,0)
 return x1,-x1*x1*sol.y_events[0][0,1],x,th,dth
models={n:lane(n) for n in [1,1.5,2,3,3.5]}
fig,ax=plt.subplots(figsize=(8,6),layout='constrained')
for i,(n,(_,_,x,th,_)) in enumerate(models.items()):ax.plot(x,th,color=C[i],ls=LS[i],lw=2,label=f'n = {n}')
ax.set(xlabel=r'$\xi$',ylabel=r'$\theta(\xi)$',title='Lane-Emden dimensionless solutions',ylim=(0,1.03));ax.legend();save(fig,'lane-emden-theta')
fig,ax=plt.subplots(figsize=(8,6),layout='constrained')
for i,(n,(x1,m1,x,th,dth)) in enumerate(models.items()):ax.plot(x/x1,-x*x*dth/m1,color=C[i],ls=LS[i],lw=2,label=f'n = {n}')
ax.set(xlabel=r'$r/R$',ylabel=r'$m(r)/M$',title='Polytropic enclosed mass',ylim=(0,1.03));ax.legend();save(fig,'polytrope-mass')
xx=np.logspace(-3,4,400);gg=[]
for x in xx:
 integ=quad(lambda u:u**4/np.sqrt(1+x*x*u*u),0,1,epsabs=1e-12)[0];gg.append(1/(3*np.sqrt(1+x*x)*integ))
fig,ax=plt.subplots(figsize=(8,6),layout='constrained');ax.semilogx(xx,gg,c=C[0],lw=2.5,label=r'$d\ln P/d\ln\rho$ at zero temperature');ax.axhline(5/3,c=C[1],ls='--',label='5/3');ax.axhline(4/3,c=C[2],ls=':',label='4/3');ax.set(xlabel=r'$x_F=p_F/(m_e c)$',ylabel=r'$\Gamma_1$',title='Completely degenerate electron gas',ylim=(1.31,1.70));ax.legend();save(fig,'degenerate-gamma')
# Model S: original provider's basic table; pressure/density/temperature only.
ssm=P/'model-s.dat'
if not ssm.exists():
 import urllib.request
 urllib.request.urlretrieve('https://users-phys.au.dk/jcd/solar_models/cptrho.l5bi.d.15c',ssm)
a=np.loadtxt(ssm);G=6.67430e-8;M=1.98847e33;R=6.957e10;Rg=8.314462618e7;mu=.61
solar={}
for n in [1.5,3]:
 x1,m1,x,th,dth=models[n];alpha=R/x1;rhoc=M/(4*np.pi*alpha**3*m1);K=4*np.pi*G*alpha**2*rhoc**(1-1/n)/(n+1);Pc=K*rhoc**(1+1/n);Tc=mu*Pc/(Rg*rhoc)
 solar[n]={'r':x/x1,'rho':rhoc*th**n,'P':Pc*th**(n+1),'T':Tc*th,'rhoc':rhoc,'Pc':Pc,'Tc':Tc}
for key,col,yl in [('rho',2,r'Density (g cm$^{-3}$)'),('P',3,r'Pressure (dyn cm$^{-2}$)'),('T',5,'Temperature (K)')]:
 fig,ax=plt.subplots(figsize=(8,6),layout='constrained');ax.plot(a[:,0],a[:,col],c='#263238',lw=2.5,label='Standard solar model: Model S (1996)')
 for i,(n,z) in enumerate(solar.items()):ax.plot(z['r'],z[key],c=C[i],ls=LS[i],lw=2,label=f'Polytrope n={n}; same solar M,R')
 ax.set(xlabel=r'$r/R_\odot$',ylabel=yl,title='Solar structure: standard and polytropic models',xlim=(0,1))
 if key!='T':ax.set_yscale('log');ax.set_ylim((1e-8,1e3) if key=='rho' else (1e3,1e18))
 else:ax.ticklabel_format(axis='y',style='sci',scilimits=(0,0));ax.set_ylim(0,1.8e7)
 ax.legend();save(fig,'solar-'+key.lower())
# Saha hydrogen, fixed T=1e4 K, no radiation. y is ionized nuclei fraction.
y=np.linspace(.00001,.99999,1200);q=13.6*1.602176634e-12/(1.380649e-16*1e4);A=y*(1-y)/(2-y);chi_rho=1-A/(1+y);chi_T=1+A*(1.5+q)/(1+y);cv=1.5*(1+y)+A*(1.5+q)**2;g3minus=(1+y)*chi_T/cv;g1=chi_rho+chi_T*g3minus;g2=g1/(g1-g3minus);g3=1+g3minus
fig,ax=plt.subplots(figsize=(8,6),layout='constrained')
for i,(v,label) in enumerate([(g1,r'$\Gamma_1$'),(g2,r'$\Gamma_2$'),(g3,r'$\Gamma_3$')]):ax.plot(y,v,c=C[i],ls=LS[i],lw=2.3,label=label)
ax.axhline(4/3,c='#263238',ls=':',label='4/3');ax.set(xlabel='Hydrogen ionization fraction y',ylabel='Adiabatic exponent',title='Saha-equilibrium hydrogen at T = 10,000 K',ylim=(1.05,1.72));ax.legend();save(fig,'hydrogen-ionization-gammas')
# W(U,x), equivalent to original MLT cubic; constants are contour labels.
def Wof(U,x):return x+9/(8*U)*(x/(np.sqrt(x+U*U)+U))**3
u=np.logspace(-6,6,1600);fig,ax=plt.subplots(figsize=(8,7),layout='constrained')
for j,x in enumerate(np.logspace(-4,4,9)):
 w=Wof(u,x);ax.loglog(u,w,c='#52626b',lw=1);idx=np.argmin(abs(np.log10(u)-1.5));ax.text(u[idx],w[idx],f'x={x:g}',fontsize=9,color='#263238',bbox={'facecolor':'white','edgecolor':'none','pad':.2})
for j,gam in enumerate([.01,1,100]):
 x=u*u*((2*gam+1)**2-1);w=Wof(u,x);ax.loglog(u,w,c=C[j],ls=LS[j],lw=2,label=fr'$\Gamma={gam:g}$')
coef=1+9/8*(np.sqrt(2)-1)**3;ax.loglog(u,coef*u*u,c=C[3],ls=':',lw=2.5,label=r'$x=U^2$: $W=1.07995U^2$');ax.set(xlabel='U',ylabel='W',title='Mixing-length parameter plane',xlim=(1e-6,1e6),ylim=(1e-6,1e6));ax.legend(loc='upper left');save(fig,'mixing-length-w-u')
report={'Model_S_source':'https://users-phys.au.dk/jcd/solar_models/','Model_S_data':'https://users-phys.au.dk/jcd/solar_models/cptrho.l5bi.d.15c','solar_polytropes_assumptions':'same nominal solar M,R; constant ideal-gas mu=0.61 for temperature','solar_centres':{str(n):{k:float(v) for k,v in z.items() if k in ['rhoc','Pc','Tc']} for n,z in solar.items()},'saha':'pure H, LTE Saha ionization, T=10000K; no radiation or molecules','mixing_length_boundary_coefficient':coef}
(P/'structure-figure-results.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report,indent=2))
