import { test, includes } from 'wareset-utilites'

const __NUMERIC_FAST__ = /^\d+$/i
export const isInteger = (n: string): boolean => test(__NUMERIC_FAST__, n)

// export const getCharAt = (s: string, index = s.length - 1): string =>
//   s.charAt(index)

export const splitWords = (s: string): string[] => s.trim().split(/\s+/)
export const includesFactory = (arr: string[]) => (s: string): boolean =>
  includes(arr, s)
