---
title: "BM and ERB"
---

![[assets/files/informations/assets/03_BM_ERB_visualization.png|856]]

- STFT 后，时频 magnitude spectrugram （左上图）的横轴是时间，纵轴是真实频率 (0-8kHz)。 `n_fft=512`，采样率 16kHz. 共有 512/2+1=257 个 bin 。每个bin 间隔 31.25 Hz.  
- 听音频，BM再BS后的音频听起来略微闷一点。
- 左下图是 ERB 矩阵的示意图，每个merged bin 都是原始 bins 的加权和。
