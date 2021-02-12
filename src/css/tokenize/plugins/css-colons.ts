import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'

/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'
import { CSS } from '../../flags'
import { CSS_PUNCTUATOR } from '../../flags'

const createPunctuator = ({ save, raw }: ITokenizer): any => {
  save(TYPE_PUNCTUATOR, raw(), [CSS_PUNCTUATOR, CSS])
}

export const pluginCssColonPunctuator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => self.raw() === ':' && !createPunctuator(self)

export const pluginCssSemicolonPunctuator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => self.raw() === ';' && !createPunctuator(self)
