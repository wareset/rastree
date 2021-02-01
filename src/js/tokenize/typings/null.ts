import { IToken, ITokenizerTypingFn } from '../../../lib/tokenizer'
/* LITERAL */
import { LITERAL } from '../../flags'
/* NULL */
import { TYPE_NULL } from '../../flags'
import { isNullLiteral } from '../../../lib/ecma/literals/null'

export const typingNull: ITokenizerTypingFn = () => (token: IToken): any => {
  if (!token.type! && isNullLiteral(token.raw)) {
    token.type = TYPE_NULL
    token.flags.push(LITERAL)
    token.value = null
  }
}
