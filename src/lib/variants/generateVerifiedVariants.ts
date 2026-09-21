import { analyzePassword } from '../entropy/analysePassword'
import { checkHIBP } from '../breach/checkHIBP'
import {
  generateRandomVariant,
  generateMutatedVariant,
  generateHybridVariant,
  generatePassphraseVariant,
  passphraseEntropyBits,
} from './generateVariants'
import type { BreachResult, VariantResult, VariantType } from '../types'

type CheckBreachFn = (password: string) => Promise<BreachResult>

const MAX_ATTEMPTS = 8
const PASS_SCORE_THRESHOLD = 4
const PASSPHRASE_WORD_COUNT = 5

const VARIANT_LABELS: Record<VariantType, string> = {
  passphrase: 'Passphrase',
  hybrid: 'Hybrid',
  random: 'Random',
  mutated: 'Mutated',
}

const GENERATORS: Record<VariantType, (original: string) => string> = {
  passphrase: () => generatePassphraseVariant(PASSPHRASE_WORD_COUNT),
  hybrid: (original) => generateHybridVariant(original),
  random: () => generateRandomVariant(), 
  mutated: (original) => generateMutatedVariant(original),
}

/**
 * Order matters: variants are presented to the user in this order, with
 * the most defensible strategies first. Passphrase leads because its
 * entropy can be stated analytically; mutated is last because its real
 * strength is the most questionable (see generateVariants.ts).
 */
const VARIANT_ORDER: VariantType[] = ['passphrase', 'hybrid', 'random', 'mutated']

/**
 * Generates a single verified variant of the given type. A candidate is
 * accepted only once it passes BOTH checks: a zxcvbn score of 4 AND a
 * "safe" result from the breach pipeline. This mirrors the same AND-logic
 * the main test uses, so a recommended variant can never fail the test it
 * is meant to fix.
 */
async function generateVerifiedVariant(
  type: VariantType,
  original: string,
  checkBreach: CheckBreachFn
): Promise<VariantResult | null> {
  const generate = GENERATORS[type]

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = generate(original)
    const entropy = analyzePassword(candidate)

    if (!entropy || entropy.score < PASS_SCORE_THRESHOLD) continue

    const breach = await checkBreach(candidate)

    if (breach.status === 'safe') {
      return {
        type,
        label: VARIANT_LABELS[type],
        password: candidate,
        score: entropy.score,
        guesses: entropy.guesses,
        entropyBits:
          type === 'passphrase'
            ? passphraseEntropyBits(PASSPHRASE_WORD_COUNT)
            : undefined,
      }
    }
  }

  return null
}

/**
 * Generates all four recommended variants in parallel, each independently
 * verified before being returned. Any type that fails to produce a passing
 * candidate within MAX_ATTEMPTS is omitted rather than shown unverified.
 */
export async function generateAllVariants(
  original: string,
  checkBreach: CheckBreachFn = checkHIBP
): Promise<VariantResult[]> {
  const results = await Promise.all(
    VARIANT_ORDER.map((type) =>
      generateVerifiedVariant(type, original, checkBreach)
    )
  )

  return results.filter((result): result is VariantResult => result !== null)
}