/* eslint-disable max-len */
import tokenizer from '../../lib/tokenizer'
import { ITokens, ITokenizerOptions } from '../../lib/tokenizer'
import { cssify } from '../lib/cssify'

export interface ITokenizeConciseCssOptions extends ITokenizerOptions {
  indent?: string | RegExp
  // jsx?: boolean
  // customTemplate?: boolean | [string | RegExp, string | RegExp]
}

const TOKENIZE_CONCISE_CSS_OPTIONS: ITokenizeConciseCssOptions = {
  indent: /\s|\t/
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
// /* STRING */
import {
  pluginCssDoubleString,
  pluginCssSingleString,
  pluginCssTemplateString
} from '../tokenize/plugins/css-string'
/* SPACES */
import {
  pluginLineTerminator
  // pluginWhiteSpaceFast,
  // pluginFormatControlFast
} from '../../js/tokenize/plugins/spaces'
// /* BRACKETS */
// import { pluginBrackets } from '../../js/tokenize/plugins/brackets'
// /* PUNCTUATOR */
// import {
//   pluginColonPunctuator,
//   pluginSemicolonPunctuator
// } from './plugins/css-colons'

import { cssConciseFix } from './plugins/css-concise-fix'

/*
TYPINGS
*/
/* TYPING_CSS_NORMALIZE */
import { typingCssConciseNormalizeFactory } from './typings/css-concise-normalize'

export const tokenizeConcise = (
  source: string,
  options?: ITokenizeConciseCssOptions
): ITokens =>
  (options = { ...TOKENIZE_CONCISE_CSS_OPTIONS, ...(options || {}) }) &&
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
        /* SPACES */
        /* LINE_TERMINATOR */
        pluginLineTerminator,
        /* WHITE_SPACE */
        // pluginWhiteSpace,
        /* FORMAT_CONTROL */
        // pluginFormatControl,
        /* BRACKETS */
        // pluginBrackets,
        /* PUNCTUATOR */
        // pluginColonPunctuator,
        // pluginSemicolonPunctuator
        cssConciseFix
      ],
      [
        /* TYPING_CSS_NORMALIZE */
        typingCssConciseNormalizeFactory(options.indent!)
      ]
    ).tokens
  )

export default tokenizeConcise
