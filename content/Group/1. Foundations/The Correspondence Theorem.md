Let's first think about an important example.
# The symmetric group $S_{4}$

By definition, [[1. Basic Definitions and Examples#^0f43e9|the symmetric group]] $S_{4}$ contains all permutations on the index set $\{ \mathbf{1,2,3,4} \}$. Since its order is $4! = 24$, we need an efficient way to analyze the structure.

## 1. The homomorphism from $S_{4}$ to $S_{3}$
There are three ways to partition the set of four indices $\{ \mathbf{1,2,3,4} \}$ into pairs of subsets of order two, namely
$$
\Pi_{1}:\{ \mathbf{1,2} \}\cup \{ \mathbf{3,4} \},\quad\Pi_{2}:\{ \mathbf{1,3} \}\cup \{ \mathbf{2,4} \},\quad\Pi_{3}:\{ \mathbf{1,4} \}\cup \{ \mathbf{2,3} \}
$$

| $S_3$ 中的像 | $S_4$ 中的原像 |
|---|---|
| $e$ | $e,\ (12)(34),\ (13)(24),\ (14)(23)$ |
| $(12)$ | $(23),\ (14),\ (1243),\ (1342)$ |
| $(13)$ | $(13),\ (24),\ (1234),\ (1432)$ |
| $(23)$ | $(12),\ (34),\ (1324),\ (1423)$ |
| $(123)$ | $(234),\ (124),\ (132),\ (143)$ |
| $(132)$ | $(243),\ (123),\ (134),\ (142)$ |

## 2. Correspondence

>[!def] $\varphi(H)$, $\varphi^{-1}(\mathcal{H})$
>Let $H$ be a subgroup of $G$, and $K$ be the kernel. $\varphi :G\to\mathcal{G}$ is a homomorphism. Then the notation $\varphi(H)$ denotes the image of $H$, $\varphi^{-1}(\mathcal{H})$ denotes the inverse image of $\mathcal{H}$.

>[!done] Preimage of a subgroup image: $\varphi^{-1}(\varphi(H))=H\ker\varphi$
>Let $H$ be a subgroup of $G$, and $K$ be the kernel. $\varphi :G\to\mathcal{G}$ is a homomorphism. Then $\varphi^{-1}(\varphi(H))=HK$.

Recall what we saw in $S_{3}$. There is essentially 2 types of non-trivial permutations in $S_{3}$, 
