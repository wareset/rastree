import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* LITERAL */
import { LITERAL } from '../../flags'
/* STRING */
import { TYPE_STRING } from '../../flags'
import { DOUBLE_STRING_CHARACTERS, SINGLE_STRING_CHARACTERS } from '../../flags'
import { createStringLiteralValue } from '../../../lib/ecma/literals/string'
/* LINE_TERMINATOR */
import { isLineTerminator } from '../../../lib/ecma/line-terminators'

const createString = (
  { next, char, save, raw, slashed, error }: ITokenizer,
  noLineTerminator: boolean,
  type?: string,
  flag?: string
): any => {
  let isValid = false
  while (next() && !(isValid = char() === raw()[0] && !slashed())) {
    if (noLineTerminator && !slashed() && isLineTerminator(char())) error()
  }
  const flags = flag ? [flag, LITERAL] : [LITERAL]
  save(type, createStringLiteralValue(raw()), flags)
  if (!isValid) error()
}

export const pluginStringFactory = (
  character: string,
  noLineTerminator: boolean,
  type?: string,
  flag?: string
): ITokenizerPluginFn => (self: ITokenizer) => (): boolean =>
  self.raw() === character && !createString(self, noLineTerminator, type, flag)

export const pluginDoubleString = pluginStringFactory(
  '"',
  true,
  TYPE_STRING,
  DOUBLE_STRING_CHARACTERS
)
export const pluginSingleString = pluginStringFactory(
  "'",
  true,
  TYPE_STRING,
  SINGLE_STRING_CHARACTERS
)
