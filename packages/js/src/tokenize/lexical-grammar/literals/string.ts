// import { DOUBLE_BACKSLASH, regexpCreate, testFactory } from '../../utils'
// import { LINE_TERMINATORS } from '../line-terminators'

/*
https://tc39.es/ecma262/#sec-literals-string-literals
*/

// StringLiteral ::
//  " DoubleStringCharactersOpt "
//  ' SingleStringCharactersOpt '
// const __DSC__ = regexpCreate('"(?:[^\\\\"\\r\\n]|\\\\["]|\\\\[^"\\r\\n])*"')
// // prettier-ignore
// const __scFn__ = (s: string, l: '\\\\' = DOUBLE_BACKSLASH as '\\\\'): string =>
//   s + '(?:[^' + l + s + LINE_TERMINATORS + ']|' + l + '[' + s
//   + ']' + '|' + l + '[^' + s + LINE_TERMINATORS + '])*' + s
// const __DSC__ = __scFn__('"')
// const __SSC__ = __scFn__("'")

// export const isDoubleStringCharacters = testFactory(regexpCreate(__DSC__))
// export const isSingleStringCharacters = testFactory(regexpCreate(__SSC__))

// // prettier-ignore
// export const isStringLiteral =
//   testFactory(regexpCreate('(?:' + __DSC__ + '|' + __SSC__ + ')'))

import { replace, slice } from 'wareset-utilites'
import { REG_ESCAPE_SEQUENCES, ESCAPE_SEQUENCES } from '../format-control'

export const createStringLiteralValue = (value: string): string =>
  replace(slice(value, 1, -1), REG_ESCAPE_SEQUENCES, (a: string) =>
    a[1] === value[0] ? a[1] : (ESCAPE_SEQUENCES as any)[a[1]] || a
  )
