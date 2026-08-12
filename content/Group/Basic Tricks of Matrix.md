
>[!def] Matrix units
>- The matrix units are the simplest nonzero matrices. The $m\times n$ matrix unit $e_{ij}$ has a 1 in the $i,j$ position as its only nonezero entry :
>$$e_{ij} =
\begin{array}{cc}
 & j \\
i & \left[ \begin{matrix}
 & \vdots & \\
\dots & 1 & \dots \\
 & \vdots &
\end{matrix} \right]
\end{array}
>$$
>- Especially, when the matrix is a column vector, $e_{i}$ is the *standard basis*. 

^70ece7

The set of matrix units is called a basis for the space of all $m\times n$ matrices, because every $m\times n$ matrices $A=(a_{ij})$ is a linear combination of the matrices $e_{ij}$:
$$
A = \sum_{i,j} a_{ij} e_{ij}
$$
>[!done] The formulas for multiplying matrix units and standard basis vectors are
>$$
>e_{ij}e_{j} = e_{i} ,\quad \text{and} \quad e_{ij} e_{k} = 0 \ \text{if}\  j\neq k
>$$




