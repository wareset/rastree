import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* LITERAL */
import { LITERAL } from '../../flags'
/* STRING */
import { TYPE_STRING } from '../../flags'
import { DOUBLE_STRING_CHARACTERS, SINGLE_STRING_CHARACTERS } from '../../flags'
import { createStringLiteralValue } from '../../../lib/ecma/literals/string'
/* TEMPLATE */
import { TYPE_TEMPLATE } from '../../flags'

const createString = (
  { next, char, save, raw, slashed, error }: ITokenizer,
  flag: string
): any => {
  let isValid = false
  while (next() && !(isValid = char() === raw()[0] && !slashed()));
  save(TYPE_STRING, createStringLiteralValue(raw()), [flag, LITERAL])
  if (!isValid) error()
}

export const pluginStringFactory = (
  character: string,
  flag: string
): ITokenizerPluginFn => (self: ITokenizer) => (): boolean =>
  self.raw() === character && !createString(self, flag)

export const pluginDoubleString = pluginStringFactory(
  '"',
  DOUBLE_STRING_CHARACTERS
)
export const pluginSingleString = pluginStringFactory(
  "'",
  SINGLE_STRING_CHARACTERS
)
export const pluginTemplateString = pluginStringFactory('`', TYPE_TEMPLATE)
