import { IToken, ITokenizer, ITokenizerTypingFn } from '../lib/interfaces'
/* LITERAL */
import { LITERAL } from '../../flags'
/* BOOLEAN */
import { TYPE_BOOLEAN } from '../../flags'
import { isBooleanLiteral } from '../../ecma/literals/boolean'

export const typingBoolean: ITokenizerTypingFn = ({ options }: ITokenizer) => (
  token: IToken
): any => {
  if (!token.type! && isBooleanLiteral(token.raw)) {
    token.type = TYPE_BOOLEAN
    token.setFlags(LITERAL)
    if (options.values) token.value = token.raw === 'true'
  }
}
