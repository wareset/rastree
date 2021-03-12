import { includes, indexOf, shift, unshift } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'

// import { ENV_PREFIX } from './lib/env-prefix'

const QUOTES_OPENERS = ['{', '(', '[']
const QUOTES_CLOSERS = ['}', ')', ']']
const BRACKETS_LIST = [...QUOTES_OPENERS, ...QUOTES_CLOSERS]

const createBracketsFactory = (saves: any, types: any, flags: any) => (
  { save, raw, error, deep }: ITokenizer,
  LIST: string[],
  result: [boolean]
): any => {
  const temp = raw()
  const isOpener = includes(QUOTES_OPENERS, temp)
  const idx = indexOf(isOpener ? QUOTES_OPENERS : QUOTES_CLOSERS, temp)

  if ((result[0] = saves[idx])) {
    if (!isOpener) deep(-1)
    save(types[idx], flags[idx] || [], temp)
    if (isOpener) deep(1)
  }

  // env(isOpener ? ENV_PREFIX + TYPE_PUNCTUATOR + temp : false)

  if (isOpener) unshift(LIST, temp)
  else {
    LIST[0] === QUOTES_OPENERS[idx] ? shift(LIST) : error(LIST[0], temp)
  }
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
  includes(BRACKETS_LIST, self.raw()) && !createBrackets(self, LIST, result)

export const pluginBrackets: ITokenizerPluginFn = pluginBracketsFactory(
  [true, true, true],
  [TYPE_PUNCTUATOR, TYPE_PUNCTUATOR, TYPE_PUNCTUATOR],
  [[], [], []]
)
