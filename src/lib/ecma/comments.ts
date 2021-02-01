// /* eslint-disable max-len */
// import { regexpCreate, testFactory } from '../utils'
// import { LINE_TERMINATORS } from './line-terminators'

// /*
// https://tc39.es/ecma262/#sec-comments
// */

// // MultiLineComment ::
// //    /* MultiLineCommentCharsopt */
// const __mlc__ = '/\\*(?:[^*]|\\*[^/])*\\*/'
// export const isMultiLineComment = testFactory(regexpCreate(__mlc__))

// // SingleLineComment ::
// //    // SingleLineCommentCharsopt
// const __slc__ = '//[^' + LINE_TERMINATORS + ']*'
// export const isSingleLineComment = testFactory(regexpCreate(__slc__))

// // Comment ::
// //    MultiLineComment
// //    SingleLineComment
// export const isComment = (s: any): boolean =>
//   isMultiLineComment(s) || isSingleLineComment(s)

import { slice, first, last } from 'wareset-utilites'

export const createCommentValue = (value: string): string =>
  slice(
    value,
    2,
    first(value, 1) === '*' && last(value) === '/' && last(value, 1) === '*'
      ? -2
      : undefined
  )
