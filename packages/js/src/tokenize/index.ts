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
import { INFINITY, NAN, UNDEFINED } from './lib/flags'

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
  JSX_ELEMENT,
  JSX_ATTRIBUTE,
  // JSX_IDENTIFIER,
  JSX_OPENING_ELEMENT,
  JSX_OPENING_ELEMENT_START,
  JSX_OPENING_ELEMENT_END,
  JSX_CLOSING_ELEMENT,
  JSX_CLOSING_ELEMENT_START,
  JSX_CLOSING_ELEMENT_END,
  JSX_EXPRESSION_CONTAINER_START,
  JSX_EXPRESSION_CONTAINER_END,
  JSX_EXPRESSION_CONTAINER,
  JSX_TEXT
} from './lib/flags'

export const OPTIONS_TOKENIZE_JS: IOptionsTokenizeJS = {
  range: true,
  loc: true,
  // backTicks: true,
  // singleQuotes: true,
  // doubleQuotes: true,
  spaces: false,
  regexp: true,
  comments: false,
  customTemplate: false,
  jsx: true,
  strict: true
}

const BRACKETS: any = { '}': '{', ')': '(', ']': '[' }
const QUOTES_OPENERS = values(BRACKETS)
const QUOTES_CLOSERS = keys(BRACKETS)
const DUMMY_TOKEN_TYPES = [TYPE_COMMENT, TYPE_WHITE_SPACE, TYPE_LINE_TERMINATOR]
const isDigit = (s: string): boolean => test(/^\d$/, s)

