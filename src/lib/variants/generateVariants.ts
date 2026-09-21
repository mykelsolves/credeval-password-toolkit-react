import { EFF_WORDLIST } from './effWordlist'
import {
  secureRandomFrom,
  secureRandomDigits,
  secureRandomInt,
  secureCoinFlip,
} from './secureRandom'

const LEET_MAP: Record<string, string> = {
  a: '4', e: '3', i: '1', o: '0', s: '$', t: '7',
}

const RANDOM_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

const SYMBOLS = '!@#$%^&*'.split('')
const SEPARATORS = ['-', '_', '.']

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Fully random generation, unrelated to the user's input.
 * Maximum entropy, but offers no memorability aid at all.
 */
export function generateRandomVariant(length = 16): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += RANDOM_CHARSET[secureRandomInt(RANDOM_CHARSET.length)]
  }
  return result
}

/**
 * Mutates the user's original password with l33t-style substitutions,
 * then appends digits and a symbol.
 *
 * NOTE: this strategy is retained for comparison but is the weakest of
 * the four in practice. Appending digits and symbols to a recognisable
 * base word is precisely the transformation rule-based crackers (e.g.
 * Hashcat rule sets) apply first, so its zxcvbn score overstates its
 * real-world resistance. See the discussion of this limitation in the
 * evaluation chapter.
 */
export function generateMutatedVariant(original: string): string {
  const substituted = original
    .split('')
    .map((char) => {
      const lower = char.toLowerCase()
      // Substitute only about half the eligible characters so the result
      // stays partially recognisable rather than fully scrambled.
      if (LEET_MAP[lower] && secureCoinFlip()) {
        return LEET_MAP[lower]
      }
      return char
    })
    .join('')

  return `${substituted}_${secureRandomDigits(2)}${secureRandomFrom(SYMBOLS)}`
}

/**
 * Combines the user's original password with a random EFF wordlist word,
 * a separator, digits and a symbol. Prioritises added length, which
 * dominates zxcvbn's guess estimate, while keeping the original word
 * intact and readable.
 */
export function generateHybridVariant(original: string): string {
  const base = capitalize(original)
  const word = capitalize(secureRandomFrom(EFF_WORDLIST))
  const separator = secureRandomFrom(SEPARATORS)

  return `${base}${separator}${word}${secureRandomDigits(2)}${secureRandomFrom(SYMBOLS)}`
}

/**
 * Generates a diceware-style passphrase from the EFF large wordlist.
 *
 * Each word contributes log2(7776) = 12.92 bits of entropy, so a
 * five-word passphrase carries roughly 64.6 bits before any separator or
 * capitalisation is considered. This is the only strategy whose strength
 * can be stated analytically rather than estimated, because the words are
 * drawn uniformly at random from a list of known size.
 */
export function generatePassphraseVariant(wordCount = 5): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(secureRandomFrom(EFF_WORDLIST))
  }

  const separator = secureRandomFrom(SEPARATORS)
  return words.join(separator)
}

/**
 * Theoretical entropy of a passphrase of the given length, in bits.
 * Exposed so the interface can show the analytic figure alongside
 * zxcvbn's empirical estimate.
 */
export function passphraseEntropyBits(wordCount: number): number {
  return wordCount * Math.log2(EFF_WORDLIST.length)
}