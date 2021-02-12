import { length, test } from 'wareset-utilites'
import { IToken, ITokens } from '../../lib/tokenizer'

import { trimCss } from './trim-css'

import {
  TYPE_CSS_ATRULE,
  TYPE_CSS_SELECTOR,
  TYPE_CSS_KEYFRAME,
  TYPE_CSS_ATTRIBUTE
} from '../flags'

export const cssify = (tokensDirty: ITokens): ITokens => {
  let type: string | undefined, value: string, token: IToken, tokenLast: IToken

  const tokens: ITokens = []

  const setType = (token: IToken, deepNext: number): void => {
    if (token && !token.type && token.value) {
      const { value, deep } = token

      let type = TYPE_CSS_SELECTOR
      if (value[0] === '@') type = TYPE_CSS_ATRULE
      else if (deep >= deepNext) type = TYPE_CSS_ATTRIBUTE
      else if (test(/^\s*(from|to|\d+%?)\s*$/, value)) type = TYPE_CSS_KEYFRAME

      token.type = type
    }
  }

  let i = -1
  const tokensDirtyLen = length(tokensDirty)
  while (++i < tokensDirtyLen) {
    ;(token = tokensDirty[i]), (type = token.type)

    if (type || (value = trimCss(token.raw))) {
      tokens.push(token)
      if (!type) {
        token.value = value!
        setType(tokenLast!, token.deep)
        tokenLast = token
      }
    }
  }
  setType(tokenLast!, 0)

  return tokens
}

export default cssify