export const presizeTokenize = (
  source = '',
  options: IOptionsTokenizeJS = OPTIONS_TOKENIZE_JS
): any => {
  options = { ...OPTIONS_TOKENIZE_JS, ...(options || {}) }

  const tokens: any[] = []
  if (source) {
    const optionsRANGE = options.range
    const optionsLOC = options.loc
    const optionsJSX = options.jsx
    const optionsSPACES = options.spaces
    const optionsCOMMENTS = options.comments
    const optionsREGEXP = options.regexp
    // prettier-ignore
    const CUSTOM_TPL: any = createCustomTemplatePatterns((options as any).customTemplate)
    let TEMP_CUSTOM_TPL_DEEP = 1

    const TOKENS = tokens
    const SOURCE = source
    const LENGTH = size(source)

    let TEMP: any
    const TEMP_TEMPLATE: any[] = []
    const TEMP_BRACKETS: any[] = []

    const TEMP_JSX: any[] = []
    let TEMP_JSX_TAG_OPENER = false
    let TEMP_JSX_TAG_CLOSER = false

    let INDEX = -1
    let CHAR_PREV = ''
    let CHAR_NEXT = ''
    let CHAR = ''
    let DEEP = 0
    let RAW = ''

    let TYPE = ''
    let FLAG = ''
    let FLAGS: string[] = []

    let LINE = 1
    let COLUMN = 0
    let TEMP_LINE = 1
    let TEMP_COLUMN = 0

    let TOKEN: any = null
    let TOKEN_LAST: any = null
    let IS_BACKSLASH = false
    let EOF = false

    const initialize = (step = 1): true => {
      ++INDEX
      CHAR_PREV = CHAR
      CHAR = getCharAt(SOURCE, INDEX)
      CHAR_NEXT = getCharAt(SOURCE, INDEX + 1)

      LINE = TEMP_LINE
      COLUMN = TEMP_COLUMN

      TEMP_COLUMN++
      if (CHAR === '\n') {
        TEMP_LINE++
        TEMP_COLUMN = 0
      }

      RAW += CHAR
      EOF = !CHAR

      if (step > 1) initialize(--step)
      return true
    }

    const insideJSX = (): any => {
      if (optionsJSX) {
        const flags = TOKEN.flags
        if (size(TEMP_JSX) && !includes(flags, JSX_ELEMENT)) {
          flags.push(JSX_ELEMENT)
        }
        if (TEMP_JSX_TAG_OPENER && !includes(flags, JSX_OPENING_ELEMENT)) {
          flags.push(JSX_OPENING_ELEMENT)
        }
        if (TEMP_JSX_TAG_CLOSER && !includes(flags, JSX_CLOSING_ELEMENT)) {
          flags.push(JSX_CLOSING_ELEMENT)
        }

        if (
          TEMP_JSX[0] === DEEP &&
          TOKEN.raw === '=' &&
          (TEMP_JSX_TAG_OPENER || JSX_CLOSING_ELEMENT) &&
          TOKEN_LAST &&
          TOKEN_LAST.type === TYPE_IDENTIFIER
        ) {
          TOKEN_LAST.type = JSX_ATTRIBUTE
        }
      }
    }

    const setValueTypeFlag = (): any => {
      let { type, raw: value, flags } = TOKEN
      let temp: any

      if (type === TYPE_CUSTOM_TEMPLATE) {
        value = replace(replace(value, CUSTOM_TPL[0]), CUSTOM_TPL[1])
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
        const push = (...s: string[]): boolean => !!flags.push(...s)

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
        } else if (
          (temp = isReservedWord(value)) ||
          isReservedWordStrict(value)
        ) {
          type = TYPE_KEYWORD
          push(temp ? RESERVED_WORD : RESERVED_WORD_STRICT)
        } else {
          if (isReservedWordContextual(value)) push(RESERVED_WORD_CONTEXTUAL)
          else if (isWordContextual(value)) push(WORD_CONTEXTUAL)
          else if (isWordContextualStrict(value)) push(WORD_CONTEXTUAL_STRICT)
          else if (value === INFINITY) push(INFINITY), (value = Infinity)
          else if (value === 'NaN') push(NAN), (value = NaN)
          else if (value === 'undefined') push(UNDEFINED), (value = undefined)
        }
      }

      TOKEN.type = type
      TOKEN.value = value
    }

    const saveLastToken = (): any => {
      if (TOKEN) {
        TOKEN.end = INDEX

        setValueTypeFlag()

        if (optionsRANGE) {
          TOKEN.range = [TOKEN.start, TOKEN.end]
        }

        if (optionsLOC) {
          TOKEN.loc.end = { line: LINE, column: COLUMN }
        }

        insideJSX()

        TOKEN = null
      }
    }

    const saveToken = (): any => {
      if (TOKEN) {
        TOKEN.raw = RAW
        if (FLAG) TOKEN.flags.push(FLAG)
        RAW = TYPE = FLAG = ''
        FLAGS = []
      }
      return true
    }

    const endTokenize = (): any => {
      if (TOKEN) {
        if (RAW) saveToken()
        saveLastToken()
      }
    }

    // prettier-ignore
    const setDeep = (): any =>
      TYPE !== TYPE_PUNCTUATOR
        ? DEEP
        : (includes(QUOTES_CLOSERS, RAW) && TEMP_BRACKETS[0] === BRACKETS[RAW]
          ? --DEEP
          : includes(QUOTES_OPENERS, RAW) && TEMP_BRACKETS.unshift(RAW)
            ? DEEP++
            : DEEP)

    const initToken = (pushed = true): any => {
      saveLastToken()

      if (RAW) {
        TOKEN = new Token(setDeep(), RAW, TYPE, (FLAGS = []))
        TOKEN.start = INDEX

        if (pushed) {
          TOKENS.push(TOKEN)

          if (size(TEMP_TEMPLATE)) {
            TOKEN.flags.push(INSIDE_TEMPLATE)
          }
          if (TEMP_JSX[0] < DEEP - 1) {
            TOKEN.flags.push(JSX_EXPRESSION_CONTAINER)
          }
        }

        if (optionsLOC) {
          TOKEN.loc = { start: { line: LINE, column: COLUMN } }
        }

        insideJSX()

        if (!includes(DUMMY_TOKEN_TYPES, TYPE)) TOKEN_LAST = TOKEN
      }

      return true
    }

    const createIdentifier = (): any => {
      if (!TOKEN || TOKEN.type) initToken()
      else TOKEN.raw += RAW
      RAW = ''
    }

    // prettier-ignore
    const __mayBeNotDivider__ = (): boolean =>
      !TOKEN_LAST || /case|return/.test(TOKEN_LAST.raw) ||
      (TOKEN_LAST.type === TYPE_PUNCTUATOR && /[^.})\]]$/i.test(TOKEN_LAST.raw))

    /* IS_BACKSLASH */
    const quessBackslash = (): any =>
      (IS_BACKSLASH = CHAR === '\\') && !initialize()

    const doInitialize = (): boolean =>
      initialize() && !quessBackslash() && !EOF

    /*
    CUSTOM_TEMPLATE
    */
    const createCustomTemplate = (): any => {
      DEEP = 0
      if (!TOKEN || TOKEN.type !== TYPE_CUSTOM_TEMPLATE) initToken()
      else RAW = TOKEN.raw + RAW

      let temp
      do {
        temp =
          CUSTOM_TPL[0].test(RAW) &&
          CUSTOM_TPL[2].test(RAW + CHAR_NEXT) &&
          !CUSTOM_TPL[0].test(RAW + CHAR_NEXT)

        if (temp && DEEP) temp = false
        if (!temp) doInitialize()
        else saveToken(), DEEP++
      } while (!temp && !EOF)
      if (CUSTOM_TPL[3]) {
        DEEP = TEMP_CUSTOM_TPL_DEEP
        TEMP_CUSTOM_TPL_DEEP = +!DEEP
      }
    }
    // prettier-ignore
    const quessCustomTemplate = (): any =>
      DEEP < 2 && (!DEEP || EOF || test(CUSTOM_TPL[1],
        SOURCE.slice(INDEX, INDEX + size(CUSTOM_TPL[1].source)))) &&
      (TYPE = TYPE_CUSTOM_TEMPLATE) &&
      !createCustomTemplate()

    /*
    JSX
    */
    /* JSX CLOSING TAG */
    const createJsxClosingTag = (): any => {
      TYPE = JSX_CLOSING_ELEMENT_START
      DEEP--, initToken(), initialize(), saveToken()
      // TYPE = JSX_IDENTIFIER
      TEMP_JSX.shift(), (TEMP_JSX_TAG_OPENER = false)
      TEMP_JSX.unshift(DEEP), (TEMP_JSX_TAG_CLOSER = true)
    }
    // prettier-ignore
    const quessJsxClosingTag = (): any =>
      CHAR === '<' && CHAR_NEXT === '/' && TEMP_JSX[0] === DEEP - 1 && !createJsxClosingTag()

    /* JSX CLOSE CHILDLESS TAG OR CLOSER TAG */
    const createJsxClosingChildless = (): any => {
      TYPE = TEMP_JSX_TAG_CLOSER
        ? JSX_CLOSING_ELEMENT_END
        : JSX_OPENING_ELEMENT_END
      DEEP--, initToken(), saveToken(), TEMP_JSX.shift()
      if (TEMP_JSX_TAG_CLOSER) TEMP_JSX_TAG_CLOSER = false
      else TEMP_JSX_TAG_OPENER = false
    }
    // prettier-ignore
    const quessJsxClosingChildless = (): any =>
      TEMP_JSX[0] === DEEP && ((TEMP_JSX_TAG_CLOSER && CHAR === '>') ||
        (TEMP_JSX_TAG_OPENER && CHAR === '/' && CHAR_NEXT === '>' && initialize())) &&
      !createJsxClosingChildless()

    /* JSX OPENING TAG */
    const createJsxOpeningTag = (): any => {
      TYPE = JSX_OPENING_ELEMENT_START
      initToken(), saveToken(), DEEP++
      // TYPE = JSX_IDENTIFIER
      TEMP_JSX.unshift(DEEP), (TEMP_JSX_TAG_OPENER = true)
    }
    // prettier-ignore
    const quessJsxOpeningTag = (): any =>
      CHAR === '<' && !TEMP_JSX_TAG_OPENER && !TEMP_JSX_TAG_CLOSER &&
      CHAR_NEXT.trim() && (TEMP_JSX[0] === DEEP - 1 || __mayBeNotDivider__()) &&
      !createJsxOpeningTag()

    /* JSX CLOSE OPENING TAG OR INSIDE TAG CONTENT */
    const createJsxCloseOpeningTagOrContent = (): any => {
      initToken(), saveToken()
      if (TOKEN_LAST.raw === '>') DEEP++, (TEMP_JSX_TAG_OPENER = false)
      TEMP = false
      // prettier-ignore
      $: while (!EOF) {
        if ((CHAR_NEXT === '{' && (TEMP = true))
          || (CHAR_NEXT === '<'
            && (getCharAt(SOURCE, INDEX + 2)).trim())) break $
        doInitialize()
      }
      if (RAW) {
        TYPE = JSX_TEXT
        initToken(), saveToken()
      }
      if (TEMP) {
        TYPE = JSX_EXPRESSION_CONTAINER_START
        initialize(), initToken(), saveToken(), DEEP++
      }
    }
    // prettier-ignore
    const quessJsxCloseOpeningTagOrContent = (): any =>
      ((CHAR === '>' && TEMP_JSX[0] === DEEP && (TYPE = JSX_OPENING_ELEMENT_END)) ||
        (CHAR === '}' && !TEMP_JSX_TAG_OPENER && !TEMP_JSX_TAG_CLOSER &&
          TEMP_JSX[0] === DEEP - 2 && DEEP-- && (TYPE = JSX_EXPRESSION_CONTAINER_END))) &&
      !createJsxCloseOpeningTagOrContent()

    /*
    TEMPLATE
    */
    const createTemplate = (): any => {
      initToken()
      FLAGS.push(LITERAL)
      !TEMP && FLAGS.push(TEMPLATE_SUBSTITUTION_TAIL)
      // prettier-ignore
      while (doInitialize() && (IS_BACKSLASH || !(
        (TEMP = CHAR === '`')
        || (CHAR === '$' && CHAR_NEXT === '{' && initialize()
          && ++DEEP && TEMP_TEMPLATE.unshift(DEEP))
      )));
      // prettier-ignore
      FLAG = size(FLAGS) < 2
        ? TEMP ? NO_SUBSTITUTION_TEMPLATE : TEMPLATE_HEAD
        : TEMP ? TEMPLATE_TAIL : TEMPLATE_MIDDLE
      saveToken()
    }
    // prettier-ignore
    const quessTemplate = (): any =>
      ((TEMP = CHAR === '`') || (CHAR === '}' &&
        TEMP_TEMPLATE[0] === DEEP && DEEP-- && !(TEMP_TEMPLATE.shift() * 0))) &&
      (TYPE = TYPE_TEMPLATE) && !createTemplate()

    /*
    STRING
    */
    const createString = (): any => {
      initToken()
      FLAGS.push(LITERAL)
      FLAG = TEMP ? DOUBLE_STRING_CHARACTERS : SINGLE_STRING_CHARACTERS
      const quote = CHAR
      while (doInitialize() && (IS_BACKSLASH || CHAR !== quote));
      saveToken()
    }
    // prettier-ignore
    const quessString = (): any =>
      ((TEMP = CHAR === '"') || CHAR === "'") && (TYPE = TYPE_STRING) && !createString()

    /*
    COMMENT
    */
    const createComment = (): any => {
      initToken(optionsCOMMENTS)
      // prettier-ignore
      FLAG = TEMP ? MULTI_LINE_COMMENT : SINGLE_LINE_COMMENT
      initialize(TEMP ? 3 : 1)
      // prettier-ignore
      while (!(TEMP
        ? CHAR_PREV === '*' && CHAR === '/'
        : isLineTerminator(CHAR_NEXT)) && doInitialize());
      saveToken()
    }
    // prettier-ignore
    const guessComment = (): any =>
      CHAR === '/' && ((TEMP = CHAR_NEXT === '*') || CHAR_NEXT === '/') &&
      (TYPE = TYPE_COMMENT) && !createComment()

    /*
    REGULAR_EXPRESSION
    */
    const createRegularExpression = (): any => {
      initToken()
      FLAGS.push(LITERAL)
      let is: any
      const __test__ = (): string | boolean =>
        (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR
      // prettier-ignore
      while (doInitialize() && (IS_BACKSLASH || __test__() !== '/'));
      while (test(/[a-z]/, CHAR_NEXT) && doInitialize());
      saveToken()
    }
    // prettier-ignore
    const guessRegularExpression = (): any =>
      CHAR === '/' && __mayBeNotDivider__() &&
      (TYPE = TYPE_REGULAR_EXPRESSION) && !createRegularExpression()

    /*
    PUNCTUATOR
    */
    const createPunctuator = (): any => {
      initToken()
      if (CHAR === '.') {
        // prettier-ignore
        if (CHAR === CHAR_NEXT && CHAR === getCharAt(SOURCE, INDEX + 2)) initialize(2)
      } else while (isPunctuator(RAW + CHAR_NEXT) && doInitialize());
      saveToken()
    }
    // prettier-ignore
    const guessPunctuator = (): any =>
      isPunctuator(RAW) && (TYPE = TYPE_PUNCTUATOR) && !createPunctuator()

    /*
    SPACE_CHARACTERS
    */
    // prettier-ignore
    const createSpaceCharacters = ( __type__: any, __flagsFn__: any): any => {
      TYPE = __type__
      initToken(optionsSPACES)
      FLAGS.push(...__flagsFn__(CHAR))
      while (CHAR === CHAR_NEXT && doInitialize());
      saveToken()
    }
    /* LINE_TERMINATOR */
    const quessLineTerminator = (): any =>
      isLineTerminator(CHAR) &&
      !createSpaceCharacters(TYPE_LINE_TERMINATOR, getLineTerminatorCodePoint)
    /* WHITE_SPACE */
    const quessWhiteSpace = (): any =>
      isWhiteSpace(CHAR) &&
      !createSpaceCharacters(TYPE_WHITE_SPACE, getWhiteSpaceCodePoint)
    /* FORMAT_CONTROL */
    const quessFormatControl = (): any =>
      isFormatControl(CHAR) &&
      !createSpaceCharacters(TYPE_FORMAT_CONTROL, getFormatControlCodePoint)

    /*
    FIXES
    */
    /* FIX_NUMERIC */
    const createFixNumeric = (
      char2 = getCharAt(SOURCE, INDEX + 2),
      char3 = getCharAt(SOURCE, INDEX + 3)
    ): any => {
      // prettier-ignore
      if (CHAR === '.') {
        if (isDigit(CHAR_NEXT)) initialize()
        else if (isDigit(CHAR_PREV) && test(/[eE]/, CHAR_NEXT)) {
          if (isDigit(char2)) initialize(2)
          else if (test(/[-+]/, char2) && isDigit(char3)) initialize(3)
        }
      } else if (
        TOKEN &&
        !TOKEN.type &&
        test(/[eE]/, last(TOKEN.raw)) &&
        isDigit(CHAR_NEXT) &&
        isDecimalLiteral(TOKEN.raw + '1')
      ) {
        initialize()
      }
    }

    const fixNumeric = (): any => test(/[-+.]/, CHAR) && createFixNumeric()

    while (INDEX < LENGTH) {
      TEMP = false
      // prettier-ignore
      !initialize() ||
        /* IS_BACKSLASH */
        quessBackslash() ||
        /* CUSTOM_TEMPLATE */
        (CUSTOM_TPL && quessCustomTemplate()) ||
        /* JSX */
        (optionsJSX && (quessJsxClosingTag() || quessJsxClosingChildless() ||
        quessJsxOpeningTag() || quessJsxCloseOpeningTagOrContent())) ||
        /* TEMPLATE */
        quessTemplate() ||
        /* STRING */
        quessString() ||
        /* COMMENT */
        guessComment() ||
        /* REGULAR_EXPRESSION */
        (optionsREGEXP && guessRegularExpression()) ||
        /* LINE_TERMINATOR */
        quessLineTerminator() ||
        /* WHITE_SPACE */
        quessWhiteSpace() ||
        /* FORMAT_CONTROL */
        quessFormatControl() ||
        /* NUMERIC */
        fixNumeric() ||
        /* PUNCTUATOR */
        guessPunctuator() ||
        /* IDENTIFIER */
        createIdentifier()
      if (EOF) endTokenize()
    }
  }
  return tokens
}

export default presizeTokenize
