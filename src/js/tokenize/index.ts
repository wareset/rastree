/* eslint-disable max-len */
import tokenizer from '../../lib/tokenizer'
import { ITokens, ITokenizerOptions } from '../../lib/tokenizer'

export interface ITokenizerJsOptions extends ITokenizerOptions {
  jsx?: boolean
  customTemplate?: boolean | [string | RegExp, string | RegExp]
}

const TOKENIZER_JS_OPTIONS: ITokenizerJsOptions = {
  jsx: true,
  customTemplate: false
}

/*
PLUGINS
*/
/* PLUGIN_DUMMY */
import pluginDummy from '../../lib/tokenizer/plugins/plugin-dummy'
/* CUSTOM_TEMPLATE */
import { pluginCustomTemplateFactory } from './plugins/custom-template'
/* JSX */
import { pluginJSX } from './plugins/jsx'
/* COMMENT */
import {
  pluginMultiLineComment,
  pluginSingleLineComment
} from './plugins/comment'
/* STRING */
import { pluginDoubleString, pluginSingleString } from './plugins/string'
/* TEMPLATE */
import { pluginTemplate } from './plugins/template'
/* SPACES */
import {
  pluginLineTerminator,
  pluginWhiteSpace,
  pluginFormatControl
} from './plugins/spaces'
/* BRACKETS */
import { pluginBrackets } from './plugins/brackets'
/* REGULAR_EXPRESSION */
import { pluginRegularExpression } from './plugins/regular-expression'
/* FIX_NUMERIC */
import { fixNumeric } from './plugins/fix-numeric'
/* PUNCTUATOR */
import { pluginPunctuator } from './plugins/punctuator'

/*
TYPINGS
*/
/* TYPING_NULL */
import { typingNull } from './typings/null'
/* TYPING_BOOLEAN */
import { typingBoolean } from './typings/boolean'
/* TYPING_NUMERIC */
import { typingNumeric } from './typings/numeric'
/* TYPING_RESERVED_WORD */
import { typingReservedWord } from './typings/reserved-word'
/* TYPING_IDENTIFIER */
import { typingIdentifier } from './typings/identifier'

export const tokenize = (
  source: string,
  options: ITokenizerJsOptions = TOKENIZER_JS_OPTIONS
): ITokens =>
  (options = { ...TOKENIZER_JS_OPTIONS, ...options }) &&
  tokenizer(
    source,
    options,
    [
      /* CUSTOM_TEMPLATE */
      pluginCustomTemplateFactory(options.customTemplate),
      /* JSX */
      options.jsx ? pluginJSX : pluginDummy,
      /* COMMENT */
      pluginMultiLineComment,
      pluginSingleLineComment,
      /* STRING */
      pluginDoubleString,
      pluginSingleString,
      /* TEMPLATE */
      pluginTemplate,

      /* SPACES */
      /* LINE_TERMINATOR */
      pluginLineTerminator,
      /* WHITE_SPACE */
      pluginWhiteSpace,
      /* FORMAT_CONTROL */
      pluginFormatControl,

      /* BRACKETS */
      pluginBrackets,
      /* REGULAR_EXPRESSION */
      pluginRegularExpression,
      /* FIX_NUMERIC */
      fixNumeric,
      /* PUNCTUATOR */
      pluginPunctuator
    ],
    [
      /* TYPING_NULL */
      typingNull,
      /* TYPING_BOOLEAN */
      typingBoolean,
      /* TYPING_NUMERIC */
      typingNumeric,
      /* TYPING_RESERVED_WORD */
      typingReservedWord,
      /* TYPING_IDENTIFIER */
      typingIdentifier
    ]
  ).tokens

export default tokenize
