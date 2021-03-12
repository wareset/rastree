/* eslint-disable max-len */
import { test, shift, unshift, includes } from 'wareset-utilites'
// import { length as len } from 'wareset-utilites'
import { endsWith } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'

import { isLineTerminator } from '../../ecma/line-terminators'

import { isNotPunctuator } from './lib/is-not-punctuator'

import {
  // TYPE_JSX_ELEMENT,
  // TYPE_JSX_ATTRIBUTE,
  // TYPE_JSX_IDENTIFIER,
  // TYPE_JSX_OPENING_ELEMENT,
  TYPE_JSX_OPENING_ELEMENT_START,
  TYPE_JSX_OPENING_ELEMENT_END,
  // TYPE_JSX_CLOSING_ELEMENT,
  TYPE_JSX_CLOSING_ELEMENT_START,
  TYPE_JSX_CLOSING_ELEMENT_END,
  TYPE_JSX_EXPRESSION_START,
  TYPE_JSX_EXPRESSION_END,
  // TYPE_JSX_EXPRESSION,
  TYPE_JSX_TEXT
} from '../../flags'

import { ENV_TEMPLATE_CONCISE_CONTENT } from '../env/types'

// prettier-ignore
const TAGNAMES_CHILDLESS = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]

export const isScript = (ENV: string[], tag = ENV[0]): boolean =>
  !!tag && test(/^(?:templateConcise|(?:script|style)(?:Concise)?)$/, tag)
const isChildless = (ENV: string[], tag = ENV[0]): boolean =>
  !!tag && (tag[0] === '!' || includes(TAGNAMES_CHILDLESS, tag))

// const vardump = (...a: any): any => {
//   console.log('1212', ...a)
// }

/*
JSX CLOSING TAG
*/
const createJsxClosingTag = (
  { deep, save, next, env, char }: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean],
  TMP_CLOSER: [boolean]
): any => {
  if (char(2) === '>') env(false)
  env(TYPE_JSX_CLOSING_ELEMENT_START)
  deep(-1), next()
  save(TYPE_JSX_CLOSING_ELEMENT_START)
  // TYPE = TYPE_JSX_IDENTIFIER
  shift(TMP_DEEPS), (TMP_OPENER[0] = false)
  unshift(TMP_DEEPS, deep()), (TMP_CLOSER[0] = true)
}

const quessJsxClosingTag = (
  self: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean],
  TMP_CLOSER: [boolean],
  tmpDeep = self.deep()
): any =>
  self.raw() === '<' &&
  self.char(1) === '/' &&
  (TMP_DEEPS[0] === tmpDeep - 1 ||
    (TMP_DEEPS[0] === tmpDeep - 2 &&
      isScript(self.env()) &&
      (self.deep(-1) || 1))) &&
  !createJsxClosingTag(self, TMP_DEEPS, TMP_OPENER, TMP_CLOSER)

/*
JSX CLOSE CHILDLESS TAG OR CLOSER TAG
*/
const createJsxClosingChildless = (
  { deep, raw, next, save, env }: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean],
  TMP_CLOSER: [boolean]
): any => {
  shift(env())
  if (raw() === '/') next()
  deep(-1)

  save(
    TMP_CLOSER[0] ? TYPE_JSX_CLOSING_ELEMENT_END : TYPE_JSX_OPENING_ELEMENT_END
  )
  shift(TMP_DEEPS)
  if (TMP_CLOSER[0]) TMP_CLOSER[0] = false
  else TMP_OPENER[0] = false
}

const quessJsxClosingChildless = (
  self: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean],
  TMP_CLOSER: [boolean],
  tmpRaw = self.raw()
): any =>
  TMP_DEEPS[0] === self.deep() &&
  ((tmpRaw === '>' && (TMP_CLOSER[0] || isChildless(self.env()))) ||
    (tmpRaw === '/' && self.char(1) === '>' && TMP_OPENER[0])) &&
  !createJsxClosingChildless(self, TMP_DEEPS, TMP_OPENER, TMP_CLOSER)

/*
JSX OPENING TAG
*/
const createJsxOpeningTag = (
  { save, deep, env }: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean]
): any => {
  env(TYPE_JSX_OPENING_ELEMENT_START)
  save(TYPE_JSX_OPENING_ELEMENT_START), deep(1)
  // TYPE = TYPE_JSX_IDENTIFIER
  unshift(TMP_DEEPS, deep()), (TMP_OPENER[0] = true)
}

