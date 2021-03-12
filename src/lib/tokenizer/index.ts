/* eslint-disable max-len */
import {
  includes,
  isVoid,
  length,
  push,
  pop,
  shift,
  splice,
  unshift,
  last,
  findLast,
  forEach
} from 'wareset-utilites'

import {
  ITokenizer,
  ITokenizerOptions,
  ITokenizerPluginFn,
  ITokenizerTypingFn,
  ITokenizerEnvFn,
  IToken,
  Token
} from './lib/interfaces'

import {
  TYPE_COMMENT,
  TYPE_FORMAT_CONTROL,
  TYPE_LINE_TERMINATOR,
  TYPE_WHITE_SPACE
} from '../flags'

import { ENV_STYLE, ENV_STYLE_CONCISE, ENV_TEMPLATE_CONCISE } from './env/types'

/*
PLUGINS
*/
/* ENV */
import { pluginEnv } from './plugins/env'
/* CUSTOM_TEMPLATE */
import { pluginCustomTemplateFactory } from './plugins/custom-template'
/* JSX */
import { pluginJSXFactory } from './plugins/jsx'
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
  // pluginFastSeparator
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

/*
ENV
*/
import {
  envStyleNormalize,
  envStyleConciseNormalize,
  envTemplateConciseNormalize
} from './env/normalizes'

import {
  TYPE_JSX_CHILDLESS_ELEMENT,
  TYPE_JSX_OPENING_ELEMENT,
  TYPE_JSX_CLOSING_ELEMENT,
  TYPE_JSX_TEXT,
  TYPE_JSX_OPENING_ELEMENT_START,
  TYPE_JSX_OPENING_ELEMENT_END,
  TYPE_JSX_CLOSING_ELEMENT_START,
  TYPE_JSX_CLOSING_ELEMENT_END
} from '../flags'

import {
  TYPE_JSX_EXPRESSION,
  TYPE_JSX_EXPRESSION_START,
  TYPE_JSX_EXPRESSION_END
} from '../flags'

export const joinJSXElements = (self: ITokenizer): any => {
  let TOKEN = self.token()
  if (TOKEN.type === TYPE_JSX_TEXT) TOKEN = self.token(1)
  const { type, deep, end, loc } = TOKEN
  let isOpener: boolean
  let isExpression: boolean

  if (
    (isOpener = type === TYPE_JSX_OPENING_ELEMENT_END) ||
    (isExpression = type === TYPE_JSX_EXPRESSION_END) ||
    type === TYPE_JSX_CLOSING_ELEMENT_END
  ) {
    const tokens = self.tokens()

    let kEnd = 0
    let kStart = 0
    const tokenStart = findLast(tokens, (token, k): any => {
      if (token! === TOKEN!) kEnd = k
      else {
        kStart = k
        const type = token.type
        // prettier-ignore
        return isOpener
          ? type === TYPE_JSX_OPENING_ELEMENT_START
          : isExpression
            ? type === TYPE_JSX_EXPRESSION_START
            : type === TYPE_JSX_CLOSING_ELEMENT_START
      }
    })

    const tokensSliced: IToken[] = []
    forEach(splice(tokens, kStart + 1, kEnd - kStart), (token) => {
      push(tokensSliced, token)
      tokenStart.raw += token.raw
    })
    tokenStart.value = tokenStart.raw
    tokenStart.end = end
    if (loc) tokenStart.loc!.end = loc.end

    if (isOpener) {
      tokenStart.type =
        tokenStart.deep === deep
          ? TYPE_JSX_CHILDLESS_ELEMENT
          : TYPE_JSX_OPENING_ELEMENT
    } else if (isExpression!) {
      tokenStart.type = TYPE_JSX_EXPRESSION
      pop(tokensSliced)
      tokenStart.children = tokensSliced
    } else {
      tokenStart.deep--
      tokenStart.type = TYPE_JSX_CLOSING_ELEMENT
      tokenStart.value = '</>'

      let run = false
      findLast(tokens, (token): any => {
        if (token! === tokenStart!) run = true
        else if (
          token.deep === tokenStart.deep &&
          token.type === TYPE_JSX_OPENING_ELEMENT
        ) {
          return true
        } else if (run) token.deep--
      })
    }
  }
}

const TOKENIZER_OPTIONS: ITokenizerOptions = {
  loc: true,
  // separators: false,
  // comments: false,
  values: false,
  customTemplate: false,
  env: 'script'
  // strict: true
}

const HIDDEN_TYPES = [
  TYPE_COMMENT,
  TYPE_FORMAT_CONTROL,
  TYPE_LINE_TERMINATOR,
  TYPE_WHITE_SPACE
]

const EXTRA_ENVS = [ENV_STYLE, ENV_STYLE_CONCISE, ENV_TEMPLATE_CONCISE]

