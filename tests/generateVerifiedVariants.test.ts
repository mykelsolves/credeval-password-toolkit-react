import { describe, expect, it, vi } from 'vitest'

vi.mock('../src/lib/entropy/analysePassword', () => ({
	analyzePassword: vi.fn(() => ({
		score: 4,
		guesses: 1000000,
		crackTimeDisplay: 'centuries',
		warning: '',
		suggestions: [],
		feedback: 'This password is strong.',
	})),
}))

vi.mock('../src/lib/variants/generateVariants', () => ({
	generatePassphraseVariant: vi.fn(() => 'passphrase candidate'),
	generateHybridVariant: vi.fn(() => 'hybrid candidate'),
	generateRandomVariant: vi.fn(() => 'random candidate'),
	generateMutatedVariant: vi.fn(() => 'mutated candidate'),
	passphraseEntropyBits: vi.fn(() => 64.6),
}))

import { generateAllVariants } from '../src/lib/variants/generateVerifiedVariants'

describe('generateAllVariants', () => {
	it('returns all verified variants in presentation order', async () => {
		const checkBreach = vi.fn().mockResolvedValue({ status: 'safe', count: 0 })

		const results = await generateAllVariants('original password', checkBreach)

		expect(results.map((result) => result.type)).toEqual([
			'passphrase',
			'hybrid',
			'random',
			'mutated',
		])
		expect(results.map((result) => result.label)).toEqual([
			'Passphrase',
			'Hybrid',
			'Random',
			'Mutated',
		])
		expect(results.every((result) => result.score === 4)).toBe(true)
		expect(results[0]?.entropyBits).toBe(64.6)
		expect(checkBreach).toHaveBeenCalledTimes(4)
	})

	it('omits candidates that are breached or cannot be verified', async () => {
		const checkBreach = vi.fn().mockResolvedValue({
			status: 'breached',
			count: 10,
		})

		const results = await generateAllVariants('original password', checkBreach)

		expect(results).toEqual([])
		expect(checkBreach).toHaveBeenCalledTimes(32)
	})

	it('retries a candidate after a failed breach check', async () => {
		let calls = 0
		const checkBreach = vi.fn().mockImplementation(async () => {
			calls += 1
			return calls <= 4
				? { status: 'breached', count: 1 }
				: { status: 'safe', count: 0 }
		})

		const results = await generateAllVariants('original password', checkBreach)

		expect(results).toHaveLength(4)
		expect(checkBreach).toHaveBeenCalledTimes(8)
	})
})
