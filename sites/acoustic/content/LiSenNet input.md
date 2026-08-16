---
title: "LiSenNet input"
---

![[assets/files/papers/LiSenNet_paper.pdf#page=2&rect=41,632,209,758|LiSenNet, p.2]]

上图截取自论文。上图中 STFT 后产生的复数频谱输出三条特征：
1. 压缩振幅 $|A|^{c}$, 压缩的目的是让振幅较低的声音也能有可观的输入特征。
2. 相位差分布
	1. 相邻 time frame 的相位差 $\Delta_{t}P(t,f) = P(t,f)-P(t-1,f)-2\pi f \dfrac{Q}{M}$
	2. 相邻 frequency bin 的相位差 $\Delta_{f}P(t,f) = P(t,f)-P(t,f-1)$.

其中相邻 time frame 的相位差最后减去一项 $2\pi f \dfrac{Q}{M}$ 的具体推导如下：

>[!note] detailed derivation
> 
> 假定信号的频率恰好落在第 $f$ 个频率 bin 上，其角频率为 $\omega=\dfrac{2\pi f}{N_{FFT}}$. 注意，这里 $f$ 并不表示频率，而是表示频率 bin。由于没有像 GTCRN 那样先进行了 ERB 压缩，所以这里的频率 bin 是均匀分布的。 记$M$ 表示帧长(Frame length / Window size)，指的是每一帧包含的的样本数量，在这里等于 FFT 点数(实际代码中均取值为512)，即 $M=N_{FFT}$.  则离散信号可以表示为：
> 
> $$
> x[n] = \mathrm{e}^{ j 2\pi fn/M }
> $$
> 在第 $t$ 帧，STFT 计算公式为
> $$
> X(t,f) = \sum_{n=0}^{M-1} x[tQ+n] \cdot w[n] \cdot \mathrm{e}^{ -j2\pi fn/M } = \mathrm{e}^{ j\cdot 2\pi ft Q/M }\sum_{n=0}^{M-1} w[n] 
> $$
> 其中 $Q$ 指的是相邻两帧的滑动步长。
> 则相邻两帧的相位差就是 
> $$
> P_{x}(t,f)-P_{x}(t,f-1) = 2\pi f \dfrac{Q}{M}
> $$
> 可以看出，即使是一个完全稳定、没有任何物理状态变化的纯音信号，仅仅因为 STFT 的分析窗口在时间轴上向右平移了 $Q$ 个样本，算法计算出的相位结果也会自动增加一部分，所以要把这部分减去。


画出图像长下面这个样子：

![[assets/files/informations/assets/LiSenNet/input_features.png]]
