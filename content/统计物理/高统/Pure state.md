> [!def] 纯态与混合态(Pure state and mixture state)
> 设有两个系统 A 和 B，均包含大量的粒子，这些粒子是独立的相同粒子。粒子有两个本征态（自旋）， $\ket{0}$ 和 $\ket{1}$. 系统 A 中的粒子全都是处于态 $\ket{a}=\dfrac{\ket{0}+\ket{1}}{\sqrt{ 2 }}$，系统 B 中的粒子有一半处于 $\ket{b_{1}}=\ket{0}$，一半处于 $\ket{b_{2}}=\ket{1}$. 现在对两个系统分别抽样测量 $S_{z}$，虽然大量试验后，两个系统测得 $\pm \dfrac{\hbar}{2}$ 的概率都是 0.5，但是 A 是量子叠加态造成的，所以是纯态；B是经典统计，所以是混合态。从这个分析可以看出，纯态于混合态的概念只在统计上有意义，对于单体来说是没有意义的（因为单体必然是纯态。当然，你可以考虑一个系统，其制造单个粒子，在不同态有一个经典的统计分布，但是这样的粒子进行单次测量是无法得出其是纯态还是混合态的，如果想观察出来，必须制造大量粒子进行观测，这依然是一个大量粒子的统计问题）。

## Example
Consider two qubits, each prepared in the $\ket{+}$ eigenstate of the Pauli-$X$ operator, yielding the joint state $\ket{++}$. Consider two operations:
1. A joint measurement of $Z_{1}Z_{2}$ (parity measurement), whose result is $+1$.
2. A separate measurement of $Z_{1}\otimes I_{2}\cdot I_{1}\otimes Z_{2}$, and the product of the result is $+1$.
, whose result is mmk$+1$
What will the state turn into when the observation completated?

Firstly, from [[基础公设#^020251|The Measurement Postulate]] we know the state would collapse to the eigenstates of observations. 
$$
\ket{++} = \dfrac{1}{2}(\ket{0}+\ket{1})\otimes (\ket{0}+\ket{1})=\dfrac{1}{2}(\ket{00}+\ket{11}+\ket{01}+\ket{10})
$$
$$
Z_{1}Z_{2}\ket{++} = \dfrac{1}{2}(\ket{00}+\ket{11}-\ket{01}-\ket{10})
$$
So there's $50\%$ probility to get a $+1$ result, $25\% \ \ket{00}$ and $25\%\ket{11}$. Since we know the result is $+1$, so there's $50\% \ \ket{00}$ and $50\%\ \ket{11}$. This is a classical probility, not quantum.

For the second case, 
$$
\begin{align}
Z_{1}\ket{++}  & = \dfrac{1}{2}(\ket{00}+\ket{01}-\ket{10}-\ket{11}) \\
Z_{2}\ket{++} & = \dfrac{1}{2}(\ket{00}+\ket{10}-\ket{01}-\ket{11})
\end{align}
$$
- $25\%\ \ket{00}$: $z_{1}\cdot z_{2}=1\cdot1=1$
- $25\%\ \ket{01}$: $z_{1}\cdot z_{2}=1\cdot(-1)=-1$
- $25\% \ \ket{10}$: $z_{1}\cdot z_{2}=-1\cdot(1)=-1$
- $25\%\ \ket{11}$: $z_{1}\cdot z_{2}=(-1)\cdot(-1)=1$
So 

$$
P(\omega) = \langle\psi| P_\omega |\psi\rangle = \sum_{i=1}^{g} |\langle\omega, i|\psi\rangle|^2
$$
$$
|\psi_{\text{after}}\rangle = \frac{P_\omega |\psi\rangle}{\sqrt{\langle\psi| P_\omega |\psi\rangle}}
$$

