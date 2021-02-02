import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'

const createPunctuator = ({ save, raw }: ITokenizer): any => {
  save(TYPE_PUNCTUATOR, raw())
}

export const pluginColonPunctuator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => self.raw() === ':' && !createPunctuator(self)

export const pluginSemicolonPunctuator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => self.raw() === ';' && !createPunctuator(self)
