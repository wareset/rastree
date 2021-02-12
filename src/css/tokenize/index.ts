/* eslint-disable max-len */
import tokenizer from '../../lib/tokenizer'
import { ITokens, ITokenizerOptions } from '../../lib/tokenizer'
import { cssify } from '../lib/cssify'

export interface ITokenizeCssOptions extends ITokenizerOptions {
  punctuators?: boolean
}

const TOKENIZE_CSS_OPTIONS: ITokenizeCssOptions = {
  punctuators: true
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
  pluginCssDoubleString,
  pluginCssSingleString,
  pluginCssTemplateString
} from './plugins/css-string'
/* SPACES */
// import {
//   pluginLineTerminator,
//   pluginWhiteSpace,
//   pluginFormatControl
// } from '../../js/tokenize/plugins/spaces'
/* BRACKETS */
import { pluginCssBrackets, pluginCssFixBrackets } from './plugins/css-brackets'
/* PUNCTUATOR */
import {
  // pluginCssColonPunctuator,
  pluginCssSemicolonPunctuator
} from './plugins/css-colons'

/*
TYPINGS
*/
/* TYPING_CSS_NORMALIZE */
import { typingCssNormalizeFactory } from './typings/css-normalize'

export const tokenize = (
  source: string,
  options?: ITokenizeCssOptions
): ITokens =>
  (options = { ...TOKENIZE_CSS_OPTIONS, ...(options || {}) }) &&
  cssify(
    tokenizer(
      source,
      options,
      [
        /* COMMENT */
        pluginMultiLineComment,
        pluginSingleLineComment,

        /* STRING */
        pluginCssDoubleString,
        pluginCssSingleString,
        pluginCssTemplateString,

        /* BRACKETS */
        pluginCssBrackets,
        pluginCssFixBrackets,
        /* PUNCTUATOR */
        // pluginCssColonPunctuator,
        pluginCssSemicolonPunctuator

        /* SPACES */
        /* LINE_TERMINATOR */
        // pluginLineTerminator,
        /* WHITE_SPACE */
        // pluginWhiteSpace,
        /* FORMAT_CONTROL */
        // pluginFormatControl
      ],
      [
        /* TYPING_CSS_NORMALIZE */
        typingCssNormalizeFactory(options.punctuators)
      ]
    ).tokens
  )

export default tokenize
