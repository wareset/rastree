import { IToken, ITokenizerTypingFn } from '../../../lib/tokenizer'
/* IDENTIFIER */
import { TYPE_IDENTIFIER } from '../../flags'
import { INFINITY, NAN, UNDEFINED } from '../../flags'
import {
  isReservedWordContextual,
  isWordContextual,
  isWordContextualStrict
} from '../../../lib/ecma/names-and-keywords'
import {
  RESERVED_WORD_CONTEXTUAL,
  WORD_CONTEXTUAL,
  WORD_CONTEXTUAL_STRICT
} from '../../flags'

export const typingIdentifier: ITokenizerTypingFn = () => (
  token: IToken
): any => {
  if (!token.type!) {
    token.type = TYPE_IDENTIFIER
    let value: any = token.raw
    const push = (v: string): any => token.flags.push(v)

    if (isReservedWordContextual(value)) push(RESERVED_WORD_CONTEXTUAL)
    else if (isWordContextual(value)) push(WORD_CONTEXTUAL)
    else if (isWordContextualStrict(value)) push(WORD_CONTEXTUAL_STRICT)
    else if (value === INFINITY) push(INFINITY), (value = Infinity)
    else if (value === 'NaN') push(NAN), (value = NaN)
    else if (value === 'undefined') push(UNDEFINED), (value = undefined)

    token.value = value
  }
}
