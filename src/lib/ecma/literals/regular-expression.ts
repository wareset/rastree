// /* eslint-disable max-len */
// import { len, __RegExp__, slice } from '@rastree/lib'
// import { regexpCreate, testFactory } from '../../utils'
// import { LINE_TERMINATORS } from '../line-terminators'

// /*
// https://tc39.es/ecma262/#sec-literals-regular-expression-literals
// */

// // RegularExpressionLiteral ::
// // / RegularExpressionBody / RegularExpressionFlags

// const __REL__ = '\\/[^*/' + LINE_TERMINATORS + '].*\\/[\\w]*'

// export const isRegularExpressionLiteral = testFactory(regexpCreate(__REL__))
// export const createRegularExpression = (s: string): RegExp | void => {
//   const idx = s.lastIndexOf('/')
//   try {
//     return __RegExp__(slice(s, 1, idx - len(s)), slice(s, idx + 1))
//   } catch (e) {
//     /**/
//   }
// }

import { slice, trycatch, size } from 'wareset-utilites'

export const createRegularExpressionValue = (
  s: string,
  _ = s.lastIndexOf('/')
): RegExp =>
  trycatch(() => new RegExp(slice(s, 1, _ - size(s)), slice(s, _ + 1)))
