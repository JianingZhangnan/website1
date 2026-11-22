"""Reproduce astronomy assignment figures (numpy, scipy, matplotlib).
Data: download MainSequence_MLR.txt and Gaia_EDR3_HR.zip from the course links:
https://box.nju.edu.cn/f/84549dadfc194847a8e0/
https://box.nju.edu.cn/f/75309dd52409473c8e83/
Place both beside this script. Gaia missing logT/logL is encoded as -99.9.
Eker fits use all 442 supplied rows; split at M=1.1 solar masses.
"""
from pathlib import Path
import io,json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
P=Path(__file__).resolve().parent
OUT=P/'figures';OUT.mkdir(exist_ok=True)
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':13,'axes.labelsize':14,'axes.titlesize':15,'legend.fontsize':11,'axes.edgecolor':'#37474f','axes.labelcolor':'#17252c','xtick.color':'#263238','ytick.color':'#263238','text.color':'#17252c','figure.facecolor':'white','axes.facecolor':'white','savefig.facecolor':'white','axes.grid':True,'grid.alpha':.2})
COLORS=['#0072b2','#d55e00','#009e73','#7c3c8c']
def save(fig,name):fig.savefig(OUT/(name+'.png'),dpi=170);plt.close(fig)
def load(path):
 lines=[s for s in path.read_text(encoding='utf-8-sig').splitlines() if s.strip() and not s.lstrip().startswith('#')]
 return np.genfromtxt(io.StringIO('\n'.join(lines)),names=True)
if not (P/'Gaia_EDR3_HR'/'Gaia_EDR3_HR.txt').exists() and (P/'Gaia_EDR3_HR.zip').exists():
 import zipfile
 with zipfile.ZipFile(P/'Gaia_EDR3_HR.zip') as z:
  member=next(n for n in z.namelist() if Path(n).name=='Gaia_EDR3_HR.txt')
  (P/'Gaia_EDR3_HR').mkdir(exist_ok=True)
  (P/'Gaia_EDR3_HR'/'Gaia_EDR3_HR.txt').write_bytes(z.read(member))
gaia=load(P/'Gaia_EDR3_HR'/'Gaia_EDR3_HR.txt')
fig,ax=plt.subplots(figsize=(8,6),layout='constrained');ax.scatter(gaia['BPRP'],gaia['MG'],s=1,c='#0072b2',alpha=.28,rasterized=True);ax.invert_yaxis();ax.set(xlabel='BP - RP (mag)',ylabel='Absolute G magnitude',title=f'Gaia EDR3 colour-magnitude diagram (N={len(gaia):,})');save(fig,'gaia-colour-magnitude')
hr_ok=(gaia['logT'] != -99.9) & (gaia['logL'] != -99.9) & np.isfinite(gaia['logT']) & np.isfinite(gaia['logL'])
fig,ax=plt.subplots(figsize=(8,6),layout='constrained');ax.scatter(gaia['logT'][hr_ok],gaia['logL'][hr_ok],s=1,c='#0072b2',alpha=.28,rasterized=True);ax.invert_xaxis();ax.set(xlabel=r'$\log_{10}(T_{\rm eff}/{\rm K})$',ylabel=r'$\log_{10}(L/L_\odot)$',title=f'Gaia EDR3 H-R diagram (N={hr_ok.sum():,}; missing T/L excluded)');save(fig,'gaia-hr')
a=load(P/'MainSequence_MLR.txt');print('Fields',a.dtype.names)
x=a['logM'];r=a['logR'];y=a['logL'];t=np.log10(5772)+(y-2*r)/4
fits={};groups=[('all',np.ones(len(a),dtype=bool)),('M_le_1.1',x<=np.log10(1.1)),('M_gt_1.1',x>np.log10(1.1))]
for g,mask in groups:
 fits[g]={'N':int(mask.sum())}
 for name,xx,yy in [('mass_luminosity',x,y),('mass_radius',x,r),('temperature_luminosity',t,y)]:
  cc,cov=np.polyfit(xx[mask],yy[mask],1,cov=True);fits[g][name]={'slope':float(cc[0]),'intercept':float(cc[1]),'slope_OLS_SE':float(np.sqrt(cov[0,0]))}
