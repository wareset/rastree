import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'
/* LITERAL */
import { LITERAL } from '../../flags'
/* STRING */
import { TYPE_STRING } from '../../flags'
import { DOUBLE_STRING_CHARACTERS, SINGLE_STRING_CHARACTERS } from '../../flags'
import { createStringLiteralValue } from '../../ecma/literals/string'

/* LINE_TERMINATOR */
import { isLineTerminator } from '../../ecma/line-terminators'

export const pluginStringFactory = (
  character: string,
  noLineTerminator: boolean,
  type: string,
  flag?: string
): ITokenizerPluginFn => ({
  next,
  char,
  save,
  raw,
  slashed,
  options,
  error
}: ITokenizer) => (): void => {
  if (raw() === character) {
    let isValid = false
    while (next() && !(isValid = char() === raw()[0] && !slashed())) {
      if (noLineTerminator && !slashed() && isLineTerminator(char())) error()
    }
    const flags = flag ? [flag, LITERAL] : [LITERAL]
    save(type, flags, options.values ? createStringLiteralValue(raw()) : raw())
    if (!isValid) error()
  }
}

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
