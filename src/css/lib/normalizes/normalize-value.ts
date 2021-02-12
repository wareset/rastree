import { length as len, test, splice, trim } from 'wareset-utilites'

import { trimCss } from '../trim-css'

import { tokenizer } from '../../../lib/tokenizer'
import {
  Token,
  IToken,
  ITokens,
  ITokenizer,
  ITokenizerPluginFn
} from '../../../lib/tokenizer'

import { TYPE_STRING } from '../../../js/flags'
import { SEPARATOR, TYPE_PUNCTUATOR } from '../../flags'

/*
PLUGINS
*/
/* COMMENT */
import {
  pluginMultiLineComment,
  pluginSingleLineComment
} from '../../../js/tokenize/plugins/comment'
/* STRING */
import { pluginStringFactory } from '../../tokenize/plugins/css-string'
export const pluginValDoubleString = pluginStringFactory('"', !1, TYPE_STRING)
export const pluginValSingleString = pluginStringFactory("'", !1, TYPE_STRING)
export const pluginValTemplateString = pluginStringFactory('`', !1, TYPE_STRING)
/* SEPARATOR */
import { pluignCssSeparator } from '../../tokenize/plugins/css-spaces'
/* BRACKETS */
import { pluginBrackets } from '../../../js/tokenize/plugins/brackets'
/* FIX_NUMERIC */
import { fixNumeric } from '../../../js/tokenize/plugins/fix-numeric'
/* PUNCTUATOR */
// import { pluginPunctuator } from '../../../js/tokenize/plugins/punctuator'

const newSep = (deep = 0): IToken => new Token(deep, ' ', SEPARATOR)

const fixTokens = (tokens: ITokens, isAtRule?: boolean): ITokens => {
  // console.log(tokens)

  let token: IToken, tokenLast: IToken, tokenNext: IToken
  let i = -1

  while (++i < len(tokens)) {
    token = tokens[i]
    tokenLast = tokens[i - 1] || ({} as IToken)
    tokenNext = tokens[i + 1] || ({} as IToken)

    if (token.type === SEPARATOR) token.raw = ' '
    else if (token.type === TYPE_PUNCTUATOR) {
      if (test(/^[(]$/, token.raw)) {
        if (tokenNext.type === SEPARATOR) splice(tokens, i + 1, 1)
        if (isAtRule) {
          if (tokenLast.type !== SEPARATOR) splice(tokens, i, 0, newSep())
        } else {
          if (tokenLast.type === SEPARATOR) splice(tokens, i - 1, 1), --i
        }
      } else if (test(/^[):;,]$/, token.raw)) {
        if (tokenLast.type === SEPARATOR) splice(tokens, i - 1, 1), --i
        if (tokenNext.type !== SEPARATOR) splice(tokens, i + 1, 0, newSep())
      } else {
        if (tokenNext.type === SEPARATOR) splice(tokens, i + 1, 1)
        if (tokenLast.type === SEPARATOR) splice(tokens, i - 1, 1), --i
      }
    }
  }
  return tokens
}

const pluginFastPunctuator: ITokenizerPluginFn = (self: ITokenizer) => (
  raw = self.raw
): boolean => test(/^[[\]:,;/()]$/, raw()) && !self.save(TYPE_PUNCTUATOR, raw())

export const tokenizeValue = (source: string, isAtRule?: boolean): ITokens =>
  fixTokens(
    tokenizer(
      trimCss(source),
      { separators: true, comments: false },
      [
        /* COMMENT */
        pluginMultiLineComment,
        pluginSingleLineComment,

        /* STRING */
        pluginValDoubleString,
        pluginValSingleString,
        pluginValTemplateString,

        /* SEPARATOR */
        pluignCssSeparator,

        /* BRACKETS */
        pluginBrackets,

        /* FIX_NUMERIC */
        fixNumeric,
        /* PUNCTUATOR */
        pluginFastPunctuator
      ],
      []
    ).tokens,
    isAtRule
  )

export const normalizeValue = (s: string, isAtRule?: boolean): string =>
  trim(
    tokenizeValue(s, isAtRule)
      .map((v) => v.raw)
      .join('')
  )
