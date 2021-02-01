import { IToken, ITokenizerTypingFn } from '../../../lib/tokenizer'
/*
KEYWORD
*/
import {
  isReservedWord,
  isReservedWordStrict
} from '../../../lib/ecma/names-and-keywords'
import { TYPE_KEYWORD, RESERVED_WORD, RESERVED_WORD_STRICT } from '../../flags'
/* IDENTIFIER */
import { TYPE_IDENTIFIER } from '../../flags'

export const typingReservedWord: ITokenizerTypingFn = () => (
  token: IToken
): any => {
  const value = token.raw
  const push = (v: string): any => token.flags.push(v)
  if (
    !token.type! &&
    ((isReservedWord(value) && push(RESERVED_WORD)) ||
      (isReservedWordStrict(value) && push(RESERVED_WORD_STRICT)))
  ) {
    token.type = TYPE_KEYWORD
    push(TYPE_IDENTIFIER)
  }
}
