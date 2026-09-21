/**
 * Cryptographically secure random helpers.
 *
 * All randomness in variant generation goes through these functions so
 * that no part of the generator falls back to Math.random(), which is
 * not cryptographically secure and must never influence a password.
 */

/**
 * Returns a uniformly distributed integer in [0, max).
 *
 * Uses rejection sampling rather than a plain modulo. A naive
 * `value % max` is biased whenever max does not evenly divide 2^32,
 * making low-numbered outcomes slightly more likely. Discarding values
 * in the final partial bucket removes that bias entirely.
 */
export function secureRandomInt(max: number): number {
  if (max <= 0) throw new Error('max must be positive')

  const limit = Math.floor(0xffffffff / max) * max
  const buffer = new Uint32Array(1)

  let value: number
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= limit)

  return value % max
}

/** Picks a uniformly random element from a non-empty array. */
export function secureRandomFrom<T>(items: readonly T[]): T {
  if (items.length === 0) throw new Error('cannot pick from an empty array')
  return items[secureRandomInt(items.length)]
}

/** Returns a string of `count` uniformly random decimal digits. */
export function secureRandomDigits(count: number): string {
  let digits = ''
  for (let i = 0; i < count; i++) {
    digits += secureRandomInt(10).toString()
  }
  return digits
}

/** Returns true with probability 0.5, using a secure source. */
export function secureCoinFlip(): boolean {
  return secureRandomInt(2) === 1
}