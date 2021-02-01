import { keys, values, includes } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'

const BRACKETS: any = { '}': '{', ')': '(', ']': '[' }
const QUOTES_OPENERS = values(BRACKETS)
const QUOTES_CLOSERS = keys(BRACKETS)
const BRACKETS_LIST = [...QUOTES_OPENERS, ...QUOTES_CLOSERS]

const createBrackets: ITokenizerPluginFn = (
  self: ITokenizer,
  LIST: number[],
  temp?: any
): any => {
  const { save, raw, error } = self
  temp = raw()
  const isOpener = includes(QUOTES_OPENERS, temp)

  if (!isOpener) --self.deep
  save(TYPE_PUNCTUATOR, temp)
  if (isOpener) ++self.deep

  if (isOpener) LIST.unshift(temp)
  else LIST[0] === BRACKETS[temp] ? LIST.shift() : error()
}

export const pluginBrackets = (
  self: ITokenizer,
  LIST: number[] = []
) => (): boolean =>
  includes(BRACKETS_LIST, self.raw()) && !createBrackets(self, LIST)
