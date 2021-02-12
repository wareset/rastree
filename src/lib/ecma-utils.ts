import { test, includes, regexp, isRegExp } from 'wareset-utilites'

const __NUMERIC_FAST__ = /^\d+$/i
export const isInteger = (n: string): boolean => test(__NUMERIC_FAST__, n)

export const splitWords = (s: string): string[] => s.trim().split(/\s+/)
export const includesFactory = (arr: string[]) => (s: string): boolean =>
  includes(arr, s)

export const createRegexp = (s: string, f = ''): RegExp =>
  regexp('^(?:' + s + ')$', f)
export const testFactory = (
  sr: string | RegExp,
  __reg__: RegExp = isRegExp(sr) ? (sr as RegExp) : createRegexp(sr as string)
) => (s: string): boolean => test(__reg__, s)
