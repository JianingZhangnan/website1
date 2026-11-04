> [!def] Pauli 算符与自旋算符
> $$
> \hat{\boldsymbol{S}} = \dfrac{\hbar}{2} \hat{\boldsymbol{\sigma}} \Longleftrightarrow \hat{S}_{i}=\dfrac{\hbar}{2}\hat{\sigma}_{i}
> \quad \ (i=x,y,z\ \text{ or }\ 1,2,3)
> $$

>[!def] Pauli Matrices
> 
> $$
> X(:=\sigma_{x}:=\sigma_{1})=\begin{pmatrix}
> 0 & 1 \\
> 1 & 0
> \end{pmatrix},\quad Y=\begin{pmatrix}
> 0 & -\mathrm{i}  \\
> \mathrm{i} & 0
> \end{pmatrix},\quad Z=\begin{pmatrix}
> 1 & 0 \\
> 0 & -1
> \end{pmatrix}
> $$
> $$
> \boldsymbol{\sigma }=X \hat{x}+Y\hat{y}+Z\hat{z}=\begin{pmatrix}
> \hat{z} & \hat{x}-\mathrm{i}\hat{y} \\
> \hat{x}+\mathrm{i}\hat{y} & -\hat{z}
> \end{pmatrix}
> $$


> [!done] Pauli 算符的对易与平方关系
> $$
> [\hat{S}_{i},\hat{S}_{j}] = \mathrm{i}\hbar\epsilon_{ijk}\hat{S}_{k}\implies [\hat{\sigma}_{i},\hat{\sigma}_{j}] = 2\mathrm{i}\epsilon_{ijk}\hat{\sigma}_{k}
> $$
> $$
> \hat{\boldsymbol{S}}^{2} = \dfrac{3}{4}\hbar^{2}\boldsymbol{I} \implies  \hat{\boldsymbol{\sigma}}^{2}=3\boldsymbol{I},\ \ \hat{\sigma}^{2}_{i} =\boldsymbol{I}
> $$


> [!done] Pauli 代数的等价关系
> 数学上，这三条性质可以互相导出（1->2,3 | 3->1,2 | 2不可单独）：
> 1. $[A_{i},A_{j}]=2\mathrm{i}\epsilon_{ijk}A_{k}\ ,\ A_{i}^{2}=I$
> 2. $\{ A_{i},A_{j} \}=2\delta_{ij}\boldsymbol{I}$
> 3. $A_{i}A_{j} = \delta_{ij}\boldsymbol{I}+\mathrm{i}\epsilon_{ijk}A_{k}$

