> [!practice] Exercise 12.3 Partitions and Normal Subgroups
> Let $P$ be a partition of a group $G$ with the property that for any pair of elements $A, B$ of the partition, the product set $AB$ is contained entirely within another element $C$ of the partition. Let $N$ be the element of $P$ that contains $1$. Prove that $N$ is a normal subgroup of $G$ and that $P$ is the set of its cosets.

**Proof**. 
0. Observations. 
	1. Consider $AN$ and $NA$. $\forall a\in A, \ a\cdot 1\in AN\subseteq C\implies a\in C$. Due to disjointness, $C=A$. So $AN\subseteq A$. On the other hand, $A\subseteq AN$. So $A=AN$. Similarly, $A=NA$.
1. Firstly prove $N\leq G$. 
	1. **Identity**. $1\in N$.
	2. **Inverse**. Let $n\in N$. Suppose $n^{-1}\in A$. Then $1=n\cdot n^{-1}\in NA=A\implies A=N$. So $n^{-1}\in N$
	3. **Closure**. Let $n_{1},n_{2}\in N$. Then $n_{1}n_{2}\in N N=N$.
2. Secondly prove the partition's elements are cosets, which means $\forall a\in A\subseteq G,\ aN=A$ and $Na=A$. 
	- Since $AN=A$, we have $aN\subseteq AN=A\implies aN\subseteq A$.
	- Let $a^{-1}\in B\in P$. Then $1=a^{-1}\cdot a\in BA\subseteq N$. So $a^{-1}x\in N$ for $\forall x\in A$, then $x=a(a^{-1}x)\in aN$. So $A\subseteq N$.
	- Similarly, $Na=A$.
3. Finally prove $N$ is normal. From above we know $aN=Na$ for $\forall a\in G$. So $N$ is normal.

