/* eslint-disable max-len */
import {
  test,
  includes,
  keys,
  values,
  size,
  replace,
  last
} from 'wareset-utilites'
import { getCharAt } from './lib/utils'
import { Token, IOptionsTokenizeJS } from './lib/interfaces'
import createCustomTemplatePatterns from './lib/custom-template'

import { TOKENS, SOURCE, LENGTH } from './lib/keys'
import { INDEX, STATE } from './lib/keys'
import { TEMP, TEMP_TEMPLATE, TEMP_JSX } from './lib/keys'
import { CHAR_PREV, CHAR, CHAR_NEXT } from './lib/keys'
import { DEEP, RAW, TYPE, FLAGS, FLAG } from './lib/keys'
import { IS_BACKSLASH, EOF } from './lib/keys'
import { TOKEN, TOKEN_LAST } from './lib/keys'
import { LINE, COLUMN, TEMP_LINE, TEMP_COLUMN, TEMP_BRACKETS } from './lib/keys'
import { OPTIONS_RANGE, OPTIONS_LOC } from './lib/keys'
import { OPTIONS_JSX, OPTIONS_REGEXP } from './lib/keys'
import { CUSTOM_TPL, TEMP_CUSTOM_TPL_DEEP } from './lib/keys'
import { TEMP_JSX_TAG_OPENER, TEMP_JSX_TAG_CLOSER } from './lib/keys'

// console.log(DEEP, VALUE, TOKEN)

/* ERROR */
import { ERROR } from './lib/flags'

/* CUSTOM_TEMPLATE */
import { TYPE_CUSTOM_TEMPLATE } from './lib/flags'

/* TEMPLATE */
// prettier-ignore
import { TYPE_TEMPLATE, NO_SUBSTITUTION_TEMPLATE, TEMPLATE_HEAD } from './lib/flags'
// prettier-ignore
import { TEMPLATE_SUBSTITUTION_TAIL, TEMPLATE_MIDDLE, TEMPLATE_TAIL } from './lib/flags'
import { INSIDE_TEMPLATE } from './lib/flags'
import { createTemplateValue } from './lexical-grammar/literals/template'

/* STRING */
// prettier-ignore
import { TYPE_STRING, DOUBLE_STRING_CHARACTERS, SINGLE_STRING_CHARACTERS } from './lib/flags'
import { createStringLiteralValue } from './lexical-grammar/literals/string'

/* COMMENT */
// prettier-ignore
import { TYPE_COMMENT, MULTI_LINE_COMMENT, SINGLE_LINE_COMMENT } from './lib/flags'
import { createCommentValue } from './lexical-grammar/comments'

/* REGULAR_EXPRESSION */
import { TYPE_REGULAR_EXPRESSION } from './lib/flags'
// prettier-ignore
import { createRegularExpressionValue } from './lexical-grammar/literals/regular-expression'

/* NUMERIC */
import { TYPE_NUMERIC } from './lib/flags'
// prettier-ignore
import { isNumericLiteral, createNumericLiteralValue } from './lexical-grammar/literals/numeric'

import {
  // REG_START_IS_NUNERIC,
  isDecimalLiteral,
  isDecimalIntegerLiteral,
  isDecimalBigIntegerLiteral
} from './lexical-grammar/literals/numeric'
// prettier-ignore
import { DECIMAL_LITERAL, DECIMAL_INTEGER_LITERAL, DECIMAL_BIGINTEGER_LITERAL } from './lib/flags'

import {
  isBinaryIntegerLiteral,
  isHexIntegerLiteral,
  isOctalIntegerLiteral
} from './lexical-grammar/literals/numeric'
// prettier-ignore
import { BINARY_INTEGER_LITERAL, HEX_INTEGER_LITERAL, OCTAL_INTEGER_LITERAL } from './lib/flags'
import { NON_DECIMAL_INTEGER_LITERAL } from './lib/flags'

