/* eslint-disable max-len */

import {
  unshift,
  shift,
  test,
  some,
  someLast,
  splice,
  forEach,
  forEachLast,
  length,
  push,
  last,
  trim,
  pop
} from 'wareset-utilites'

import {
  Token,
  IToken,
  ITokens,
  ITokenizer,
  ITokenizerEnvFn,
  ITokenDataJSXOpeningElementStart
} from '../lib/interfaces'

import {
  SEPARATOR,
  TYPE_CONCISE_INDENT,
  TYPE_CONCISE_START,
  TYPE_LINE_TERMINATOR,
  TYPE_JSX_OPENING_ELEMENT,
  TYPE_JSX_OPENING_ELEMENT_END,
  TYPE_JSX_CLOSING_ELEMENT,
  TYPE_JSX_CLOSING_ELEMENT_START
} from '../../flags'

import {
  TYPE_CSS_ATRULE,
  TYPE_CSS_SELECTOR,
  TYPE_CSS_KEYFRAME,
  TYPE_CSS_ATTRIBUTE
} from '../../flags'

import {
  ENV_STYLE,
  ENV_STYLE_CONCISE,
  ENV_TEMPLATE_CONCISE,
  ENV_TEMPLATE_CONCISE_CONTENT
} from './types'

import { isLineTerminator } from '../../ecma/line-terminators'

const setStyleTokenType = (
  token: IToken,
  deepNext = token ? token.deep : 0
): void => {
  if (token) {
    token.value = trim(token.value)
    const { value, deep } = token

    let type = TYPE_CSS_SELECTOR
    if (value[0] === '@') type = TYPE_CSS_ATRULE
    else if (deep >= deepNext) type = TYPE_CSS_ATTRIBUTE
    else if (test(/^\s*(from|to|\d+%?)\s*$/, value)) type = TYPE_CSS_KEYFRAME

    token.type = type
  }
}

const __joinTokens__ = (current: IToken, next: IToken): void => {
  current.raw += next.raw
  current.value = current.value + next.raw
  current.end = next.end
  if (current.loc) current.loc.end = next.loc!.end
}

const __tokenizeStyle__ = (tokens: ITokens): ITokens => {
  const res: ITokens = []

  if (length(tokens)) {
    // const deepStart = tokens[0].deep

    let curLast: IToken | null
    let current: IToken | null

    forEach(tokens, (token) => {
      const raw = token.raw

      if (test(/^[{};]$/, raw)) {
        if (current) curLast = current
        // push(res, token)
        current = null
      } else {
        if (!current) {
          if (trim(raw)) {
            push(res, (current = token))
            current.value = current.raw
            // if (deepStart) current.deep--
            setStyleTokenType(curLast!, current.deep)
          } // else push(res, token)
        } else __joinTokens__(current, token)
      }
    })

    setStyleTokenType(curLast!)
    if (curLast! !== current!) setStyleTokenType(current!)
  }
  return res
}

const __tokenizeStyleConcise__ = (tokens: ITokens): ITokens => {
  const res: ITokens = []

  // console.log(tokens)
  if (length(tokens)) {
    const deepStart = tokens[0].deep

    let __minDeep__ = 0
    let __d__ = 0

    let curLast: IToken | null
    let current: IToken | null

    forEach(tokens, (token) => {
      const { deep, type, raw } = token

      if (
        deep === deepStart &&
        type === TYPE_LINE_TERMINATOR &&
        (!current || last(trim(current.raw)) !== ',')
      ) {
        if (current) curLast = current
        // push(res, token)
        current = null
      } else {
        if (!current) {
          if (type === TYPE_CONCISE_INDENT) {
            __d__ = length(raw)
            __minDeep__ = Math.min(__minDeep__, __d__) || __minDeep__ || __d__
            // push(res, token)
          } else {
            push(res, (current = token))
            current.value = current.raw
            current.deep = __minDeep__ > 1 ? __d__ / __minDeep__ : __d__
            if (deepStart) current.deep += 3
            // current.deep += deepStart
            setStyleTokenType(curLast!, current.deep)
            __d__ = 0
          }
        } else __joinTokens__(current, token)
      }
    })

    setStyleTokenType(curLast!)
    if (curLast! !== current!) setStyleTokenType(current!)
  }
  return res
}

