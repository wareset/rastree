import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'
import { isPunctuator } from '../../ecma/punctuators'

export const pluginPunctuator: ITokenizerPluginFn = ({
  next,
  char,
  save,
  raw
}: ITokenizer) => (temp?: any): void => {
  if (isPunctuator(raw())) {
    if ((temp = raw()) === '.') {
      if (char(1) === temp && char(2) === temp) next(2)
    } else while (isPunctuator(raw() + char(1)) && next());

    save(TYPE_PUNCTUATOR, [], raw())
  }
}