import {
  isBinaryBigIntegerLiteral,
  isHexBigIntegerLiteral,
  isOctalBigIntegerLiteral
} from './lexical-grammar/literals/numeric'
// prettier-ignore
import { BINARY_BIGINTEGER_LITERAL, HEX_BIGINTEGER_LITERAL, OCTAL_BIGINTEGER_LITERAL } from './lib/flags'
import { NON_DECIMAL_BIGINTEGER_LITERAL } from './lib/flags'
import { NON_SUPPORT_BIGDECIMAL_LITERAL } from './lib/flags'

/* BOOLEAN */
import { TYPE_BOOLEAN } from './lib/flags'
import { isBooleanLiteral } from './lexical-grammar/literals/boolean'

/* NULL */
import { TYPE_NULL } from './lib/flags'
import { isNullLiteral } from './lexical-grammar/literals/null'

/* LITERAL */
import { LITERAL } from './lib/flags'

/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from './lib/flags'
import { isPunctuator } from './lexical-grammar/punctuators'

/* LINE_TERMINATOR */
import { TYPE_LINE_TERMINATOR } from './lib/flags'
// prettier-ignore
import { isLineTerminator, getLineTerminatorCodePoint } from './lexical-grammar/line-terminators'

/* WHITE_SPACE */
import { TYPE_WHITE_SPACE } from './lib/flags'
// prettier-ignore
import { isWhiteSpace, getWhiteSpaceCodePoint } from './lexical-grammar/white-space'

/* FORMAT_CONTROL */
import { TYPE_FORMAT_CONTROL } from './lib/flags'
// prettier-ignore
import { isFormatControl, getFormatControlCodePoint } from './lexical-grammar/format-control'

/* IDENTIFIER */
import { TYPE_IDENTIFIER } from './lib/flags'

/*
KEYWORD
*/
// prettier-ignore
import { isReservedWord, isReservedWordStrict } from './lexical-grammar/names-and-keywords'
import { TYPE_KEYWORD, RESERVED_WORD, RESERVED_WORD_STRICT } from './lib/flags'
// prettier-ignore
import { isReservedWordContextual, isWordContextual, isWordContextualStrict } from './lexical-grammar/names-and-keywords'
// prettier-ignore
import { RESERVED_WORD_CONTEXTUAL, WORD_CONTEXTUAL, WORD_CONTEXTUAL_STRICT } from './lib/flags'

/*
JSX
*/
import {
  INSIDE_JSX,
  INSIDE_JSX_TAG_OPENING,
  JSX_TAG_OPENING_START,
  JSX_TAG_OPENING_END,
  INSIDE_JSX_TAG_CLOSING,
  JSX_TAG_CLOSING_START,
  JSX_TAG_CLOSING_END,
  INSIDE_JSX_TEMPLATE_START,
  INSIDE_JSX_TEMPLATE_END,
  INSIDE_JSX_TEMPLATE,
  JSX_TEXT
} from './lib/flags'

const initialize = (self: any, step = 1): true => {
  ++self[INDEX]
  self[CHAR_PREV] = self[CHAR]
  self[CHAR] = getCharAt(self[SOURCE], self[INDEX])
  self[CHAR_NEXT] = getCharAt(self[SOURCE], self[INDEX] + 1)

  self[LINE] = self[TEMP_LINE]
  self[COLUMN] = self[TEMP_COLUMN]

  self[TEMP_COLUMN]++
  if (self[CHAR] === '\n') {
    self[TEMP_LINE]++
    self[TEMP_COLUMN] = 0
  }

  self[RAW] += self[CHAR]
  self[EOF] = !self[CHAR]

  if (step > 1) initialize(self, --step)
  return true
}