export const __tokenizeTemplateConcise__ = (tokens: ITokens): ITokens => {
  const res: ITokens = []

  // console.log(...tokens)

  if (length(tokens)) {
    const deepStart = tokens[0].deep

    let __minDeep__ = 0

    let current: ITokens = []
    const arr: ITokens[] = [current]

    forEach(tokens, (token) => {
      const { deep, type } = token

      if (deep === deepStart && type === TYPE_LINE_TERMINATOR) {
        if (length(current)) push(arr, (current = []))
      } else {
        push(current, token)
      }
    })
    if (!length(last(arr))) pop(arr)

    const arr2: [boolean, number, ITokens][] = []
    forEach(arr, (tokens) => {
      let __d__ = 0
      if (tokens[0].type === TYPE_CONCISE_INDENT) {
        const tokenIndent = shift(tokens)
        __d__ = length(tokenIndent.raw)
        __minDeep__ = Math.min(__minDeep__, __d__) || __minDeep__ || __d__
      }

      if (length(tokens)) {
        const tag: ITokens = []
        const other: ITokens = []
        let isTag = true
        forEach(tokens, (token) => {
          if (token.type === TYPE_JSX_OPENING_ELEMENT) isTag = false
          if (token.type === TYPE_CONCISE_START) isTag = false
          else push(isTag ? tag : other, token)
        })

        isTag = false
        if (length(tag)) {
          isTag = true
          const { deep, start, loc } = tag[0]
          const children: ITokenDataJSXOpeningElementStart = []
          // prettier-ignore
          const tokenTagOpener = new Token(
            deep, tag.map((v) => v.raw).join(''), TYPE_JSX_OPENING_ELEMENT)
          tokenTagOpener.value = tokenTagOpener.raw
          tokenTagOpener.start = start
          tokenTagOpener.end = last(tag)!.end
          // prettier-ignore
          if (loc) {
            tokenTagOpener.loc = { start: { ...loc.start }, end: { ...last(tag)!.loc!.end } }
          }

          const preData: ITokens = []

          push(children, [tag])

          if (last(tag)!.raw === ')') {
            let tokenCBDeep = pop(tag).deep
            someLast(tag, (token, _k, a): any => {
              pop(a)
              if (token.deep === tokenCBDeep && token.raw === '(') return true
              else unshift(preData, token)
            })

            if (length(preData)) {
              tokenCBDeep++
              let attr: ITokens = []
              let current: ITokens[] = [attr]
              const data: ITokens[][] = [current]
              someLast(preData, (token) => {
                let temp: boolean
                const raw = token.raw
                if (
                  token.deep === tokenCBDeep &&
                  ((temp = raw === '=') ||
                    raw === ',' ||
                    token.hasFlag(SEPARATOR))
                ) {
                  if (temp) {
                    if (length(attr)) unshift(current, (attr = []))
                  } else {
                    if (length(current) && length(attr)) {
                      attr = []
                      unshift(data, (current = [attr]))
                    }
                  }
                } else {
                  unshift(attr, token)
                }
              })

              push(children, ...(data as any))
            }
          }

          tokenTagOpener.children = children as any
          unshift(other, tokenTagOpener)
        }

        if (length(other)) {
          const __d1__ = other[0].deep
          let __d2__ = __minDeep__ > 1 ? __d__ / __minDeep__ : __d__
          __d2__ -= __d1__
          if (deepStart) __d2__ += deepStart

          forEach(other, (token) => (token.deep += __d2__))
          push(arr2, [isTag, other[0]!.deep, other])
        }
      }
    })

    forEachLast(arr2, ([isTag, deep, tokens1], k) => {
      if (isTag) {
        let isAdded = false
        const tokenCloser = new Token(deep, '', TYPE_JSX_CLOSING_ELEMENT)
        tokenCloser.value = '</>'
        if (tokens1[0].loc) {
          tokenCloser.loc = {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 }
          }
        }
        let tokens = tokens1
        some(
          arr2,
          ([_1, deep2, tokens2]): any => {
            if (deep2 <= deep) push(tokens, tokenCloser), (isAdded = true)
            tokens = tokens2
            return isAdded
          },
          k + 1
        )
        if (!isAdded) push(last(arr2)![2], tokenCloser)
      }
    })

    // console.log(arr2)
    forEach(arr2, (data) => push(res, ...data[2]))
  }

  // console.log(res)

  return res
}

