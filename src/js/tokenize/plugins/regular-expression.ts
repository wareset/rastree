/* eslint-disable max-len */
import { test } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* LITERAL */
import { LITERAL } from '../../flags'
/* REGULAR_EXPRESSION */
import { TYPE_REGULAR_EXPRESSION } from '../../flags'
import { createRegularExpressionValue } from '../../../lib/ecma/literals/regular-expression'

import isNotPunctuator from './lib/is-not-punctuator'

const createRegExp = ({
  next,
  char,
  save,
  raw,
  slashed,
  error
}: ITokenizer): any => {
  let is: any
  const __test__ = (CHAR: string): string | boolean =>
    (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR

  let isValid = false
  while (next() && !(isValid = !slashed() && __test__(char()) === '/'));
  while (test(/[a-z]/, char(1)) && next());

  save(TYPE_REGULAR_EXPRESSION, createRegularExpressionValue(raw()), [LITERAL])
  !isValid && error()
}

export const pluginRegularExpression: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  self.raw() === '/' && isNotPunctuator(self) && !createRegExp(self)