const insideJSX = (self: any): any => {
  if (self[OPTIONS_JSX]) {
    const flags = self[TOKEN].flags
    if (size(self[TEMP_JSX]) && !includes(flags, INSIDE_JSX)) {
      flags.push(INSIDE_JSX)
    }
    if (self[TEMP_JSX_TAG_OPENER] && !includes(flags, INSIDE_JSX_TAG_OPENING)) {
      flags.push(INSIDE_JSX_TAG_OPENING)
    }
    if (self[TEMP_JSX_TAG_CLOSER] && !includes(flags, INSIDE_JSX_TAG_CLOSING)) {
      flags.push(INSIDE_JSX_TAG_CLOSING)
    }
  }
}

const setValueTypeFlag = (self: any): any => {
  let { type, raw: value, flags } = self[TOKEN]
  let temp: any

  if (type === TYPE_CUSTOM_TEMPLATE) {
    value = replace(replace(value, self[CUSTOM_TPL][0]), self[CUSTOM_TPL][1])
  } else if (type === TYPE_TEMPLATE) {
    value = createTemplateValue(value)
  } else if (type === TYPE_STRING) {
    value = createStringLiteralValue(value)
  } else if (type === TYPE_COMMENT) {
    value = createCommentValue(value)
  } else if (type === TYPE_REGULAR_EXPRESSION) {
    value = createRegularExpressionValue(value)
  } else if (!type) {
    type = TYPE_IDENTIFIER
    const push = (...s: string[]): void => flags.push(...s)

    if (isNullLiteral(value)) {
      ;(type = TYPE_NULL), (value = null), push(LITERAL)
    } else if (isBooleanLiteral(value)) {
      ;(type = TYPE_BOOLEAN), (value = value === 'true'), push(LITERAL)
    } else if (isNumericLiteral(value)) {
      if (isDecimalLiteral(value)) push(DECIMAL_LITERAL)

      if (isDecimalIntegerLiteral(value)) {
        push(DECIMAL_INTEGER_LITERAL)
      } else if (
        (isBinaryIntegerLiteral(value) && push(BINARY_INTEGER_LITERAL)) ||
        (isHexIntegerLiteral(value) && push(HEX_INTEGER_LITERAL)) ||
        (isOctalIntegerLiteral(value) && push(OCTAL_INTEGER_LITERAL))
      ) {
        push(NON_DECIMAL_INTEGER_LITERAL)
      } else {
        if (isDecimalBigIntegerLiteral(value)) {
          push(DECIMAL_BIGINTEGER_LITERAL)
        } else if (
          // prettier-ignore
          (isBinaryBigIntegerLiteral(value) && push(BINARY_BIGINTEGER_LITERAL)) ||
          (isHexBigIntegerLiteral(value) && push(HEX_BIGINTEGER_LITERAL)) ||
          (isOctalBigIntegerLiteral(value) && push(OCTAL_BIGINTEGER_LITERAL))
        ) {
          push(NON_DECIMAL_BIGINTEGER_LITERAL)
        } else {
          push(NON_SUPPORT_BIGDECIMAL_LITERAL, ERROR)
        }
      }

      type = TYPE_NUMERIC
      ;(value = createNumericLiteralValue(value)), push(LITERAL)
    } else if ((temp = isReservedWord(value)) || isReservedWordStrict(value)) {
      ;(type = TYPE_KEYWORD), push(temp ? RESERVED_WORD : RESERVED_WORD_STRICT)
    } else {
      if (isReservedWordContextual(value)) push(RESERVED_WORD_CONTEXTUAL)
      else if (isWordContextual(value)) push(WORD_CONTEXTUAL)
      else if (isWordContextualStrict(value)) push(WORD_CONTEXTUAL_STRICT)
    }
  }

  self[TOKEN].type = type
  self[TOKEN].value = value
}

const saveLastToken = (self: any): any => {
  if (self[TOKEN]) {
    self[TOKEN].end = self[INDEX]

    setValueTypeFlag(self)

    if (self[OPTIONS_RANGE]) {
      self[TOKEN].range = [self[TOKEN].start, self[TOKEN].end]
    }

    if (self[OPTIONS_LOC]) {
      self[TOKEN].loc.end = { line: self[LINE], column: self[COLUMN] }
    }

    insideJSX(self)
  }
}

