import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'
import { isPunctuator } from '../../../lib/ecma/punctuators'

const createPunctuator = (
  { next, char, save, raw }: ITokenizer,
  temp?: any
): any => {
  if ((temp = raw()) === '.') {
    if (char(1) === temp && char(2) === temp) next(2)
  } else while (isPunctuator(raw() + char(1)) && next());

  save(TYPE_PUNCTUATOR, raw())
}

export const pluginPunctuator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => isPunctuator(self.raw()) && !createPunctuator(self)
