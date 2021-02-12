import { pluginBracketsFactory } from '../../../js/tokenize/plugins/brackets'
export { pluginBracketsFactory }

import { includes } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'

/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'
import { CSS } from '../../flags'
import { CSS_PUNCTUATOR } from '../../flags'

export const pluginCssBrackets = pluginBracketsFactory(
  [true],
  [TYPE_PUNCTUATOR],
  [[CSS_PUNCTUATOR, CSS]]
)

// const QUOTES_OPENERS = ['(', '[']
// const QUOTES_CLOSERS = [')', ']']
export const pluginFixBracketsFactory = (
  QUOTES_OPENERS = ['(', '['],
  QUOTES_CLOSERS = [')', ']']
): ITokenizerPluginFn => (self: ITokenizer, BRACKETS_DEEP = 0) => (
  raw = self.raw
): boolean =>
  ((includes(QUOTES_OPENERS, raw()) && !!++BRACKETS_DEEP) ||
    (includes(QUOTES_CLOSERS, raw()) && !--BRACKETS_DEEP) ||
    !!BRACKETS_DEEP) &&
  !self.save()

export const pluginCssFixBrackets = pluginFixBracketsFactory()