const saveToken = (self: any): any => {
  // console.log(['saveToken', self[TOKEN] && self[TOKEN].raw, self[RAW]])
  if (self[TOKEN]) {
    self[TOKEN].raw = self[RAW]
    if (self[FLAG]) self[TOKEN].flags.push(self[FLAG])
    self[RAW] = self[TYPE] = self[FLAG] = ''
    self[FLAGS] = []
  }
  return true
}

const endTokenize = (self: any): any => {
  if (self[TOKEN]) {
    if (self[RAW]) saveToken(self)
    saveLastToken(self)
  }
}

const BRACKETS: any = {
  '}': '{',
  ')': '(',
  ']': '['
}
const QUOTES_OPENERS = values(BRACKETS) // ['{', '[', '(']
const QUOTES_CLOSERS = keys(BRACKETS) // ['}', ']', ')']
// prettier-ignore
const setDeep = (self: any): any =>
  self[TYPE] !== TYPE_PUNCTUATOR
    ? self[DEEP]
    : (includes(QUOTES_CLOSERS, self[RAW]) && self[TEMP_BRACKETS][0] === BRACKETS[self[RAW]]
      ? --self[DEEP]
      : includes(QUOTES_OPENERS, self[RAW]) && self[TEMP_BRACKETS].unshift(self[RAW])
        ? self[DEEP]++
        : self[DEEP])

const DUMMY_TOKEN_TYPES = [TYPE_COMMENT, TYPE_WHITE_SPACE, TYPE_LINE_TERMINATOR]
const initToken = (self: any): any => {
  saveLastToken(self)

  if (self[RAW]) {
    // prettier-ignore
    self[TOKENS].push(
      (self[TOKEN] = new Token(setDeep(self), self[RAW], self[TYPE], (self[FLAGS] = []))))
    self[TOKEN].start = self[INDEX]

    insideJSX(self)

    if (size(self[TEMP_TEMPLATE])) {
      self[TOKEN].flags.push(INSIDE_TEMPLATE)
    }
    if (self[TEMP_JSX][0] < self[DEEP] - 1) {
      self[TOKEN].flags.push(INSIDE_JSX_TEMPLATE)
    }
    if (self[OPTIONS_LOC]) {
      self[TOKEN].loc = { start: { line: self[LINE], column: self[COLUMN] } }
    }

    if (!includes(DUMMY_TOKEN_TYPES, self[TYPE])) self[TOKEN_LAST] = self[TOKEN]
  }
  // console.log('initToken', self[RAW], self[TYPE], self[FLAG])
  return true
}

const createIdentifier = (self: any): any => {
  // if (self[RAW]) {
  if (!self[TOKEN] || self[TOKEN].type) initToken(self)
  else self[TOKEN].raw += self[RAW]
  self[RAW] = ''
  // }
}

// prettier-ignore
const __mayBeNotDivider__ = (self: any): boolean =>
  !self[TOKEN_LAST] ||
  /case|return/.test(self[TOKEN_LAST].raw) ||
  (self[TOKEN_LAST].type === TYPE_PUNCTUATOR && /[^.})\]]$/i.test(self[TOKEN_LAST].raw))

/* IS_BACKSLASH */
const quessBackslash = (self: any): any =>
  (self[IS_BACKSLASH] = self[CHAR] === '\\') && !initialize(self)

const doInitialize = (self: any): boolean =>
  initialize(self) && !quessBackslash(self) && !self[EOF]

