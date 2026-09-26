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


export function generateRandomVariant(length = 16): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += RANDOM_CHARSET[secureRandomInt(RANDOM_CHARSET.length)]
  }
  return result
}


export function generateMutatedVariant(original: string): string {
  const substituted = original
    .split('')
    .map((char) => {
      const lower = char.toLowerCase()
      
      if (LEET_MAP[lower] && secureCoinFlip()) {
        return LEET_MAP[lower]
      }
      return char
    })
    .join('')

  return `${substituted}_${secureRandomDigits(2)}${secureRandomFrom(SYMBOLS)}`
}


export function generateHybridVariant(original: string): string {
  const base = capitalize(original)
  const word = capitalize(secureRandomFrom(EFF_WORDLIST))
  const separator = secureRandomFrom(SEPARATORS)

  return `${base}${separator}${word}${secureRandomDigits(2)}${secureRandomFrom(SYMBOLS)}`
}


export function generatePassphraseVariant(wordCount = 5): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(secureRandomFrom(EFF_WORDLIST))
  }

  const separator = secureRandomFrom(SEPARATORS)
  return words.join(separator)
}


export function passphraseEntropyBits(wordCount: number): number {
  return wordCount * Math.log2(EFF_WORDLIST.length)
}