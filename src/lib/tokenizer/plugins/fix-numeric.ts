import { test } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'
/* NUMERIC */
import { isDecimalLiteral } from '../../ecma/literals/numeric'

const isDigit = (s: string): boolean => test(/^\d$/, s)

export const fixNumeric: ITokenizerPluginFn = ({
  next,
  char,
  token,
  raw
}: ITokenizer) => (chr1 = char(1), chr2 = char(2), tkn = token()): void => {
  if (test(/[-+.]/, raw())) {
    // prettier-ignore
    if (raw() === '.') {
      if (isDigit(chr1)) next()
      else if (isDigit(char(-1)) && test(/[eE]/, chr1)) {
        if (isDigit(chr2)) next(2)
        else if (test(/[-+]/, chr2) && isDigit(char(3))) next(3)
      }
    } else if (
      !tkn.type &&
          test(/[eE]/, tkn.raw) &&
          isDecimalLiteral(tkn.raw + chr1)
    ) {
      next()
    }
  }
}
