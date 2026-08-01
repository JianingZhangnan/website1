## 1. Mount

首先创建目录：
```bash
mkdir -p ~/ov-demo/{lower,upper,work,merged}
cd ~/ov-demo
pwd
```

在 lower 文件夹里面放两个文件:
```bash
echo "I am file A from lower" > lower/a.txt
echo "I am file B from lower" > lower/b.txt
ls lower/
```

在挂载之前，merge、upper这些都是空的
```bash
ls merged/
```

执行挂载
```bash
sudo mount -t overlay overlay -o \
lowerdir=$(pwd)/lower,upperdir=$(pwd)/upper,workdir=$(pwd)/work $(pwd)/merged
```

验证：
```bash
ls merged/
ls upper/
```

![[fig2.1.png]]

## 2. 观察Copy-up
![[fig2.2.png]]
