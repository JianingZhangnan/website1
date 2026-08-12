>[!def] homomorphism
>Let $G$ and $G'$ be groups, written with multiplicative notation. A *homomorphism* $\varphi:G\to G'$ is a map from $G$ to $G'$ such that for all $a$ and $b$ in G,
>$$
>\varphi(ab) = \varphi(a)\varphi(b)
>$$

>[!example] 
>- the determinant function det: $GL_{n}(\mathbf{F})\to \mathbf{F}^{\times },\quad \mathbf{F} = \mathbf{C},\mathbf{R},\mathbf{Q}$ any field.
>-  the sign homomorphism $\sigma:S_{n}\to \{ +1,-1 \}$ that sends a permutation to its sign.
>- the exponential map exp: $\mathbb{R}^{+}\to \mathbb{R}^{\times }$ defined by $x\to \mathrm{e}^{ x }$

>[!done] Proposition 2.5.3
>Let $\varphi : G \to G'$ be a group homomorphism.
>
>(a) If $a_1, \dots, a_k$ are elements of $G$, then $\varphi(a_1 \cdots a_k) = \varphi(a_1) \cdots \varphi(a_k)$.  
>(b) $\varphi$ maps the identity to the identity: $\varphi(1_G) = 1_{G'}$.  
>(c) $\varphi$ maps inverses to inverses: $\varphi(a^{-1}) = \varphi(a)^{-1}$.

>[!def] image and kernel
>- The *image* of a homomorphism $\varphi: G \to G'$, often denoted by $\mathrm{im}\,\varphi$, is simply the image of $\varphi$ as a map of sets:
>$$
>\mathrm{im}\,\varphi = \{ x \in G' \mid x = \varphi(a) \text{ for some } a \text{ in } G \}, \tag{2.5.4}
>$$
>Another notation for the image would be $\varphi(G)$.
>
>- The *kernel* of a homomorphism is more subtle and also more important. The kernel of $\varphi$, often denoted by $\ker \varphi$, is the set of elements of $G$ that are mapped to the identity in $G'$:
>$$
>\ker \varphi = \{ a \in G \mid \varphi(a) = 1 \}. \tag{2.5.5}
>$$
>The kernel is a subgroup of $G$ because, if $a$ and $b$ are in the kernel, then $\varphi(ab) = \varphi(a)\varphi(b) = 1 \cdot 1 = 1$, so $ab$ is in the kernel, and so on.

Here we can recall that in a vector space, there are two very similar concepts, [[3B Null Spaces and Ranges#^862fcf|null space]] and [[3B Null Spaces and Ranges#^b78918|range]]. Actually, a **vector space** over a field $\mathbf{F}$ with addition $+$ is a **abelian group** $(V,+)$. What uniquely distinguishes a vector space is scalar multiplication.

