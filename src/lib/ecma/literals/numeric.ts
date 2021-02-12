/* eslint-disable max-len */
import { trycatch, replace, last, slice, test } from 'wareset-utilites'

// const regexpCreate = (s: string, f = ''): RegExp => regexp('^(?:' + s + ')$', f)
// const testFactory = (reg: RegExp) => (s: string): boolean => test(reg, s)

import { testFactory } from '../../ecma-utils'

/*
https://tc39.es/ecma262/#sec-literals-numeric-literals
*/

// NumericLiteral::
//    DecimalLiteral
//    DecimalBigIntegerLiteral
//    NonDecimalIntegerLiteral
//    NonDecimalIntegerLiteral BigIntLiteralSuffix

/* https://tc39.es/proposal-numeric-separator */

// DecimalLiteral::
//    DecimalIntegerLiteral . DecimalDigitsOpt ExponentPartopt
//    . DecimalDigits ExponentPartOpt
//    DecimalIntegerLiteral ExponentPartOpt
// const reg = /^(\d|[1-9]\d*(?:_\d+)*(?:\.(?!$)?)|\.\d+(_\d+)*)([eE][-+]?\d+(_\d+)*)?$/

const __NSP__ = '(?:_\\d+)*'
const __DIL__ = '(?:\\d|(?:(?<!^)0|[1-9])\\d*' + __NSP__ + ')'
// prettier-ignore
const __DL__ =
  `(?:${__DIL__}(?:\\.(?!$))?|(?:${__DIL__})?\\.${__DIL__})` +
  `(?:[eE][-+]?\\d+${__NSP__})?`
export const isDecimalLiteral = testFactory(__DL__)

// DecimalIntegerLiteral::
//    0
//    NonZeroDigit DecimalDigitsOpt
//    NonZeroDigit
//    NonZeroDigit NumericLiteralSeparatorOpt DecimalDigits

export const isDecimalIntegerLiteral = testFactory(__DIL__)

// DecimalBigIntegerLiteral::
//    0 BigIntLiteralSuffix
//    NonZeroDigit DecimalDigitsOpt BigIntLiteralSuffix
//    NonZeroDigit NumericLiteralSeparator DecimalDigits BigIntLiteralSuffix
const __BILS__ = 'n'
// prettier-ignore
export const isDecimalBigIntegerLiteral = testFactory((__DIL__ + __BILS__))

// NonDecimalIntegerLiteral
//    BinaryIntegerLiteral
//    OctalIntegerLiteral
//    HexIntegerLiteral
const __BIL__ = '0[bB][01]+(?:_[01]+)*'
const __HIL__ = '0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*'
const __OIL__ = '0[oO][0-7]+(?:_[0-7]+)*'
export const isBinaryIntegerLiteral = testFactory(__BIL__)
export const isHexIntegerLiteral = testFactory(__HIL__)
export const isOctalIntegerLiteral = testFactory(__OIL__)
// prettier-ignore
// export const isNonDecimalIntegerLiteral = (s: any): boolean =>
//   isBinaryIntegerLiteral(s) || isHexIntegerLiteral(s) || isOctalIntegerLiteral(s)

// NonDecimalIntegerLiteral BigIntLiteralSuffix
//    BinaryIntegerLiteral BigIntLiteralSuffix
//    OctalIntegerLiteral BigIntLiteralSuffix
//    HexIntegerLiteral BigIntLiteralSuffix
// prettier-ignore
export const isBinaryBigIntegerLiteral = testFactory((__BIL__ + __BILS__))
// prettier-ignore
export const isHexBigIntegerLiteral = testFactory((__HIL__ + __BILS__))
// prettier-ignore
export const isOctalBigIntegerLiteral = testFactory((__OIL__ + __BILS__))
// prettier-ignore
// export const isNonDecimalBigIntegerLiteral = (s: any): boolean =>
//   isBinaryBigIntegerLiteral(s) || isHexBigIntegerLiteral(s) || isOctalBigIntegerLiteral(s)

trycatch((): void => {
  if (!(BigInt.prototype as any).toJSON) {
    ;(BigInt.prototype as any).toJSON = function (): string {
      return '' + this + 'n'
    }
  }
})

const __normalizeNum__ = /(?<=\d)_(\d)/gi
export const createNumber = (s: string): number =>
  +replace(s, __normalizeNum__, '$1')

export const isNumericLiteral = (s: string): boolean =>
  !!(
    ((last(s) === 'n' && (s = slice(s, 0, -1))) || s) &&
    // (test(/^0[\w]+$/, s) || isDecimalLiteral(s)) &&
    test(/^[.\d]/, s) &&
    !isNaN(createNumber(s))
  )

export const createNumericLiteralValue = (value: string): any =>
  last(value) !== 'n'
    ? createNumber(value)
    : trycatch(() => BigInt(createNumber(slice(value, 0, -1))), value, false)
