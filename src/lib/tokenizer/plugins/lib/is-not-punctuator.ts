import { test } from 'wareset-utilites'

import { IToken } from '../../lib/interfaces'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../../flags'

export const isNotPunctuator = (last: IToken): boolean =>
  !last.raw ||
  test(/case|return/, last.raw) ||
  (last.type === TYPE_PUNCTUATOR && test(/[^.})\]]$/i, last.raw))
