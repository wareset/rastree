// /* eslint-disable max-len */
// import { regexpCreate, testFactory } from '../utils'
import { keys } from 'wareset-utilites'
import { LINE_TERMINATOR_CODE_POINTS } from './line-terminators'

import { testFactory } from '../ecma-utils'

/*
https://tc39.es/ecma262/#sec-comments
*/

// MultiLineComment ::
// -  /* MultiLineCommentCharsopt */
const __mlc__ = '/\\*(?:[^*]|\\*[^/])*\\*/'
export const isMultiLineComment = testFactory(__mlc__)

// SingleLineComment ::
// -  // SingleLineCommentCharsopt
const __slc__ = '//[^' + keys(LINE_TERMINATOR_CODE_POINTS).join('') + ']*'
export const isSingleLineComment = testFactory(__slc__)

// Comment ::
//    MultiLineComment
//    SingleLineComment
export const isComment = (s: any): boolean =>
  isMultiLineComment(s) || isSingleLineComment(s)

import { slice, trim, startsWith, endsWith } from 'wareset-utilites'

export const createCommentValue = (value: string): string =>
  (value = trim(value)) &&
  slice(
    value,
    startsWith(value, '/*') || startsWith(value, '//') ? 2 : 0,
    startsWith(value, '/*') && endsWith(value, '*/') ? -2 : undefined
  )