const quessJsxOpeningTag = (
  self: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean],
  TMP_CLOSER: [boolean],
  tmpTokenSafe = self.tokenSafe(),
  tmpChar1 = self.char(1)
): any =>
  self.raw() === '<' &&
  tmpChar1 !== '/' &&
  !TMP_OPENER[0] &&
  !TMP_CLOSER[0] &&
  tmpChar1.trim() &&
  (TMP_DEEPS[0] === self.deep() - 1 ||
    test(/>$/, tmpTokenSafe.raw) ||
    isNotPunctuator(tmpTokenSafe)) &&
  !createJsxOpeningTag(self, TMP_DEEPS, TMP_OPENER)

/*
JSX CLOSE OPENING TAG OR INSIDE TAG CONTENT
*/
const createJsxCloseOpeningTagOrContent = (
  { char, raw, next, deep, save, token, env }: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean],
  TYPE: string
): any => {
  if (TYPE) {
    save(TYPE)
    if (token().raw === '>') {
      deep(1), (TMP_OPENER[0] = false)
    }
  }
  let tmp = raw() === '{'
  if (isScript(env())) {
    deep(1)
  } else if (!tmp) {
    let __char1__: string
    const isConciseContent = env()[0] === ENV_TEMPLATE_CONCISE_CONTENT
    let endConciseContent = isConciseContent ? isLineTerminator(raw()) : 0

    // TODO
    let fixExit = false
    if (!endConciseContent) {
      // prettier-ignore
      $: while ((__char1__ = char(1)) &&
        (!isConciseContent || !isLineTerminator(__char1__) || !(endConciseContent = 1))) {
        if ((__char1__ === '{' && (tmp = true))
          || (__char1__ === '<'
            && (char(2).trim()))) break $
        next()
      }
      if (raw()) save(TYPE_JSX_TEXT)
      // if (isConciseContent) env(false)
    } else fixExit = true

    if (endConciseContent) {
      env(false), shift(TMP_DEEPS)
      deep(-1)
    }

    if (fixExit) return fixExit
    if (tmp) next()
  }
  if (tmp) {
    save(TYPE_JSX_EXPRESSION_START), deep(1)
  }
}

const quessJsxCloseOpeningTagOrText = (
  self: ITokenizer,
  TMP_DEEPS: number[],
  TMP_OPENER: [boolean],
  TMP_CLOSER: [boolean],
  tmpTYPE = '',
  tmpDeep = self.deep(),
  tmpRaw = self.raw()
): any =>
  ((tmpRaw === '>' &&
    TMP_DEEPS[0] === tmpDeep &&
    (tmpTYPE = TYPE_JSX_OPENING_ELEMENT_END)) ||
    (tmpRaw === '}' &&
      !TMP_OPENER[0] &&
      !TMP_CLOSER[0] &&
      TMP_DEEPS[0] === tmpDeep - 2 &&
      tmpDeep &&
      (self.deep(-1) || 1) &&
      (tmpTYPE = TYPE_JSX_EXPRESSION_END)) ||
    (TMP_DEEPS[0] === tmpDeep - 1 && !TMP_OPENER[0] && !TMP_CLOSER[0])) &&
  !createJsxCloseOpeningTagOrContent(self, TMP_DEEPS, TMP_OPENER, tmpTYPE)

const setTagsAndFixComments = (
  { tokenSafe, char, raw, next, env }: ITokenizer,
  TMP_OPENER: [boolean]
): any => {
  if (TMP_OPENER[0]) {
    const __tokenSafePrev__ = tokenSafe(1)
    if (__tokenSafePrev__.raw === '<') {
      const __env__ = env()
      // if (len(__env__)) __env__[0] = tokenSafe()!.raw

      if (__env__[0] === '!' && char() + char(1) === '--') {
        next(3)
        while (!(char(1) === '>' && endsWith(raw(), '--')) && next());
      }
    }
  }
}

export const pluginJSXFactory = (
  TMP_DEEPS: number[] = []
): ITokenizerPluginFn => (
  self: ITokenizer,
  TMP_OPENER = [false],
  TMP_CLOSER = [false]
) => (): boolean =>
  setTagsAndFixComments(self, TMP_OPENER) ||
  quessJsxClosingTag(self, TMP_DEEPS, TMP_OPENER, TMP_CLOSER) ||
  quessJsxClosingChildless(self, TMP_DEEPS, TMP_OPENER, TMP_CLOSER) ||
  quessJsxOpeningTag(self, TMP_DEEPS, TMP_OPENER, TMP_CLOSER) ||
  quessJsxCloseOpeningTagOrText(self, TMP_DEEPS, TMP_OPENER, TMP_CLOSER)
