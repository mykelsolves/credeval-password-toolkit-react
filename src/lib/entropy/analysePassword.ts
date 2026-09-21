import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import type { EntropyResult } from '../types'

const zxcvbn = new ZxcvbnFactory({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
})

const EXCLUDED_FEEDBACK =
  'Use longer keyboard patterns and change typing direction multiple times.'

/**
 * Runs the zxcvbn pattern-decomposition engine against a raw password.
 *
 * This is the Entropy Pipeline from the system architecture: it executes
 * synchronously, entirely client-side, on every keystroke. The password
 * never leaves the browser at any point in this pipeline.
 */
export function analyzePassword(password: string): EntropyResult | null {
  if (!password) return null

  const result = zxcvbn.check(password)
  const feedback = [result.feedback.warning, ...result.feedback.suggestions]
    .filter(Boolean)
    .filter((message) => message !== EXCLUDED_FEEDBACK)
    .filter((message, index, messages) => messages.indexOf(message) === index)
    .join(' ') ||
    (result.score === 4
      ? 'This password is strong.'
      : 'Use a longer and less predictable password.')

  return {
    score: result.score as EntropyResult['score'],
    guesses: result.guesses,
    crackTimeDisplay: String(
      result.crackTimes.onlineThrottlingXPerHour.display
    ),
    warning: result.feedback.warning || '',
    suggestions: result.feedback.suggestions,
    feedback,
  }
}