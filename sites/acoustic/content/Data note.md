---
title: "Data note"
---

# VoiceBank

## 概况
[Voice Bank Corpus](https://datashare.ed.ac.uk/items/30e7453c-9ea8-48b4-8e18-f96d0dc62928?) 是由英国 **爱丁堡大学 CSTR**（Centre for Speech Technology Research，语音技术研究中心）建设的英语多说话人语音库。VCTK 的目的原本主要是多说话人语音合成。GTCRN 和 LiSenNet 使用的 **VoiceBank+DEMAND** 是 Cassia Valentini-Botinhao 等人基于 Voice Bank 制作的语音增强数据集，他们从Voice Bank 取 clean speech，再加入各种噪声生成与之严格对应的 noisy speech。

数据本身是成对的 wav 文件，采样率 48kHz：

```bash
clean_trainset_28spk_wav/
    p226_001.wav
    p226_002.wav
    p226_003.wav
    ...

noisy_trainset_28spk_wav/
    p226_001.wav
    p226_002.wav
    p226_003.wav
    ...
    
clean_testset_wav/
	p232_001.wav
	p257_001.wav
	...
	
noisy_testset_wav/
	...
```

总共四个文件夹，clean 和 noisy 分别都有 trainset 和 testset。
- trainset 文件夹名字中的 `28spk` 代表有 28 个说话人，14男14女，每个人大约 400 句话；原论文给 clean speech 加入 10 种噪声，其中 2 种是人工产生的 speech-shaped noise 和 babble，另外 8 种来自 DEMAND，包括厨房、会议室、cafeteria、restaurant、subway、car、metro、traffic intersection 等环境。
- testset 换成 另外 2 位没有参加训练的英格兰说话人，一男一女，ID 分别为232和257. 

| 目录                         |      WAV 数 |
| -------------------------- | ---------: |
| `clean_trainset_28spk_wav` | **11,572** |
| `noisy_trainset_28spk_wav` | **11,572** |
| `clean_testset_wav`        |    **824** |
| `noisy_testset_wav`        |    **824** |
上面表格是四个目录的wav数，可见，trainset 有11572条数据，testset 有 824 条数据。

## 使用

1. GTCRN 使用该数据集进行训练和测试。从 trainset 中抽取 1572 条作为 validation。以上数据全部重新采样到 16 kHz。
