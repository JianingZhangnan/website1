考虑一个系统，其在 $t$ 时刻的态为 $\ket{\psi(t)}$. 下面在不需要单独考虑事件的时候记为 $\ket{\psi}$。设该系统的一个可观测量为 $O$，其本征态集合为 $\ket{i}$. 则

$$
O\ket{i} =O_{i}\ket{i} ,\quad O_{i}\text{ 是 } O \text{ 的本征值}
$$
$$
\langle i|j \rangle = \delta_{ij},\quad \sum_{i}\ket{i} \bra{i} =I
$$
$$
\langle O \rangle  = \sum_{i}O_{i}\lvert \langle i|\psi \rangle  \rvert ^{2} = \sum_{i}O_{i}\langle i|\psi \rangle \langle \psi|i \rangle = \sum_{i}\bra{i} (O\ket{\psi }\bra{\psi}  )\ket{i}  = \mathrm{Tr}(O\rho )
$$

> [!def] 纯态的密度矩阵
> 其中 $\rho=\ket{\psi}\bra{\psi }$ 为**密度矩阵** (Density Matrix)

>[!danger]- 未考虑简并
>按理来说，对于本征值 $O_{i}$，是有可能存在多个简并本征态的，每个态 $\ket{i}$ 都应有一个简并度 $g_{i}$. 因此应该实际表述成 $O\ket{i,\alpha}=O_{i}\ket{i,\alpha }$. 但是我们可以在简并子空间内选择一组正交基，然后统一用 $\ket{i,\alpha }$ 表示完备正交基。这样最后的结果是不变的，但是写法较为繁杂，因此直接使用 $\ket{i}$ 来表述了，以后若要区分，再单独写。

> [!done] 迹的循环性与期望值的表象无关性
> 迹的性质： $\mathrm{Tr}(AB)=\mathrm{Tr}(BA)$,  这是因为 $\mathrm{Tr}(AB)=A_{ij}B_{ji}=B_{ji}A_{ij}=\mathrm{Tr(BA)}$.
> 所以从上式可以很容易看出期望是 **表象无关** 的：
> $$
> \langle O \rangle  = \mathrm{Tr}(O\rho) = \mathrm{Tr}(U^{\dagger}UOU^{\dagger}U\rho) = \mathrm{Tr}(UOU^{\dagger} \ U\rho U^{\dagger})=\mathrm{Tr}(O'\rho')=\langle O' \rangle 
> $$

**纯态** 的密度矩阵有以下5条性质：
1. 