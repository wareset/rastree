import { IToken, ITokenizer, ITokenizerTypingFn } from '../lib/interfaces'
/* LITERAL */
import { LITERAL } from '../../flags'
/* NULL */
import { TYPE_NULL } from '../../flags'
import { isNullLiteral } from '../../ecma/literals/null'

export const typingNull: ITokenizerTypingFn = ({ options }: ITokenizer) => (
  token: IToken
): any => {
  if (!token.type! && isNullLiteral(token.raw)) {
    token.type = TYPE_NULL
    token.setFlags(LITERAL)
    if (options.values) token.value = null
  }
}