for name,xx,yy,xlabel,ylabel in [('mass-luminosity',x,y,r'$\log_{10}(M/M_\odot)$',r'$\log_{10}(L/L_\odot)$'),('mass-radius',x,r,r'$\log_{10}(M/M_\odot)$',r'$\log_{10}(R/R_\odot)$'),('temperature-luminosity',t,y,r'$\log_{10}(T_{\rm eff}/{\rm K})$',r'$\log_{10}(L/L_\odot)$')]:
 fig,ax=plt.subplots(figsize=(8,6),layout='constrained');ax.scatter(xx,yy,s=14,c='#263238',alpha=.5,label=f'Eker et al. 2018 (N={len(a)})')
 for gi,(gn,mask) in enumerate(groups):
  fit=np.polyfit(xx[mask],yy[mask],1);grid=np.linspace(xx[mask].min(),xx[mask].max(),100)
  ax.plot(grid,np.polyval(fit,grid),color=COLORS[gi],ls=['--','-',':'][gi],lw=2,label=f'{["All 442 rows","M <= 1.1 solar","M > 1.1 solar"][gi]}: slope {fit[0]:.3f}')
 ax.set(xlabel=xlabel,ylabel=ylabel,title='Main-sequence sample: ordinary least squares');ax.legend()
 if name=='temperature-luminosity':ax.invert_xaxis();ax.text(.02,.03,'Temperature inferred from L and R; axes share L.',transform=ax.transAxes,fontsize=10,color='#263238')
 save(fig,'eker-'+name)
# Planck spectra, SI units, no per-curve normalization.
h=6.62607015e-34;k=1.380649e-23;c=299792458.
for domain in ['frequency','wavelength']:
 fig,ax=plt.subplots(figsize=(8,6),layout='constrained')
 bmax=0.
 for j,T in enumerate([300,1000,4000,7000]):
  if domain=='frequency':q=np.logspace(10,16,1800);z=h*q/(k*T);b=2*h*q**3/c**2/np.expm1(np.minimum(z,700));xl='Frequency (Hz)';yl=r'$B_\nu$ (W m$^{-2}$ sr$^{-1}$ Hz$^{-1}$)'
  else:q=np.logspace(-8,-2,1800);z=h*c/(q*k*T);b=2*h*c**2/q**5/np.expm1(np.minimum(z,700));xl='Wavelength (m)';yl=r'$B_\lambda$ (W m$^{-2}$ sr$^{-1}$ m$^{-1}$)'
  bmax=max(bmax,float(b.max()));valid=z<600;ax.loglog(q[valid],b[valid],color=COLORS[j],ls=['-','--','-.',':'][j],lw=2,label=f'{T} K')
 ax.set(xlabel=xl,ylabel=yl,title='Planck spectral radiance',ylim=(bmax*1e-12,bmax*2));ax.legend();save(fig,'planck-'+domain)
report={'data_sources':{'gaia':'https://box.nju.edu.cn/f/75309dd52409473c8e83/','eker':'https://box.nju.edu.cn/f/84549dadfc194847a8e0/'},'gaia_N':len(gaia),'gaia_HR_N':int(hr_ok.sum()),'gaia_HR_missing_N':int((~hr_ok).sum()),'gaia_missing_code':-99.9,'eker_N':len(a),'filter':'Colour-magnitude uses all 226635 rows. Physical HR excludes source sentinel -99.9 in logT/logL. Eker retains all 442 finite rows, no outlier rejection','estimator':'Unweighted OLS in base-10 logarithms; row-level OLS slope SE','temperature':'log10(T/K)=log10(5772)+(logL-2logR)/4; inferred from L and R','fits':fits}
(P/'observational-results.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report,indent=2))