/* CUSTOM_TEMPLATE */
const createCustomTemplate = (self: any): any => {
  self[DEEP] = 0
  if (!self[TOKEN] || self[TOKEN].type !== TYPE_CUSTOM_TEMPLATE) initToken(self)
  else self[RAW] = self[TOKEN].raw + self[RAW]

  let temp
  const regFQ = self[CUSTOM_TPL]
  do {
    temp =
      regFQ[0].test(self[RAW]) &&
      regFQ[2].test(self[RAW] + self[CHAR_NEXT]) &&
      !regFQ[0].test(self[RAW] + self[CHAR_NEXT])

    if (temp && self[DEEP]) temp = false
    if (!temp) doInitialize(self)
    else saveToken(self), self[DEEP]++
  } while (!temp && !self[EOF])
  if (regFQ[3]) {
    self[DEEP] = self[TEMP_CUSTOM_TPL_DEEP]
    self[TEMP_CUSTOM_TPL_DEEP] = +!self[DEEP]
  }
}
// prettier-ignore
const quessCustomTemplate = (self: any): any =>
  self[DEEP] < 2 &&
  (!self[DEEP] || self[EOF] || test(self[CUSTOM_TPL][1],
    self[SOURCE].slice(
      self[INDEX], self[INDEX] + size(self[CUSTOM_TPL][1].source)))) &&
  (self[TYPE] = TYPE_CUSTOM_TEMPLATE) &&
  !createCustomTemplate(self)

/* JSX */
/* JSX CLOSING TAG */
const createJsxClosingTag = (self: any): any => {
  self[TYPE] = JSX_TAG_CLOSING_START
  self[DEEP]--, initToken(self), initialize(self), saveToken(self)
  self[TEMP_JSX].shift(), (self[TEMP_JSX_TAG_OPENER] = false)
  self[TEMP_JSX].unshift(self[DEEP]), (self[TEMP_JSX_TAG_CLOSER] = true)
}
// prettier-ignore
const quessJsxClosingTag = (self: any): any =>
  self[CHAR] === '<' && self[CHAR_NEXT] === '/' &&
  self[TEMP_JSX][0] === self[DEEP] - 1 && !createJsxClosingTag(self)

/* JSX CLOSE CHILDLESS TAG OR CLOSER TAG */
const createJsxClosingChildless = (self: any): any => {
  // prettier-ignore
  self[TYPE] = self[TEMP_JSX_TAG_CLOSER] ? JSX_TAG_CLOSING_END : JSX_TAG_OPENING_END
  self[DEEP]--, initToken(self), saveToken(self), self[TEMP_JSX].shift()
  if (self[TEMP_JSX_TAG_CLOSER]) self[TEMP_JSX_TAG_CLOSER] = false
  else self[TEMP_JSX_TAG_OPENER] = false
}
// prettier-ignore
const quessJsxClosingChildless = (self: any): any =>
  self[TEMP_JSX][0] === self[DEEP] &&
  ((self[TEMP_JSX_TAG_CLOSER] && self[CHAR] === '>') ||
    (self[TEMP_JSX_TAG_OPENER] &&
      self[CHAR] === '/' && self[CHAR_NEXT] === '>' && initialize(self))) &&
  !createJsxClosingChildless(self)

/* JSX OPENING TAG */
const createJsxOpeningTag = (self: any): any => {
  self[TYPE] = JSX_TAG_OPENING_START
  initToken(self), saveToken(self), self[DEEP]++
  self[TEMP_JSX].unshift(self[DEEP]), (self[TEMP_JSX_TAG_OPENER] = true)
}
// prettier-ignore
const quessJsxOpeningTag = (self: any): any =>
  self[CHAR] === '<' &&
  !self[TEMP_JSX_TAG_OPENER] && !self[TEMP_JSX_TAG_CLOSER] &&
  self[CHAR_NEXT].trim() &&
  (self[TEMP_JSX][0] === self[DEEP] - 1 || __mayBeNotDivider__(self)) &&
  !createJsxOpeningTag(self)

