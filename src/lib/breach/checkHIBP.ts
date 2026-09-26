import { sha1Hash } from './hashPassword'
import type { BreachResult } from '../types'

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range/'


export async function checkHIBP(password: string): Promise<BreachResult> {
  if (!password) {
    return { status: 'idle', count: 0 }
  }

  try {
    const hash = await sha1Hash(password)
    const prefix = hash.slice(0, 5)
    const suffix = hash.slice(5)

    const response = await fetch(`${HIBP_RANGE_URL}${prefix}`)

    if (!response.ok) {
      return { status: 'error', count: 0 }
    }

    const text = await response.text()
    const candidates = text.split('\n')

    for (const line of candidates) {
      const [candidateSuffix, count] = line.trim().split(':')
      if (candidateSuffix === suffix) {
        return { status: 'breached', count: Number(count) }
      }
    }

    return { status: 'safe', count: 0 }
  } catch {
    return { status: 'error', count: 0 }
  }
}