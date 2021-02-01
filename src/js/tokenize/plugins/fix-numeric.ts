import { test } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* NUMERIC */
import { isDecimalLiteral } from '../../../lib/ecma/literals/numeric'

const isDigit = (s: string): boolean => test(/^\d$/, s)

const createFixNumeric = (
  { next, char, token, raw }: ITokenizer,
  temp1 = char(1),
  temp2 = char(2)
): any => {
  // prettier-ignore
  if (raw() === '.') {
    if (isDigit(temp1)) next()
    else if (isDigit(char(-1)) && test(/[eE]/, temp1)) {
      if (isDigit(temp2)) next(2)
      else if (test(/[-+]/, temp2) && isDigit(char(3))) next(3)
    }
  } else if (
    token && !token.type &&
          test(/[eE]/, token.raw) &&
          isDecimalLiteral(token.raw + temp1)
  ) {
    next()
  }
}

export const fixNumeric: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => test(/[-+.]/, self.raw()) && !!createFixNumeric(self)
