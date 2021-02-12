import { pop, last, length as len, splice, indexOf } from 'wareset-utilites'
import { regexp, replace, esc } from 'wareset-utilites'
import { getDelimeter } from '../../../lib/get-delimeter'

import { IToken, ITokenizer, ITokenizerTypingFn } from '../../../lib/tokenizer'

import { TYPE_LINE_TERMINATOR } from '../../flags'
import { TYPE_COMMENT } from '../../flags'

const __splice__ = (arr: any[], val: any): void => {
  const idx = indexOf(arr, val)
  if (idx > -1) splice(arr, idx, 1)
}

export const typingCssConciseNormalizeFactory = (
  indent: string | RegExp,
  __lastToken__?: IToken | null,
  __regexp__: RegExp = regexp(
    (indent as any).source || esc(indent as any),
    'g'
  ),
  __end__ = false,
  __deep__ = 0,
  __minDeep__ = 0
): ITokenizerTypingFn => (self: ITokenizer) => (token: IToken): any => {
  const type = token.type
  const tokens = self.tokens

  if (type === TYPE_LINE_TERMINATOR) {
    __lastToken__ = null
    if (token === last(tokens)) pop(tokens)
  } else if (type !== TYPE_COMMENT) {
    if (!__lastToken__) {
      __lastToken__ = token

      const raw = token.raw
      const __d__ = getDelimeter(raw)
      const rawA = replace(raw, __regexp__, '$&' + __d__).split(__d__)

      __deep__ = 0
      let match: any
      if (len(rawA)) {
        while ((match = rawA[0].match(__regexp__)) && match[0] === rawA[0]) {
          ++__deep__, rawA.shift()
        }
      }

      __lastToken__.value = rawA.join('')
      __minDeep__ = Math.min(__minDeep__, __deep__) || __minDeep__ || __deep__
    } else {
      __lastToken__.raw += token.raw
      __lastToken__.value += __lastToken__.raw

      __lastToken__.end = token.end
      if (__lastToken__.loc) __lastToken__.loc.end = token.loc!.end
      // if (token === last(tokens)) pop(tokens)
      const idx = indexOf(tokens, token)
      if (idx > -1) {
        __splice__(tokens, token)
        __splice__(tokens, __lastToken__)
        splice(tokens, idx, 0, __lastToken__)
      }
    }
  }

  token.deep = __minDeep__ > 1 ? __deep__ / __minDeep__ : __deep__
}
