---
title: "语音增强算法研究报告"
description: "三种语音增强算法的复现、结构分析与统一测试报告"
---

# 概况

- [x] 已完成对三种算法模型的部署、训练、推理测试，并进行了部分 ablation study. 
- [x] 三个模型的架构图画在:
	- [x] [[GTCRN]]
	- [x] [[LiSenNet]]
	- [x] [[DeepFilterNet2]]
- [x] 论文复现概况：
	- [x] [[assets/files/papers/GTCRN_paper.pdf]]：采用论文中所使用的 [[Data note#VoiceBank|Voice Bank + DEMAND]] 数据进行训练和推理，成功复现相应的指标。并另外进行了一些 ablation study，详见下文。
	- [x] [[assets/files/papers/LiSenNet_paper.pdf]]：同样采用论文中所使用的 VoiceBank+DEMAND 数据完成了训练和推理，也复现了相应指标。同时对 Noise Detector 进行了独立复现与验证。没有进一步的深度 ablation. 
	- [x] [[assets/files/papers/DEEPFILTERNET2.pdf]]: 采用了官方开源权重进行推理测试。初始尝试使用小部分数据进行训练，效果不太好；完整训练需要较长时间（约4到5 天），故暂时未做。
- [x] 对比测试概况（表格）：

| 模型                      |   原生采样率  |   可训练参数 | 实测 MAC/s 音频 |    WB-PESQ |       STOI |       SI-SNR | CPU 单线程 RTF | RTX 5060 Ti RTF |
| ----------------------- |  -----:  | -----------: | ----------: | ---------: | ---------: | -----------: | ----------: | --------------: |
| **Noisy**               |  16 kHz  |            — |           — |     1.9678 |     0.9211 |      8.45 dB |           — |               — |
| **GTCRN**               |  16 kHz  | **23.669 K** | **31.97 M** |     2.8667 |     0.9396 | **18.61 dB** |     0.00913 |         0.00319 |
| **LiSenNet**            |  16 kHz  | **36.783 K** | **55.77 M** | **3.0833** |     0.9365 |     13.06 dB | **0.00856** |     **0.00284** |
| **DeepFilterNet2 官方权重** |  48 kHz  |  **2.306 M** | **360.2 M** |     3.0554 | **0.9442** |     15.72 dB |     0.01595 |         0.17328 |


# 三种算法的网络结构分析

三种算法中，GTCRN 和 LiSenNet 有明显的轻量化特征，而 DeepfilterNet2 更强调高采样率下的高保真度。三种算法的大致流程都是先做 STFT，输出复数频谱特征，利用卷积神经网络及其变种作为 encoder 和 decoder，最后预测 mask。下面在不同部分进行对比

## 1. 输入特征

这里的输入特征指的是 STFT 后输入到 encoder 以及其他部分的特征。

GTCRN 的 input tensor shape 为 `[B,3,T,257]`，这里 B 指的是 batch size，T 指的是 time frames。3 指的是 STFT 频谱的振幅、实部、虚部三个 feature，作为通道数。257 是频率 bin 数。

LiSenNet 的 input tensor shape 也为 `[B,3,T,257]`, 不过这里的 3 个 feature 分别是压缩振幅、时间方向的相位差分布、频率方向的相位差分布（具体计算方式和图像参见[[LiSenNet input]]）.  此处 LiSenNet 的处理策略相当于是人为抽取出需要学习的特征，即相位分布；而GTCRN 则是相让网络自己从实部、虚部中学习。

DeepfilterNet2 的输入方式与前二者有较大差异。它是双路输入，分为 stage 1 和 stage 2. 在官方配置下，48 kHz 音频经过 `n_fft=960`的 STFT 后，得到完整的复数频谱。stage 1 做EBR，只读取振幅信息；stage 2 做低频 deep filter，读取低频 96 bins 的实部和虚部。

## 2. 频率的维度压缩

为了减少计算复杂度，三种算法均使用了频率压缩技术，但是具体细节不尽相同。

GTCRN 的 STFT 输出有 257 个 frequency bins，然后将这 257 个 bins 分成 65 个低频 bins 和 192 个高频 bins，然后对这 192 个高频 bins 用 EBR 压缩到 64 个 EBR bands。最后总共输入 encoder 的 frequency 维数有 65+64=129 个。具体图像和分析见 [[BM and ERB]].

LiSenNet 的频率压缩不是使用 ERB. 准确来说在进入 encoder 之前就没有专门对频率进行维度压缩，LiSenNet 是直接将原始 257 bins 数据做 encode，在 encode 的过程中进行高频压缩。准确来说是采用了**非均匀**下采样卷积层，低频部分步长为1，高频部分步长为3.

DeepfilterNet2 在 stage 1 使用 ERB 压缩，并且策略比较激进，直接从原始的 481 个 bins 压缩到 32 个EBR bands。这是由于其 stage 1 只是对整体包络形状做修正，不要求很细的粒度。

## 3. 时频建模模块

GTCRN 和 LiSenNet 都是 `encoder -> core module -> decoder` 的架构，只不过GTCRN 使用的是 G-DPRNN，LiSenNet使用的是DPR。而 DeepFilterNet2 的结构较为复杂，其核心时频模块 GRU 是融合在 encoder 和 decoder 中的。

GTCRN 的 G-DPRNN 先做 frequency modeling，再做 temporal modeling。Frequency path 在同一个 frame 内沿 frequency 方向使用双向 GRU，因为同一时刻的完整频谱已经获得；temporal path 沿时间方向使用单向 GRU，从而保证 causal。这里的 G 表示 grouped：channel 被拆成两组分别送入更小的 GRU，最后再拼接，因此能显著减少参数。两个 G-DPRNN 的输入输出 shape 都是 `[B,16,T,33]`，它改变的是 feature 内容而不是 tensor size。

LiSenNet 的 DPR 与此很像，也是先沿 frequency、再沿 time 建模；论文中一共重复 2 次。不同之处是 LiSenNet 不使用 grouped RNN，而是在 DPR 中另外加入 ConvGLU 做 channel mixing。ConvGLU 里面的 depthwise convolution 负责聚合邻近信息，gate 控制这些 feature 的保留比例。

DeepFilterNet2 从整体图上看是 encoder 后直接分到 ERB decoder 和 DF decoder，但是这不代表它没有 temporal modeling。更详细的网络图中，encoder 里面有 GLinear + GRU，两个 decoder 中也分别有 GRU。这里 GLinear 指 grouped linear layer，即把频率 feature 分组做线性变换，减少普通 fully-connected layer 的参数量和计算量。因此 DeepFilterNet2 的主要区别不是“没有时序模块”，而是没有像 G-DPRNN/DPR 那样单独放一个 bottleneck，GRU 是分散在 encoder 和 decoder 内部的。

## 4. Loss 函数设计

GTCRN 的 loss 同时比较 waveform 和 spectrogram。
![[assets/files/papers/GTCRN_paper.pdf#page=3&rect=43,72,305,274|GTCRN, p.3]]

我们的训练代码写成 `70*Lmag + 30*(Lreal+Limag) + LSISNR`，相当于把论文 loss 整体乘了 100，不改变各分项相对权重。

LiSenNet 的主模型 loss 为 $L=0.9L_{mag}+0.1L_{comp}+0.05L_{pesq}$。$L_{mag}$ 约束 magnitude，$L_{comp}$ 同时考虑 complex spectrum；$L_{pesq}$ 使用一个 discriminator 学习预测 PESQ，再让主模型向更高 PESQ 的方向优化，因此它相比 GTCRN 更直接地把 perceptual quality 写进了训练目标。如果启用 Noise Detector，还会额外使用 BCE loss，不过这个 BCE 主要训练 ND，不是主增强网络本身的 loss。

DeepFilterNet2 使用 spectrogram loss 和 multi-resolution spectrogram loss：$L=\lambda_{spec}L_{spec}+\lambda_{MR}L_{MR}$。前者在模型自身的 STFT resolution 下比较 enhanced 与 clean，后者先还原到 waveform，再用多个不同 window size 的 STFT 重新比较。这样可以避免模型只在某一种 STFT 划分下拟合得好。

# 性能对比测试

## 1. 测试方法

三篇论文原始实验的数据集、采样率和评价流程并不完全相同，所以不能直接拿论文中的数字做严格横向比较。本项目另外做了一次统一测试：三种模型对同一批 824 条 VoiceBank+DEMAND test utterances 做增强，并用同一套程序计算 WB-PESQ、STOI 和 SI-SNR。GTCRN、LiSenNet 原生是 16 kHz；DeepFilterNet2 原生在 48 kHz 下推理，然后做固定时延补偿并重采样到 16 kHz，再和同一 clean reference 计算质量指标。DeepFilterNet2 的 MAC 仍然按原生 48 kHz 系统统计。

运行速度另外固定抽取 100 条音频，共 253.29 s，在同一台电脑上测试。CPU 固定单线程，GPU 使用 RTX 5060 Ti。RTF 定义为“实际计算时间 / 音频时长”，因此 RTF<1 即可实时运行，例如 RTF=0.01 表示处理 1 s 音频平均需要约 10 ms 计算时间。

## 2. 结果分析

最前面的表格就是这次统一测试的最终结果。Noisy 输入平均为 PESQ=1.9678、STOI=0.9211、SI-SNR=8.45 dB，三种模型都明显改善了 noisy speech，但是三个指标的排序不同。

LiSenNet 的 WB-PESQ=3.0833，是三者最高；DeepFilterNet2=3.0554，与 LiSenNet 很接近；GTCRN=2.8667。逐条 paired bootstrap 中，LiSenNet 相对 DeepFilterNet2 的 PESQ 平均只高 0.0279，95% CI 为 `[0.00375,0.05125]`，而且 LiSenNet 只在约 50.5% 的样本上 PESQ 更高，因此两者在 PESQ 上可以认为非常接近。

STOI 则是 DeepFilterNet2 最高，为 0.9442；GTCRN 为 0.9396；LiSenNet 为 0.9365。SI-SNR 的排序基本相反：GTCRN 最高，为 18.61 dB；DeepFilterNet2 为 15.72 dB；LiSenNet 为 13.06 dB。这说明 PESQ、STOI、SI-SNR 衡量的不是同一个东西，不能只用一个指标判断“去噪效果最好”。

从资源占用看，GTCRN 和 LiSenNet 分别只有 23.669 K、36.783 K parameters，而 DeepFilterNet2 为 2.306 M；MAC 分别为 31.97 M、55.77 M、360.2 M/s。CPU 单线程 RTF 分别为 0.00913、0.00856、0.01595，三者在本机上都远快于实时。LiSenNet 的 MAC 比 GTCRN 高，但 CPU RTF 反而略低，说明 MAC 只能描述理论计算量，不能直接等同于真实运行时间。

GPU 上 GTCRN、LiSenNet 的 RTF 分别为 0.00319、0.00284；DeepFilterNet2 的当前 PyTorch 路径为 0.17328，反而比 CPU 慢。这一现象在换成官方权重后仍然存在，因此主要是当前实现/算子路径的问题，不是模型权重的问题。

## 3. 与论文结果的复现程度

GTCRN 论文在 VoiceBank+DEMAND 上报告 PESQ=2.87、STOI=0.940、SI-SNR=18.83 dB；本次统一测试为 2.8667、0.9396、18.61 dB，基本复现。

LiSenNet 论文报告 PESQ=3.07、STOI=0.939；本次为 3.0833、0.9365，也比较接近。PESQ 略高、STOI 略低. 

DeepFilterNet2 用官方自己的 VoiceBank 评价流程时，实测 PESQ=3.07649、STOI=0.94295，基本对应论文的 3.08、0.943。

# Ablation study

## 1. G-DPRNN 数量

为了判断 G-DPRNN 是否真的有作用，分别从头训练了 0、1、2 个 G-DPRNN 的模型，其余训练条件保持一致，并按 validation PESQ 选择 best checkpoint，最后在全部 824 条 test utterances 上测试。

| G-DPRNN 数量 | 参数量 | test PESQ | test STOI | test SI-SNR |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 15.285 K | 2.7846 | 0.9361 | 18.47 dB |
| 1 | 19.477 K | 2.8370 | 0.9398 | 18.53 dB |
| 2 | 23.669 K | **2.8661** | **0.9403** | **18.63 dB** |

结果显示，0 -> 1 -> 2 个 G-DPRNN 时三个指标总体都提高，尤其 PESQ 从 2.7846 提高到 2.8661。因此 G-DPRNN 确实是 GTCRN 中比较关键的模块；同时从 1 到 2 的增益已经小于从 0 到 1，继续增加数量未必划算。

## 2. TRA 位置

进一步把 TRA 分成 encoder 和 decoder 两部分，比较 No TRA、Encoder only、Decoder only、Full TRA 四种情况。

| 结构 | Encoder TRA | Decoder TRA | 参数量 | test PESQ | test STOI | test SI-SNR |
| --- | :---: | :---: | ---: | ---: | ---: | ---: |
| No TRA | ✗ | ✗ | 15.365 K | 2.8544 | 0.9377 | **18.65 dB** |
| Encoder only | ✓ | ✗ | 19.517 K | 2.8210 | 0.9375 | 18.60 dB |
| Decoder only | ✗ | ✓ | 19.517 K | 2.8650 | 0.9393 | 18.62 dB |
| Full TRA | ✓ | ✓ | 23.669 K | **2.8792** | **0.9395** | 18.58 dB |

Full TRA 的 PESQ 和 STOI 最好，但是提升幅度不大；Encoder only 的 PESQ 甚至低于 No TRA，而 Decoder only 已经得到一部分收益。因此当前实验中 TRA 的作用比 G-DPRNN 弱，而且收益更偏向 decoder 侧。SI-SNR 在 No TRA 时反而略高，也说明不同指标不一定同步。

## 3. Skip connection

去掉 encoder-decoder 之间的 skip connection 后，824 条 test utterances 上得到 PESQ=2.8026、STOI=0.94135、SI-SNR=18.66 dB。与主模型约 2.87 的 PESQ 相比，去掉 skip 后 PESQ 有明显下降，但 STOI 和 SI-SNR 没有同步下降。因此 skip 的作用更像是减少 encoder 压缩过程中细节信息的损失，而不是保证所有指标同时提高。

## 4. 加入 LiSenNet 风格的 PD 输入

由于 LiSenNet 使用 time/frequency phase difference，而 GTCRN 原本使用 magnitude+real+imag，因此另外尝试把 PD feature 加入 GTCRN，并分别测试在 BM 前加入和 BM 后加入。

| 方案 | test PESQ | test STOI | test SI-SNR |
| --- | ---: | ---: | ---: |
| 原 GTCRN | **2.8667** | 0.9396 | 18.61 dB |
| PD before BM | 2.8271 | 0.9398 | 18.59 dB |
| PD after BM | 2.8219 | **0.9402** | **18.64 dB** |

两个 PD 版本都没有提高 PESQ，STOI 和 SI-SNR 只有很小变化。所以 LiSenNet 中 PD 有用，并不意味着把同样的 feature 直接加进 GTCRN 就一定有效。一个可能原因是 GTCRN 的 real/imag 本身已经包含完整 phase information，也可能是原网络的 channel 数、结构和 loss 都是围绕原输入设计的，简单增加 PD 不能直接利用。

## 5. LiSenNet Noise Detector

Noise Detector 单独训练后参数量为 18.142 K，在独立 test set 上 accuracy=0.9843、precision=0.9848、recall=0.9636、F1=0.9741，说明 frame-level noise detection 本身可以稳定工作。ND 的意义主要是噪声比例低时跳过 clean frame 上的主网络计算；它不是一个直接提高 PESQ 的 enhancement module。

# 总结

从网络结构上看，GTCRN 和 LiSenNet 更接近：都是 16 kHz STFT -> encoder 压缩 frequency -> dual-path core module -> decoder，只是在 input feature、frequency compression 和 phase 处理上不同。DeepFilterNet2 则是另一条路线，在 48 kHz 下把任务拆成 ERB envelope enhancement 和低频 deep filtering 两个 stage，GRU 分散在 encoder/decoder 中，而不是集中成独立的 DPR bottleneck。

从统一测试看，没有一个模型在所有指标上都最好。GTCRN 参数和 MAC 最低，并取得最高 SI-SNR；LiSenNet 仍然只有几十 K 参数，同时取得最高 PESQ；DeepFilterNet2 资源占用明显更高，但是原生处理 48 kHz full-band，PESQ 与 LiSenNet 很接近，同时 STOI 最高。三者在本机 CPU 单线程上都能远快于实时，所以实际选择更像是在采样率、资源占用、algorithmic delay 和不同质量指标之间做 trade-off。

从 GTCRN 消融来看，G-DPRNN 的收益最稳定；TRA 有收益但是幅度较小，并且 decoder 侧更重要；skip connection 对 PESQ 有明显作用；直接加入 LiSenNet 风格 PD 没有带来额外收益。这说明轻量化模型中的模块不能简单看成可以互相独立替换的组件，它们与 input representation、网络结构和 loss 之间存在比较强的耦合。
