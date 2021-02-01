import { IToken, ITokenizerTypingFn } from '../../../lib/tokenizer'

/* ERROR */
import { ERROR } from '../../flags'

/* LITERAL */
import { LITERAL } from '../../flags'

/* NUMERIC */
import { TYPE_NUMERIC } from '../../flags'

import {
  isNumericLiteral,
  createNumericLiteralValue
} from '../../../lib/ecma/literals/numeric'

import {
  isDecimalLiteral,
  isDecimalIntegerLiteral,
  isDecimalBigIntegerLiteral
} from '../../../lib/ecma/literals/numeric'

import {
  DECIMAL_LITERAL,
  DECIMAL_INTEGER_LITERAL,
  DECIMAL_BIGINTEGER_LITERAL
} from '../../flags'

import {
  isBinaryIntegerLiteral,
  isHexIntegerLiteral,
  isOctalIntegerLiteral
} from '../../../lib/ecma/literals/numeric'

import {
  BINARY_INTEGER_LITERAL,
  HEX_INTEGER_LITERAL,
  OCTAL_INTEGER_LITERAL
} from '../../flags'
import { NON_DECIMAL_INTEGER_LITERAL } from '../../flags'

import {
  isBinaryBigIntegerLiteral,
  isHexBigIntegerLiteral,
  isOctalBigIntegerLiteral
} from '../../../lib/ecma/literals/numeric'

import {
  BINARY_BIGINTEGER_LITERAL,
  HEX_BIGINTEGER_LITERAL,
  OCTAL_BIGINTEGER_LITERAL
} from '../../flags'
import { NON_DECIMAL_BIGINTEGER_LITERAL } from '../../flags'
import { NON_SUPPORT_BIGDECIMAL_LITERAL } from '../../flags'

export const typingNumeric: ITokenizerTypingFn = () => (token: IToken): any => {
  const value = token.raw
  if (!token.type! && isNumericLiteral(value)) {
    token.type = TYPE_NUMERIC
    token.value = createNumericLiteralValue(value)

    const push = (v: string): any => token.flags.push(v)
    push(LITERAL)

    if (isDecimalLiteral(value)) push(DECIMAL_LITERAL)

    if (isDecimalIntegerLiteral(value)) {
      push(DECIMAL_INTEGER_LITERAL)
    } else if (
      (isBinaryIntegerLiteral(value) && push(BINARY_INTEGER_LITERAL)) ||
      (isHexIntegerLiteral(value) && push(HEX_INTEGER_LITERAL)) ||
      (isOctalIntegerLiteral(value) && push(OCTAL_INTEGER_LITERAL))
    ) {
      push(NON_DECIMAL_INTEGER_LITERAL)
    } else {
      if (isDecimalBigIntegerLiteral(value)) {
        push(DECIMAL_BIGINTEGER_LITERAL)
      } else if (
        // prettier-ignore
        (isBinaryBigIntegerLiteral(value) && push(BINARY_BIGINTEGER_LITERAL)) ||
        (isHexBigIntegerLiteral(value) && push(HEX_BIGINTEGER_LITERAL)) ||
        (isOctalBigIntegerLiteral(value) && push(OCTAL_BIGINTEGER_LITERAL))
      ) {
        push(NON_DECIMAL_BIGINTEGER_LITERAL)
      } else {
        push(NON_SUPPORT_BIGDECIMAL_LITERAL), push(ERROR)
      }
    }
  }
}