/* JSX CLOSE OPENING TAG OR INSIDE TAG CONTENT */
const createJsxCloseOpeningTagOrContent = (self: any): any => {
  initToken(self), saveToken(self)
  if (self[TOKEN_LAST].raw === '>') {
    self[DEEP]++, (self[TEMP_JSX_TAG_OPENER] = false)
  }
  self[TEMP] = false
  // prettier-ignore
  $: while (!self[EOF]) {
    if ((self[CHAR_NEXT] === '{' && (self[TEMP] = true))
      || (self[CHAR_NEXT] === '<'
        && (getCharAt(self[SOURCE], self[INDEX] + 2)).trim())) break $
    doInitialize(self)
  }
  if (self[RAW]) {
    self[TYPE] = JSX_TEXT
    initToken(self), saveToken(self)
  }
  if (self[TEMP]) {
    self[TYPE] = INSIDE_JSX_TEMPLATE_START
    initialize(self), initToken(self), saveToken(self), self[DEEP]++
  }
}
// prettier-ignore
const quessJsxCloseOpeningTagOrContent = (self: any): any =>
  ((self[CHAR] === '>' &&
    self[TEMP_JSX][0] === self[DEEP] && (self[TYPE] = JSX_TAG_OPENING_END)) ||
    (self[CHAR] === '}' &&
      !self[TEMP_JSX_TAG_OPENER] && !self[TEMP_JSX_TAG_CLOSER] &&
      self[TEMP_JSX][0] === self[DEEP] - 2 && self[DEEP]-- &&
      (self[TYPE] = INSIDE_JSX_TEMPLATE_END))) &&
  !createJsxCloseOpeningTagOrContent(self)

/* TEMPLATE */
const createTemplate = (self: any): any => {
  initToken(self)
  self[FLAGS].push(LITERAL)
  !self[TEMP] && self[FLAGS].push(TEMPLATE_SUBSTITUTION_TAIL)
  // prettier-ignore
  while (doInitialize(self) && (self[IS_BACKSLASH] || !(
    (self[TEMP] = self[CHAR] === '`')
    || (self[CHAR] === '$' && self[CHAR_NEXT] === '{' && initialize(self)
      && ++self[DEEP] && self[TEMP_TEMPLATE].unshift(self[DEEP]))
  )));
  // prettier-ignore
  self[FLAG] = size(self[FLAGS]) < 2
    ? self[TEMP] ? NO_SUBSTITUTION_TEMPLATE : TEMPLATE_HEAD
    : self[TEMP] ? TEMPLATE_TAIL : TEMPLATE_MIDDLE
  saveToken(self)
}
// prettier-ignore
const quessTemplate = (self: any): any =>
  !self[TYPE] &&
  ((self[TEMP] = self[CHAR] === '`') ||
    (self[CHAR] === '}' &&
      self[TEMP_TEMPLATE][0] === self[DEEP] && self[DEEP]-- &&
      !(self[TEMP_TEMPLATE].shift() * 0))) &&
  (self[TYPE] = TYPE_TEMPLATE) && !createTemplate(self)

/* STRING */
const createString = (self: any): any => {
  initToken(self)
  self[FLAGS].push(LITERAL)
  self[FLAG] = self[TEMP] ? DOUBLE_STRING_CHARACTERS : SINGLE_STRING_CHARACTERS
  const quote = self[CHAR]
  while (doInitialize(self) && (self[IS_BACKSLASH] || self[CHAR] !== quote));
  saveToken(self)
}
// prettier-ignore
const quessString = (self: any): any =>
  ((self[TEMP] = self[CHAR] === '"') || self[CHAR] === "'") &&
  (self[TYPE] = TYPE_STRING) && !createString(self)

