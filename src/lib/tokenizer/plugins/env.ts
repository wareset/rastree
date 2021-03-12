import {
  test,
  includes,
  someLast,
  // forEach,
  length,
  unshift,
  forEach
  // push,
  // shift
} from 'wareset-utilites'

import {
  IToken,
  ITokenizer,
  ITokenizerPluginFn,
  ITokenDataJSXOpeningElementStart
} from '../lib/interfaces'

import { SEPARATOR } from '../../flags'

import {
  // TYPE_JSX_ELEMENT,
  // TYPE_JSX_ATTRIBUTE,
  // TYPE_JSX_IDENTIFIER,
  TYPE_JSX_OPENING_ELEMENT,
  TYPE_JSX_OPENING_ELEMENT_START,
  // TYPE_JSX_OPENING_ELEMENT_END,
  TYPE_JSX_CLOSING_ELEMENT,
  TYPE_JSX_CLOSING_ELEMENT_START
  // TYPE_JSX_CLOSING_ELEMENT_END,
  // TYPE_JSX_EXPRESSION_START,
  // TYPE_JSX_EXPRESSION_END,
  // TYPE_JSX_EXPRESSION,
  // TYPE_JSX_TEXT
} from '../../flags'

const START_TYPES = [
  TYPE_JSX_OPENING_ELEMENT_START,
  TYPE_JSX_CLOSING_ELEMENT_START
]

const ELEMENT_TYPES = [TYPE_JSX_OPENING_ELEMENT, TYPE_JSX_CLOSING_ELEMENT]

const parseAttributes = (self: ITokenizer, tokenStart: IToken): IToken => {
  const __tokens__ = self.tokens()
  // const __token__ = self.token()
  const __deep__ = tokenStart.deep

  let attr: IToken[] = []
  let current: IToken[][] = [attr]
  const data: IToken[][][] = [current]

  let tokenOpener: IToken
  someLast(__tokens__, (token) => {
    if (token.type === TYPE_JSX_OPENING_ELEMENT_START) tokenOpener = token
    else {
      let temp: boolean
      const raw = token.raw
      if (
        token.deep === __deep__ &&
        ((temp = raw === '=') || raw === ',' || token.hasFlag(SEPARATOR))
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
    }

    return tokenOpener
  })

  tokenOpener!.children = data

  return tokenOpener!
}

export const pluginEnv: ITokenizerPluginFn = (
  self: ITokenizer,
  _isStyle = false,
  DEEP = 0,
  TOKEN: IToken
) => (): void => {
  const __env__ = self.env()
  // const __is__ = __env__[0] === 'style'
  const __raw__ = self.raw()
  const __deep__ = self.deep()

  const __tokenSafe = self.tokenSafe()
  const __tokenSafe1 = self.tokenSafe(1)

  let temp: boolean
  const __raw1__ = __tokenSafe1.raw
  if (includes(START_TYPES, __env__[0])) {
    if ((temp = __raw1__ === '<') || __raw1__ === '</') {
      ;(DEEP = __deep__), (TOKEN = __tokenSafe)
      __env__[0] = temp ? TYPE_JSX_OPENING_ELEMENT : TYPE_JSX_CLOSING_ELEMENT
      TOKEN.setFlags(__env__[0])
    }
  }

  if (DEEP === __deep__ && includes(ELEMENT_TYPES, __env__[0])) {
    if (test(/^[/>]$/, __raw__)) {
      temp = __env__[0] === TYPE_JSX_OPENING_ELEMENT
      let ENV = TOKEN.raw

      if (!temp) self.env(false)
      else {
        const tokenOpeningStart = parseAttributes(self, TOKEN)
        if (test(/^(?:template|style)$/, ENV)) {
          let isConcise: boolean

          // prettier-ignore
          const children: ITokenDataJSXOpeningElementStart =
            tokenOpeningStart.children as ITokenDataJSXOpeningElementStart

          forEach(
            children,
            ([attrNameArr, attrValueArr]) => {
              if (
                length(attrNameArr) === 1 &&
                attrNameArr[0].raw === 'concise'
              ) {
                isConcise = true

                if (attrValueArr && length(attrValueArr)) {
                  const text = attrValueArr.map((v) => v.raw).join('')
                  isConcise = test(/^(?:[\W])*true(?:[\W])*$/, text)
                }
              }
            },
            1
          )

          if (isConcise!) ENV += 'Concise'
        }
      }

      __env__[0] = ENV
      // console.log(TOKEN.raw)
      TOKEN = __tokenSafe
    }
  }

  // console.log([...__env__])
}
