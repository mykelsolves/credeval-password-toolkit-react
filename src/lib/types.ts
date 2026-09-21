export interface EntropyResult {
  score: 0 | 1 | 2 | 3 | 4
  guesses: number
  crackTimeDisplay: string
  warning: string
  suggestions: string[]
  feedback: string
}

export type BreachStatus = 'idle' | 'checking' | 'safe' | 'breached' | 'error'

export interface BreachResult {
  status: BreachStatus
  count: number
}

export interface PasswordAnalysis {
  entropy: EntropyResult | null
  breach: BreachResult
}

export type VariantType = 'passphrase' | 'hybrid' | 'random' | 'mutated'

export interface VariantResult {
  type: VariantType
  label: string
  password: string
  score: EntropyResult['score']
  guesses: number
  entropyBits?: number
}

export type TestVerdict = 'pending' | 'pass' | 'fail'

export type VariantsState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'ready'; variants: VariantResult[] }
  | { status: 'error' }