/* COMMENT */
const createComment = (self: any): any => {
  initToken(self)
  // prettier-ignore
  self[FLAG] = self[TEMP] ? MULTI_LINE_COMMENT : SINGLE_LINE_COMMENT
  initialize(self, self[TEMP] ? 3 : 1)
  // prettier-ignore
  while (!(self[TEMP]
    ? self[CHAR_PREV] === '*' && self[CHAR] === '/'
    : isLineTerminator(self[CHAR_NEXT])) && doInitialize(self));
  saveToken(self)
}
// prettier-ignore
const guessComment = (self: any): any =>
  self[CHAR] === '/' &&
  ((self[TEMP] = self[CHAR_NEXT] === '*') || self[CHAR_NEXT] === '/') &&
  (self[TYPE] = TYPE_COMMENT) && !createComment(self)

/* REGULAR_EXPRESSION */
const createRegularExpression = (self: any): any => {
  initToken(self)
  self[FLAGS].push(LITERAL)
  let is: any
  const __test__ = (): string | boolean =>
    (is = self[CHAR] === '[' ? 1 : self[CHAR] === ']' ? 0 : is) || self[CHAR]
  // prettier-ignore
  while (doInitialize(self) && (self[IS_BACKSLASH] || __test__() !== '/'));
  while (test(/[a-z]/, self[CHAR_NEXT]) && doInitialize(self));
  saveToken(self)
}
// prettier-ignore
const guessRegularExpression = (self: any): any =>
  self[CHAR] === '/' && __mayBeNotDivider__(self) &&
  (self[TYPE] = TYPE_REGULAR_EXPRESSION) && !createRegularExpression(self)

/* PUNCTUATOR */
const createPunctuator = (self: any): any => {
  initToken(self)
  if (self[CHAR] === '.') {
    // prettier-ignore
    if (self[CHAR] === self[CHAR_NEXT] &&
        self[CHAR] === getCharAt(self[SOURCE], self[INDEX] + 2)) initialize(self, 2)
  } else {
    while (isPunctuator(self[RAW] + self[CHAR_NEXT]) && doInitialize(self));
  }
  saveToken(self)
}
// prettier-ignore
const guessPunctuator = (self: any): any =>
  isPunctuator(self[RAW]) &&
  (self[TYPE] = TYPE_PUNCTUATOR) && !createPunctuator(self)

/*
SYSTEM_CHARACTERS
*/
// prettier-ignore
const createSystemCharacters = (self: any, __type__: string, __flagsFn__: any): any => {
  self[TYPE] = __type__
  initToken(self)
  self[FLAGS].push(...__flagsFn__(self[CHAR]))
  while (self[CHAR] === self[CHAR_NEXT] && doInitialize(self));
  saveToken(self)
}
/* LINE_TERMINATOR */
// prettier-ignore
const quessLineTerminator = (self: any): any =>
  isLineTerminator(self[CHAR]) &&
  !createSystemCharacters(self, TYPE_LINE_TERMINATOR, getLineTerminatorCodePoint)
/* WHITE_SPACE */
// prettier-ignore
const quessWhiteSpace = (self: any): any =>
  isWhiteSpace(self[CHAR]) &&
  !createSystemCharacters(self, TYPE_WHITE_SPACE, getWhiteSpaceCodePoint)
/* FORMAT_CONTROL */
// prettier-ignore
const quessFormatControl = (self: any): any =>
  isFormatControl(self[CHAR]) &&
  !createSystemCharacters(self, TYPE_FORMAT_CONTROL, getFormatControlCodePoint)

/* NUMERIC */
const isDigit = (s: string): boolean => test(/^\d$/, s)
const createFixNumeric = (
  self: any,
  char2 = getCharAt(self[SOURCE], self[INDEX] + 2),
  char3 = getCharAt(self[SOURCE], self[INDEX] + 3)
): any => {
  if (self[CHAR] === '.') {
    if (isDigit(self[CHAR_NEXT])) initialize(self)
    else if (isDigit(self[CHAR_PREV]) && test(/[eE]/, self[CHAR_NEXT])) {
      if (isDigit(char2)) initialize(self, 2)
      else if (test(/[-+]/, char2) && isDigit(char3)) initialize(self, 3)
    }
  } else if (
    self[TOKEN] &&
    !self[TOKEN].type &&
    test(/[eE]/, last(self[TOKEN].raw)) &&
    isDigit(self[CHAR_NEXT]) &&
    isDecimalLiteral(self[TOKEN].raw + '1')
  ) {
    initialize(self)
  }
}

