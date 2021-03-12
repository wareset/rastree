/* eslint-disable max-len */
import { test } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'
/* LITERAL */
import { LITERAL } from '../../flags'
/* REGULAR_EXPRESSION */
import { TYPE_REGULAR_EXPRESSION } from '../../flags'
import { createRegularExpressionValue } from '../../ecma/literals/regular-expression'

import { isNotPunctuator } from './lib/is-not-punctuator'

export const pluginRegularExpression: ITokenizerPluginFn = ({
  next,
  char,
  save,
  raw,
  slashed,
  tokenSafe,
  options,
  error
}: ITokenizer) => (): void => {
  if (raw() === '/' && isNotPunctuator(tokenSafe())) {
    let is: any
    const __test__ = (CHAR: string): string | boolean =>
      (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR

    let isValid = false
    while (next() && !(isValid = !slashed() && __test__(char()) === '/'));
    while (test(/[a-z]/, char(1)) && next());

    save(
      TYPE_REGULAR_EXPRESSION,
      [LITERAL],
      options.values ? createRegularExpressionValue(raw()) : raw()
    )
    isValid || error()
  }
}
