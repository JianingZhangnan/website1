---
title: "GTCRN"
excalidrawScene: "assets/scenes/GTCRN.json"
---

> [!info] 只读互动绘图
> 可平移、缩放、适应画布、全屏、切换主题并打开公开链接；网页不提供编辑、保存或导出。

# conv1

```python
ConvBlock(
    in_channels=9,
    out_channels=16,
    kernel_size=(1,5),
    stride=(1,2),
    padding=(0,2)
)
```


# conv2

```python
ConvBlock(
    16, 16,
    kernel_size=(1,5),
    stride=(1,2),
    padding=(0,2),
    groups=2
)
```