const DEFAULT_DUMMY_VALUE = {}
const TOKEN_DUMMY: IToken = new Token(-999, '', '')

export const tokenizer = (source: string, options?: ITokenizerOptions): any => {
  options = options = { ...TOKENIZER_OPTIONS, ...(options || {}) }
  const optionsLoc = !!options.loc

  const optionsEnv = options.env

  const __env: string[] = [optionsEnv!]
  const env = (addOrRemove?: string | false): string[] => (
    !isVoid(addOrRemove) &&
      (addOrRemove === false ? shift(__env) : unshift(__env, addOrRemove)),
    __env
  )

  let __deep = 0
  const deep = (offset = 0): number => (__deep += offset)

  const temp = { JSX_DEEPS: optionsEnv === 'template' ? [-1] : [] }

  const PLUGINS: ITokenizerPluginFn[] = [
    pluginEnv,

    /* CUSTOM_TEMPLATE */
    pluginCustomTemplateFactory(options.customTemplate),

    /* JSX */
    pluginJSXFactory(temp.JSX_DEEPS),

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
  ]

  const TYPINGS: ITokenizerTypingFn[] = [
    /* TYPING_JSX */
    // typingJSX,
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

  const ENVS: ITokenizerEnvFn[] = [
    envStyleNormalize,
    envStyleConciseNormalize,
    envTemplateConciseNormalize
  ]

  let plugins: Function[] = []
  let typings: Function[] = []
  let envs: Function[] = []

  const tokens: any = []

  let i = -1
  const sourceLen = length(source)
  const index = (offset = 0): number => (i += offset)

  const char = (n = 0): string => source[i + n] || ''
  let __raw: string = ''
  const raw = (): string => __raw
  let __slashed = false
  const slashed = (): boolean => __slashed

  let num = 0
  let locStart = { line: 1, column: 0 }
  const locEnd = { line: 1, column: 0 }

  let __curChar = ''
  const __next = (count: number, slashed?: boolean): void => {
    ++i
    __raw += __curChar = char()
    if (__curChar === '\n') {
      locEnd.line++
      locEnd.column = 0
    } else locEnd.column++
    __slashed = !!slashed
    if (!__slashed && __curChar === '\\') __next(0, true)
    if (count > 1) __next(count - 1)
  }
  const next = (count = 0): boolean => (__next(count), !!__curChar)

  let tkn: IToken | undefined

  const token = (offset = 0): IToken => last(tokens, offset) || TOKEN_DUMMY
  const tokenSafe = (
    offset: number = 0,
    cb?: (token: Token, k: number, source: Token[]) => boolean
  ): IToken => (
    (offset = Math.abs(offset)),
    findLast(
      tokens,
      (v: IToken, k, a) =>
        !includes(HIDDEN_TYPES, v.type) && (!cb || cb(v, k, a)) && !offset--
    ) || TOKEN_DUMMY
  )

  const save = (
    type: string,
    flags: string[] = [],
    value: any = DEFAULT_DUMMY_VALUE
  ): any => {
    if ((tkn = last(tokens))) {
      if (!__raw || tkn.type || tkn.type !== type) {
        typings.forEach((typing) => typing(tkn))
        if (tkn.value === DEFAULT_DUMMY_VALUE) tkn.value = tkn.raw
      }
    }

    if (__raw) {
      if (type || !tkn || tkn.type) {
        tkn = new Token(__deep, __raw, type, flags, value)
        tkn.start = num
        if (optionsLoc) tkn.loc = { start: { ...locStart }, end: { ...locEnd } }
        push(tokens, tkn)
      } else {
        tkn.raw += __raw
        if (optionsLoc) tkn.loc!.end = { ...locEnd }
      }

      locStart = { ...locEnd }
      tkn.end = num = tkn.start + length(tkn.raw)
      __raw = ''
    }
  }

  const error = (...a: any[]): any => {
    console.error('ERROR', ...a)
  }

  // prettier-ignore
  const self: ITokenizer = {
    temp, options,
    tokens: (): Token[] => tokens,
    source: (): string => source,
    index, env,
    token, tokenSafe,
    char, next, deep, raw, save, slashed, error
  }

  plugins = PLUGINS.map((v) => v(self))
  typings = TYPINGS.map((v) => v(self))
  envs = ENVS.map((v) => v(self))

  do {
    next()
    __raw ? plugins.some((plugin) => !__raw || plugin()) || save('') : save('')
    // if (i >= sourceLen) __env.length = 0
    envs.forEach((env) => env())
    joinJSXElements(self)
  } while (i < sourceLen)

  if (!includes(EXTRA_ENVS, __env[0])) {
    if ((tkn = last(tokens)) && tkn.deep) error()
  }

  return tokens
}

export default tokenizer
