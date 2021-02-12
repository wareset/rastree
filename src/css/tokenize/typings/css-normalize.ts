/* eslint-disable max-len */
// import { keys, last, test, includes } from 'wareset-utilites'
import { splice, indexOf } from 'wareset-utilites'

import { IToken, ITokenizer, ITokenizerTypingFn } from '../../../lib/tokenizer'

/* CSS */
import { TYPE_PUNCTUATOR } from '../../flags'
import { TYPE_COMMENT } from '../../flags'
// import { SEPARATOR } from '../../flags'
// import { ERROR } from '../../flags'
// import { CSS } from '../../flags'

// import { TYPE_CSS_ATRULE } from '../../flags'
// import { TYPE_CSS_SELECTOR } from '../../flags'
// import { TYPE_CSS_KEYFRAME } from '../../flags'
// import { TYPE_CSS_ATTRIBUTE, TYPE_CSS_ATTRIBUTE_VALUE } from '../../flags'

// let undef: undefined
// const CSS_AFTER_KEYS: any = {
//   '{': TYPE_CSS_SELECTOR,
//   ':': TYPE_CSS_ATTRIBUTE,
//   ';': TYPE_CSS_ATTRIBUTE_VALUE,
//   '}': TYPE_CSS_ATTRIBUTE_VALUE
// }
// const CSS_PUNCTUATORS_LIST = keys(CSS_AFTER_KEYS)

const __splice__ = (arr: any[], val: any): void => {
  const idx = indexOf(arr, val)
  if (idx > -1) splice(arr, idx, 1)
}

export const typingCssNormalizeFactory = (
  punctuators?: boolean,
  __lastToken__?: IToken | null
): ITokenizerTypingFn => (self: ITokenizer) => (token: IToken): any => {
  const type = token.type
  const tokens = self.tokens

  if (type === TYPE_PUNCTUATOR) {
    __lastToken__ = null
    if (!punctuators) __splice__(tokens, token)
  } else if (type !== TYPE_COMMENT) {
    if (!__lastToken__) __lastToken__ = token
    else {
      __lastToken__.raw += token.raw
      __lastToken__.value = __lastToken__.raw

      __lastToken__.end = token.end
      if (__lastToken__.loc) __lastToken__.loc.end = token.loc!.end
      const idx = indexOf(tokens, token)
      if (idx > -1) {
        __splice__(tokens, token)
        __splice__(tokens, __lastToken__)
        splice(tokens, idx, 0, __lastToken__)
      }
      // if (token === last(tokens)) pop(tokens)
    }
  }
}
