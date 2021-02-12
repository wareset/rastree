import { includes, indexOf } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'

const QUOTES_OPENERS = ['{', '(', '[']
const QUOTES_CLOSERS = ['}', ')', ']']
const BRACKETS_LIST = [...QUOTES_OPENERS, ...QUOTES_CLOSERS]

const createBracketsFactory = (saves: any, types: any, flags: any) => (
  self: ITokenizer,
  LIST: string[],
  result: [boolean]
): any => {
  const { save, raw, error } = self
  const temp = raw()
  const isOpener = includes(QUOTES_OPENERS, temp)
  const idx = indexOf(isOpener ? QUOTES_OPENERS : QUOTES_CLOSERS, temp)

  if ((result[0] = saves[idx])) {
    if (!isOpener) --self.deep
    save(types[idx], temp, flags[idx] || [])
    if (isOpener) ++self.deep
  }

  if (isOpener) LIST.unshift(temp)
  else LIST[0] === QUOTES_OPENERS[idx] ? LIST.shift() : error(LIST[0], temp)
}

export const pluginBracketsFactory = (
  saves: [boolean?, boolean?, boolean?],
  types: [string?, string?, string?],
  flags: [string[]?, string[]?, string[]?],
  createBrackets: any = createBracketsFactory(saves, types, flags)
): ITokenizerPluginFn => (
  self: ITokenizer,
  LIST: string[] = [],
  result = [true]
) => (): boolean =>
  includes(BRACKETS_LIST, self.raw()) &&
  !createBrackets(self, LIST, result) &&
  result[0]

export const pluginBrackets: ITokenizerPluginFn = pluginBracketsFactory(
  [true, true, true],
  [TYPE_PUNCTUATOR, TYPE_PUNCTUATOR, TYPE_PUNCTUATOR],
  [[], [], []]
)
