import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'

import isNotPunctuator from './lib/is-not-punctuator'

import {
  // JSX_ELEMENT,
  // JSX_ATTRIBUTE,
  // JSX_IDENTIFIER,
  // JSX_OPENING_ELEMENT,
  JSX_OPENING_ELEMENT_START,
  JSX_OPENING_ELEMENT_END,
  // JSX_CLOSING_ELEMENT,
  JSX_CLOSING_ELEMENT_START,
  JSX_CLOSING_ELEMENT_END,
  JSX_EXPRESSION_CONTAINER_START,
  JSX_EXPRESSION_CONTAINER_END,
  // JSX_EXPRESSION_CONTAINER,
  JSX_TEXT
} from '../../flags'

/* JSX CLOSING TAG */
const createJsxClosingTag = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any,
  TEMP_CLOSER: any
): any => {
  self.deep--, self.next()
  self.save(JSX_CLOSING_ELEMENT_START)
  // TYPE = JSX_IDENTIFIER
  TEMP.shift(), (TEMP_OPENER[0] = false)
  TEMP.unshift(self.deep), (TEMP_CLOSER[0] = true)
}

const quessJsxClosingTag = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any,
  TEMP_CLOSER: any
): any =>
  self.raw() === '<' &&
  self.char(1) === '/' &&
  TEMP[0] === self.deep - 1 &&
  !createJsxClosingTag(self, TEMP, TEMP_OPENER, TEMP_CLOSER)

/* JSX CLOSE CHILDLESS TAG OR CLOSER TAG */
const createJsxClosingChildless = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any,
  TEMP_CLOSER: any
): any => {
  if (self.raw() === '/') self.next()
  self.deep--

  self.save(TEMP_CLOSER[0] ? JSX_CLOSING_ELEMENT_END : JSX_OPENING_ELEMENT_END)
  TEMP.shift()
  if (TEMP_CLOSER[0]) TEMP_CLOSER[0] = false
  else TEMP_OPENER[0] = false
}

const quessJsxClosingChildless = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any,
  TEMP_CLOSER: any
): any =>
  TEMP[0] === self.deep &&
  ((TEMP_CLOSER[0] && self.raw() === '>') ||
    (TEMP_OPENER[0] && self.raw() === '/' && self.char(1) === '>')) &&
  !createJsxClosingChildless(self, TEMP, TEMP_OPENER, TEMP_CLOSER)

/* JSX OPENING TAG */
const createJsxOpeningTag = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any
): any => {
  self.save(JSX_OPENING_ELEMENT_START), self.deep++
  // TYPE = JSX_IDENTIFIER
  TEMP.unshift(self.deep), (TEMP_OPENER[0] = true)
}

const quessJsxOpeningTag = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any,
  TEMP_CLOSER: any
): any =>
  self.raw() === '<' &&
  !TEMP_OPENER[0] &&
  !TEMP_CLOSER[0] &&
  self.char(1).trim() &&
  (TEMP[0] === self.deep - 1 || isNotPunctuator(self)) &&
  !createJsxOpeningTag(self, TEMP, TEMP_OPENER)

/* JSX CLOSE OPENING TAG OR INSIDE TAG CONTENT */
const createJsxCloseOpeningTagOrContent = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any,
  TYPE = ''
): any => {
  self.save(TYPE)
  if (self.token.raw === '>') self.deep++, (TEMP_OPENER[0] = false)
  TEMP = false
  // prettier-ignore
  $: while (!self.eof()) {
    if ((self.char(1) === '{' && (TEMP = true))
      || (self.char(1) === '<'
        && (self.char(2).trim()))) break $
    self.next()
  }
  if (self.raw()) self.save(JSX_TEXT)
  if (TEMP) {
    self.next()
    self.save(JSX_EXPRESSION_CONTAINER_START), self.deep++
  }
}

const quessJsxCloseOpeningTagOrContent = (
  self: ITokenizer,
  TEMP: any,
  TEMP_OPENER: any,
  TEMP_CLOSER: any,
  TYPE = ''
): any =>
  ((self.raw() === '>' &&
    TEMP[0] === self.deep &&
    (TYPE = JSX_OPENING_ELEMENT_END)) ||
    (self.raw() === '}' &&
      !TEMP_OPENER[0] &&
      !TEMP_CLOSER[0] &&
      TEMP[0] === self.deep - 2 &&
      self.deep-- &&
      (TYPE = JSX_EXPRESSION_CONTAINER_END))) &&
  !createJsxCloseOpeningTagOrContent(self, TEMP, TEMP_OPENER, TYPE)

export const pluginJSX: ITokenizerPluginFn = (
  self: ITokenizer,
  TEMP = [],
  TEMP_OPENER = [false],
  TEMP_CLOSER = [false]
) => (): boolean =>
  quessJsxClosingTag(self, TEMP, TEMP_OPENER, TEMP_CLOSER) ||
  quessJsxClosingChildless(self, TEMP, TEMP_OPENER, TEMP_CLOSER) ||
  quessJsxOpeningTag(self, TEMP, TEMP_OPENER, TEMP_CLOSER) ||
  quessJsxCloseOpeningTagOrContent(self, TEMP, TEMP_OPENER, TEMP_CLOSER)
