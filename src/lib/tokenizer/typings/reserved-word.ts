import { IToken, ITokenizerTypingFn } from '../lib/interfaces'
/*
KEYWORD
*/
import {
  isReservedWord,
  isReservedWordStrict
} from '../../ecma/names-and-keywords'
import { TYPE_KEYWORD, RESERVED_WORD, RESERVED_WORD_STRICT } from '../../flags'
/* IDENTIFIER */
import { TYPE_IDENTIFIER } from '../../flags'

export const typingReservedWord: ITokenizerTypingFn = () => (
  token: IToken
): any => {
  const value = token.raw
  const push = token.setFlags.bind(token)
  if (
    !token.type! &&
    ((isReservedWord(value) && push(RESERVED_WORD)) ||
      (isReservedWordStrict(value) && push(RESERVED_WORD_STRICT)))
  ) {
    token.type = TYPE_KEYWORD
    push(TYPE_IDENTIFIER)
  }
}
