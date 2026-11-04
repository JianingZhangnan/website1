# Zeroth Law of Thermodynamics
Thermal equilibrium is transitive. 

# First Law of Thermodynamics

Thermodynamics can be viewed as the macroscopic manifestation of statistical mechanics. Statistical mechanics is a theory used to analyze natural or spontaneous fluctuation behaviors. Even static macroscopic properties are connected to statistical theorems that govern dynamical fluctuations. For example, the equation of state of a dilute gas, $pV=nRT$, will be shown in Chapter 3 to be equivalent to the formula for the mean-square density fluctuation in a gas.

## 1.1 Discussion on state variables and extensive quantities
Definitions and concrete examples of state variables and extensive quantities can be found clearly in any good thermodynamics textbook, so we will not repeat them here.

State variables depend on the state of a system, while the state of a closed system is in turn defined through observable physical quantities—this may look like a circular argument. Following the usual practice in building a physical theory, what needs to be **pre-defined** is often grounded in experimentally established axioms. In thermodynamics, we define *state* **operationally**: we say that a state is the condition of a system in which a set of independently measurable quantities (such as $T, P, n$) take specific values. It is called operational because these independent variables are experimentally based and measurable in practice. A large body of experiments shows that once some finite set of parameters is fixed, any other property associated with the system is the same. In other words, a finite set of specific parameters (such as $T, P, n$) can completely characterize a system. This is an **empirical law** and the foundation of thermodynamics.

Because a state variable depends only on the state of the system and not on the path by which the system reached that state, we obtain a common method of theoretical derivation in thermodynamics: **if, for a particular thermodynamic process, we derive a differential equation that contains only state functions, then this differential equation holds for any process**. This effectively gives us additional constraints and confidence when carrying out mathematical reasoning. You will see many examples of this idea later.

The first state parameter to discuss is internal energy, i.e., the total energy of a system. We **assume** it satisfies two properties (both are experimental laws):
1. Internal energy is an extensive quantity.
2. Energy is conserved, and the change in internal energy satisfies the *first law of thermodynamics* $dE=d\hspace{-0.45em}{^-}Q+d\hspace{-0.45em}{^-}W$.

For the second point—why heat $Q$ and work $W$ are inexact differentials and why they are process quantities—most general physics textbooks provide a discussion, so we will not repeat it here. What we want to focus on is the first point: for some systems, it is not always valid. For example, in a thermodynamic system with electromagnetic fields, is internal energy still extensive? This involves the energy transformation when combining two systems into one. Suppose system 1 has energy $E_1$ and system 2 has energy $E_2$. If we bring them into contact and merge them into a single system, in principle the total energy of the combined system should include three terms: $E_0=E_1+E_2+E_s$, where $E_s$ is the binding energy between the two systems. Now let us examine this third term carefully. If we regard a system as a collection of a large number of particles, it is not hard to see that $E_s$ is simply the interaction energy between the two systems. For simple systems without electromagnetic interactions, intermolecular forces are short-ranged, such as van der Waals forces, so only some particles near the surface contribute to $E_s$. This contribution is so small that it can be treated as zero in macroscopic systems (just as in Newtonian mechanics we approximate when speeds are much smaller than the speed of light; this approximation is not “sloppy” but entirely reasonable). However, if electromagnetic interactions are present, the interaction potential of an electric dipole scales as $1/r^3$, while the total number of particles in a shell scales as $r^2$. Therefore, the integral shows that the interaction energy felt by a particle out to a distance $L$ is proportional to $\ln L$, which cannot be neglected. In this case, internal energy is not additive; it also depends on the shape of the system, and thus it is no longer an extensive quantity.

> [!NOTE]- Extensive quantities and homogeneous functions
>
> An extensive quantity scales linearly with the size of the system. Consider an extensive quantity expressed as a function of extensive variables:
> $$
> y=f(x_1,x_2,\dots,x_n)
> $$
> where both $y$ and $x_i$ are extensive. By definition of extensivity,
> $$
> y\bigg|_{\lambda \boldsymbol{X}}=\lambda y\bigg|_{\boldsymbol{X}}
> $$
> Let $u_i=\lambda x_i$, i.e.,
> $$
> f(u_1,\dots,u_n)=\lambda f(x_1,\dots,x_n)
> $$
> Differentiating this equation with respect to $\lambda$ gives
> $$
> \dfrac{\partial f}{\partial \lambda}=f
> $$
> On the other hand,
> $$
> \left(\dfrac{\partial f}{\partial \lambda}\right)_{x_i}
> =\sum_{i=1}^{n}\left(\dfrac{\partial f}{\partial u_i}\right)_{u_j}\dfrac{\partial u_i}{\partial \lambda}
> =\sum_{i=1}^{n}\dfrac{\partial f}{\partial u_i}x_i
> $$
> Setting $\lambda=1$, we obtain
> $$
> f(x_1,x_2,\dots,x_n)=\sum_{i=1}^{n}\dfrac{\partial f}{\partial x_i}x_i
> $$
> This is *Euler’s theorem for first-order homogeneous functions*. Similarly, Euler’s theorem for $n$-th order homogeneous functions is
> $$
> n f(x_1,x_2,\dots,x_n)=\sum_{i=1}^{n}\dfrac{\partial f}{\partial x_i}x_i
> $$


# Second Law of Thermodynamics





