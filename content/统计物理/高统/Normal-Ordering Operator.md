### Normal Ordering (正规序)

1. **Definition:**
   Normal ordering (denoted by enclosing the operators within colons $:\dots:$ or using the symbol $\mathcal{N}(\dots)$) is an operation that places all **creation operators to the left** of all **annihilation operators**.

   For a bosonic harmonic oscillator with $[a, a^\dagger] = 1$:
   $$:a a^\dagger: \, = a^\dagger a$$
   $$:a^\dagger a: \, = a^\dagger a$$

2. **General Rule (Bosons vs. Fermions):**
   - For bosons:
     $$:a_i a_j^\dagger: \, = a_j^\dagger a_i$$
   - For fermions (an extra minus sign arises due to anticommutation):
     $$:c_i c_j^\dagger: \, = - c_j^\dagger c_i$$

3. **Key Property (Vacuum Expectation Value, VEV):**
   By definition, since the annihilation operator annihilates the vacuum state ($a |0\rangle = 0$), the vacuum expectation value (VEV) of any normal-ordered operator identically vanishes:
   $$\langle 0 | : \hat{\mathcal{O}} : | 0 \rangle = 0$$

4. **Application (Zero-Point Energy Removal):**
   The Hamiltonian of a free scalar field exhibits infinite zero-point energy:
   $$H = \int \frac{d^3p}{(2\pi)^3} \omega_{\mathbf{p}} \left( a_{\mathbf{p}}^\dagger a_{\mathbf{p}} + \frac{1}{2}[a_{\mathbf{p}}, a_{\mathbf{p}}^\dagger] \right)$$
   By redefining the Hamiltonian using the normal-ordered product, we subtract the divergent vacuum energy:
   $$:H: \, = \int \frac{d^3p}{(2\pi)^3} \omega_{\mathbf{p}} a_{\mathbf{p}}^\dagger a_{\mathbf{p}}$$