const fixNumeric = (self: any): any =>
  test(/[-+.]/, self[CHAR]) && createFixNumeric(self)

export const OPTIONS_TOKENIZE_JS: IOptionsTokenizeJS = {
  range: true,
  loc: true,
  // backTicks: true,
  // singleQuotes: true,
  // doubleQuotes: true,
  regexp: true,
  customTemplate: false,
  jsx: true,
  strict: true
}

export const presizeTokenize = (
  source = '',
  options: IOptionsTokenizeJS = OPTIONS_TOKENIZE_JS
): any => {
  options = { ...OPTIONS_TOKENIZE_JS, ...(options || {}) }

  const tokens: any[] = []
  if (source) {
    const self: any = {}
    self[OPTIONS_RANGE] = options.range
    self[OPTIONS_LOC] = options.loc
    self[OPTIONS_JSX] = options.jsx
    self[OPTIONS_REGEXP] = options.regexp
    // prettier-ignore
    self[CUSTOM_TPL] = createCustomTemplatePatterns((options as any).customTemplate)
    self[TEMP_CUSTOM_TPL_DEEP] = 1

    self[TOKENS] = tokens
    self[SOURCE] = source
    self[LENGTH] = size(source)

    self[TEMP_TEMPLATE] = []
    self[TEMP_BRACKETS] = []

    self[TEMP_JSX] = []
    self[TEMP_JSX_TAG_OPENER] = false
    self[TEMP_JSX_TAG_CLOSER] = false

    self[INDEX] = -1
    self[STATE] = ''
    self[CHAR_PREV] = ''
    self[CHAR_NEXT] = ''
    self[CHAR] = ''
    self[DEEP] = 0
    self[RAW] = ''

    self[TYPE] = ''
    self[FLAG] = ''
    self[FLAGS] = []

    self[LINE] = 1
    self[COLUMN] = 0
    self[TEMP_LINE] = 1
    self[TEMP_COLUMN] = 0

    self[TOKEN] = null
    self[TOKEN_LAST] = null
    self[IS_BACKSLASH] = false
    self[EOF] = false

    while (self[INDEX] < self[LENGTH]) {
      self[TEMP] = false
      // prettier-ignore
      !initialize(self) ||
        /* IS_BACKSLASH */
        quessBackslash(self) ||
        /* CUSTOM_TEMPLATE */
        (self[CUSTOM_TPL] && quessCustomTemplate(self)) ||
        /* JSX */
        (self[OPTIONS_JSX] && (quessJsxClosingTag(self) || quessJsxClosingChildless(self) ||
        quessJsxOpeningTag(self) || quessJsxCloseOpeningTagOrContent(self))) ||
        /* TEMPLATE */
        quessTemplate(self) ||
        /* STRING */
        quessString(self) ||
        /* COMMENT */
        guessComment(self) ||
        /* REGULAR_EXPRESSION */
        (self[OPTIONS_REGEXP] && guessRegularExpression(self)) ||
        /* LINE_TERMINATOR */
        quessLineTerminator(self) ||
        /* WHITE_SPACE */
        quessWhiteSpace(self) ||
        /* FORMAT_CONTROL */
        quessFormatControl(self) ||
        /* NUMERIC */
        fixNumeric(self) ||
        /* PUNCTUATOR */
        guessPunctuator(self) ||
        /* IDENTIFIER */
        createIdentifier(self)
      if (self[EOF]) endTokenize(self)
    }
  }
  return tokens
}

export default presizeTokenize
