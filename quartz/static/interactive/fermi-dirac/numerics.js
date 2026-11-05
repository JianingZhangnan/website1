// Normalized Fermi integrals, evaluated without a small-z series.
const gamma = {
  0.5: Math.sqrt(Math.PI),
  1: 1,
  1.5: Math.sqrt(Math.PI) / 2,
  2.5: (3 * Math.sqrt(Math.PI)) / 4,
}
export function sigmoid(a) {
  return a >= 0 ? 1 / (1 + Math.exp(-a)) : Math.exp(a) / (1 + Math.exp(a))
}
export function fd(nu, eta) {
  if (nu === 1) return eta > 0 ? eta + Math.log1p(Math.exp(-eta)) : Math.log1p(Math.exp(eta))
  const upper = Math.sqrt(Math.max(eta, 0) + 44)
  const count = Math.max(512, Math.ceil((Math.max(eta, 0) + 44) * 12) * 2),
    step = upper / count
  const kernel = (t) => (2 * t ** (2 * nu - 1) * sigmoid(eta - t * t)) / gamma[nu]
  let sum = kernel(0) + kernel(upper)
  for (let i = 1; i < count; i++) sum += (i % 2 ? 4 : 2) * kernel(i * step)
  return (sum * step) / 3
}
export function chemicalPotential(tau) {
  if (tau === 0) return 1
  let lo = -50,
    hi = Math.max(50, 2 / tau)
  const target = (4 / (3 * Math.sqrt(Math.PI))) * tau ** -1.5
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (fd(1.5, mid) < target) lo = mid
    else hi = mid
  }
  return (tau * (lo + hi)) / 2
}
export const asymptotic = (nu, eta) =>
  (eta ** nu / (nu * gamma[nu])) * (1 + (Math.PI ** 2 * nu * (nu - 1)) / (6 * eta ** 2))
export const fmt = (v) =>
  v !== 0 && (Math.abs(v) < 0.001 || Math.abs(v) >= 10000)
    ? v.toExponential(3)
    : Number(v.toPrecision(5)).toString()
export const samples = (lo, hi, count, fn) =>
  Array.from({ length: count + 1 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / count
    return [x, fn(x)]
  })
