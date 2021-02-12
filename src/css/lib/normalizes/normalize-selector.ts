import { test, length, splice, findIndex, trim } from 'wareset-utilites'

import { trimCss } from '../trim-css'

import { tokenizer } from '../../../lib/tokenizer'
import {
  Token,
  IToken,
  ITokens,
  ITokenizer,
  ITokenizerPluginFn
} from '../../../lib/tokenizer'

/*
PLUGINS
*/
/* COMMENT */
import {
  pluginMultiLineComment,
  pluginSingleLineComment
} from '../../../js/tokenize/plugins/comment'
/* STRING */
import {
  pluginCssDoubleString,
  pluginCssSingleString,
  pluginCssTemplateString
} from '../../tokenize/plugins/css-string'
/* SPACES */
import { pluginWhiteSpace } from '../../../js/tokenize/plugins/spaces'
/* BRACKETS */
import {
  pluginBracketsFactory,
  pluginFixBracketsFactory
} from '../../tokenize/plugins/css-brackets'
import { TYPE_PUNCTUATOR, TYPE_WHITE_SPACE } from '../../flags'
const pluginBrackets = pluginBracketsFactory(
  [undefined, true],
  [undefined, TYPE_PUNCTUATOR],
  []
)
const pluginFixBrackets = pluginFixBracketsFactory(['{', '['], ['}', ']'])

/* TYPE_COMMA */
const TYPE_COMMA = 'C' + TYPE_PUNCTUATOR
const pluginCPunctuator: ITokenizerPluginFn = (self: ITokenizer) => (
  raw = self.raw
): boolean => raw() === ',' && !self.save(TYPE_COMMA, raw())

/* AMPERSAND */
const TYPE_AMPERSAND = 'A' + TYPE_PUNCTUATOR
const pluginAPunctuator: ITokenizerPluginFn = (self: ITokenizer) => (
  raw = self.raw
): boolean => raw() === '&' && !self.save(TYPE_AMPERSAND, raw())

/* TYPE_SPUNCTUATOR */
const TYPE_SP = 'S' + TYPE_PUNCTUATOR
const pluginSPunctuator: ITokenizerPluginFn = (self: ITokenizer) => (
  raw = self.raw
): boolean => test(/^[+>~]$/, raw()) && !self.save(TYPE_SP, raw())

export const testIsGlobalOrScoped = (s: string): boolean =>
  test(/^:(global|scoped|common)$/, s)

// const isClearingType = (s: string) =>
//   includes([TYPE_AMPERSAND, TYPE_PUNCTUATOR], s)

const fixTokens = (tokens: ITokens): ITokens => {
  let deep: number
  let token: IToken, tokenLast: IToken, tokenNext: IToken
  let i = length(tokens)
  let isAmpersand = false
  let idx: number

  while (--i >= 0) {
    token = tokens[i]
    tokenLast = tokens[i - 1]
    tokenNext = tokens[i + 1]

    if (token.type !== TYPE_SP) token.type = ''
    if (tokenLast && tokenLast.type !== TYPE_SP) tokenLast.type = ''
    if (tokenNext && tokenNext.type !== TYPE_SP) tokenNext.type = ''

    // if (token.type === TYPE_AMPERSAND) token.type = undefined

    // if (test(/^:(global|scoped)$/, token.raw)).

    if (token.raw === '&') isAmpersand = true

    if (!isAmpersand && (!i || token.raw === ',')) {
      deep = token.deep
      // prettier-ignore
      splice(tokens, (i || -1) + 1, 0,
        new Token(deep, '&', ''), new Token(deep, ' ', ''))
    }

    if (
      (!trim(token.raw) &&
        (!tokenLast ||
          !tokenNext ||
          tokenLast.type ||
          tokenNext.type ||
          tokenLast.raw === ',' ||
          tokenNext.raw === ',' ||
          !trim(tokenLast.raw) ||
          !trim(tokenNext.raw))) ||
      (token.type === TYPE_SP && tokenNext && tokenNext.type === TYPE_SP)
    ) {
      splice(tokens, i, 1)
    } else {
      if (token.type === TYPE_WHITE_SPACE) token.raw = ' '
      else if (token.raw === ',') isAmpersand = false
      else if (
        token.raw === '(' &&
        (!tokenLast || !testIsGlobalOrScoped(tokenLast.raw))
      ) {
        idx = findIndex(
          tokens,
          (v, k) => k > i && v.raw === ')' && v.deep === token.deep
        )
        if (idx > -1) {
          token.raw += splice(tokens, i + 1, idx - i)
            .map((v) => v.raw)
            .join('')
        }
        if (idx < 0 || (tokenLast && (tokenLast.raw += token.raw))) {
          splice(tokens, i, 1)
        }
      }
    }
  }

  return tokens
}

export const tokenizeSelector = (source: string): ITokens =>
  fixTokens(
    tokenizer(
      trimCss(source),
      { separators: true, comments: false },
      [
        /* COMMENT */
        pluginMultiLineComment,
        pluginSingleLineComment,

        /* STRING */
        pluginCssDoubleString,
        pluginCssSingleString,
        pluginCssTemplateString,

        /* BRACKETS */
        pluginBrackets,
        pluginFixBrackets,

        /* WHITE_SPACE */
        pluginWhiteSpace,

        pluginCPunctuator,
        pluginAPunctuator,
        pluginSPunctuator
      ],
      []
    ).tokens
  )

export const normalizeSelector = (s: string): string[] =>
  tokenizeSelector(s).map((v) => v.raw)
