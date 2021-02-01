import { test } from 'wareset-utilites'

import { ITokenizer } from '../../../../lib/tokenizer'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../../flags'

export const isNotPunctuator = (
  self: ITokenizer,
  last = self.tokenLast
): boolean =>
  !last ||
  test(/case|return/, last.raw) ||
  (last.type === TYPE_PUNCTUATOR && test(/[^.})\]]$/i, last.raw))

export default isNotPunctuator
