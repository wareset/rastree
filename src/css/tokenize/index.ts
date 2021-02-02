/* eslint-disable max-len */
import tokenizer from '../../lib/tokenizer'
import { ITokens, ITokenizerOptions } from '../../lib/tokenizer'

export interface ITokenizerCssOptions extends ITokenizerOptions {
  // jsx?: boolean
  // customTemplate?: boolean | [string | RegExp, string | RegExp]
}

const TOKENIZER_CSS_OPTIONS: ITokenizerCssOptions = {
  // jsx: true,
  // customTemplate: false
}

/*
PLUGINS
*/
/* COMMENT */
import {
  pluginMultiLineComment,
  pluginSingleLineComment
} from '../../js/tokenize/plugins/comment'
/* STRING */
import {
  pluginDoubleString,
  pluginSingleString,
  pluginTemplateString
} from './plugins/css-string'
/* SPACES */
import {
  pluginLineTerminatorFast,
  pluginWhiteSpaceFast,
  pluginFormatControlFast
} from '../../js/tokenize/plugins/spaces'
/* BRACKETS */
import { pluginBrackets } from '../../js/tokenize/plugins/brackets'
/* PUNCTUATOR */
import {
  pluginColonPunctuator,
  pluginSemicolonPunctuator
} from './plugins/css-colons'

/*
TYPINGS
*/
/* TYPING_CSS_NORMALIZE */
import { typingCssNormalize } from './typings/css-normalize'

export const tokenize = (
  source: string,
  options: ITokenizerCssOptions = TOKENIZER_CSS_OPTIONS
): ITokens =>
  (options = { ...TOKENIZER_CSS_OPTIONS, ...options }) &&
  tokenizer(
    source,
    options,
    [
      /* COMMENT */
      pluginMultiLineComment,
      pluginSingleLineComment,
      /* STRING */
      pluginDoubleString,
      pluginSingleString,
      pluginTemplateString,

      /* SPACES */
      /* LINE_TERMINATOR */
      pluginLineTerminatorFast,
      /* WHITE_SPACE */
      pluginWhiteSpaceFast,
      /* FORMAT_CONTROL */
      pluginFormatControlFast,

      /* BRACKETS */
      pluginBrackets,
      /* PUNCTUATOR */
      pluginColonPunctuator,
      pluginSemicolonPunctuator
    ],
    [
      /* TYPING_CSS_NORMALIZE */
      typingCssNormalize
    ]
  ).tokens

export default tokenize