const __spliceTokens__ = (
  self: ITokenizer,
  tokenFirst: IToken,
  parseFn: Function
): any => {
  const TOKEN = self.token()
  // prettier-ignore
  let kEnd = 0, kStart = 0
  const __tokens__ = self.tokens()

  someLast(
    __tokens__,
    (token, k) => (!kEnd && (kEnd = k), (kStart = k), token === tokenFirst),
    TOKEN.type === TYPE_JSX_CLOSING_ELEMENT_START ? 1 : 0
  )

  if (kStart && __tokens__[kStart].type === TYPE_JSX_OPENING_ELEMENT_END)
    kStart++
  kEnd -= kStart - 1
  const tokens = parseFn(splice(__tokens__, kStart, kEnd))
  splice(__tokens__, kStart, 0, ...tokens)
}

export const envStyleNormalize: ITokenizerEnvFn = (
  self: ITokenizer,
  isNeedParse: IToken | false = false
) => (): void => {
  const __env__ = self.env()
  if (__env__[0] === ENV_STYLE && self.char()) {
    const TOKEN = self.token()
    if (!isNeedParse || isNeedParse.type === TYPE_JSX_OPENING_ELEMENT_END) {
      isNeedParse = TOKEN
    }
  } else if (isNeedParse) {
    __spliceTokens__(self, isNeedParse, __tokenizeStyle__)
    isNeedParse = false
  }
}

const __setConciseIndent__ = (self: ITokenizer): void => {
  while (
    !isLineTerminator(self.char(1)) &&
    test(/^\s+$/, self.raw() + self.char(1)) &&
    self.next()
  );
  self.save(TYPE_CONCISE_INDENT)
}

export const envStyleConciseNormalize: ITokenizerEnvFn = (
  self: ITokenizer,
  isNeedParse: IToken | false = false
) => (): void => {
  const __env__ = self.env()
  if (__env__[0] === ENV_STYLE_CONCISE && self.char()) {
    const TOKEN = self.token()
    if (!isNeedParse || isNeedParse.type === TYPE_JSX_OPENING_ELEMENT_END) {
      isNeedParse = TOKEN
    }

    if (TOKEN.type === TYPE_LINE_TERMINATOR) __setConciseIndent__(self)
  } else if (isNeedParse) {
    __spliceTokens__(self, isNeedParse, __tokenizeStyleConcise__)
    isNeedParse = false
  }
}

const __setEnv__ = (self: ITokenizer): void => {
  self.env(ENV_TEMPLATE_CONCISE_CONTENT)
  unshift(self.temp.JSX_DEEPS, self.deep())
  self.deep(1)
}

export const envTemplateConciseNormalize: ITokenizerEnvFn = (
  self: ITokenizer,
  isNeedParse: IToken | false = false,
  isNeedDeep = 0,
  DEEP = 0
) => (): void => {
  const TOKEN = self.token()
  const { deep, type, raw } = TOKEN

  const __env__ = self.env()
  if (__env__[0] === ENV_TEMPLATE_CONCISE && self.char()) {
    if (!isNeedParse || isNeedParse.type === TYPE_JSX_OPENING_ELEMENT_END) {
      if (!isNeedParse) isNeedDeep = deep
      isNeedParse = TOKEN
    }

    if (type === TYPE_JSX_OPENING_ELEMENT_END) {
      DEEP = deep + 2
    } else if (type === TYPE_LINE_TERMINATOR) {
      __setConciseIndent__(self)
      if (self.char(1) === '<' && self.char(2) !== '/') __setEnv__(self)
    } else if (DEEP === deep && test(/^[|\s]+$/, raw)) {
      TOKEN.type = TYPE_CONCISE_START
      if (!isLineTerminator(self.char(1))) __setEnv__(self)
    }
  } else if (isNeedParse && (isNeedDeep === deep || !self.char())) {
    __spliceTokens__(self, isNeedParse, __tokenizeTemplateConcise__)
    isNeedParse = false
  }
}
