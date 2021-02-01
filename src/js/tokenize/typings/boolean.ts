import { IToken, ITokenizerTypingFn } from '../../../lib/tokenizer'
/* LITERAL */
import { LITERAL } from '../../flags'
/* BOOLEAN */
import { TYPE_BOOLEAN } from '../../flags'
import { isBooleanLiteral } from '../../../lib/ecma/literals/boolean'

export const typingBoolean: ITokenizerTypingFn = () => (token: IToken): any => {
  if (!token.type! && isBooleanLiteral(token.raw)) {
    token.type = TYPE_BOOLEAN
    token.flags.push(LITERAL)
    token.value = token.raw === 'true'
  }
}
