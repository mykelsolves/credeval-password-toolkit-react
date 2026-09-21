import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	secureCoinFlip,
	secureRandomDigits,
	secureRandomFrom,
	secureRandomInt,
} from '../src/lib/variants/secureRandom'

describe('secure random helpers', () => {
	const getRandomValues = vi.fn()

	beforeEach(() => {
		getRandomValues.mockReset()
		vi.stubGlobal('crypto', { getRandomValues })
	})

	it('returns an integer in the requested range', () => {
		getRandomValues.mockImplementation((buffer: Uint32Array) => {
			buffer[0] = 7
			return buffer
		})

		expect(secureRandomInt(10)).toBe(7)
		expect(getRandomValues).toHaveBeenCalledOnce()
	})

	it('rejects non-positive bounds', () => {
		expect(() => secureRandomInt(0)).toThrow('max must be positive')
		expect(() => secureRandomInt(-1)).toThrow('max must be positive')
	})

	it('selects an item using the secure integer helper', () => {
		getRandomValues.mockImplementation((buffer: Uint32Array) => {
			buffer[0] = 1
			return buffer
		})

		expect(secureRandomFrom(['first', 'second', 'third'])).toBe('second')
	})

	it('rejects an empty collection', () => {
		expect(() => secureRandomFrom([])).toThrow(
			'cannot pick from an empty array'
		)
	})

	it('generates the requested number of decimal digits', () => {
		let nextValue = 0
		getRandomValues.mockImplementation((buffer: Uint32Array) => {
			buffer[0] = nextValue++
			return buffer
		})

		expect(secureRandomDigits(5)).toBe('01234')
		expect(getRandomValues).toHaveBeenCalledTimes(5)
	})

	it('returns a boolean from a secure coin flip', () => {
		getRandomValues.mockImplementation((buffer: Uint32Array) => {
			buffer[0] = 0
			return buffer
		})
		expect(secureCoinFlip()).toBe(false)

		getRandomValues.mockImplementation((buffer: Uint32Array) => {
			buffer[0] = 1
			return buffer
		})
		expect(secureCoinFlip()).toBe(true)
	})
})
