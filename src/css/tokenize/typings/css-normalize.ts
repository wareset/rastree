/* eslint-disable max-len */
import { size, slice, splice, keys, includes } from 'wareset-utilites'

import { IToken, ITokenizer, ITokenizerTypingFn } from '../../../lib/tokenizer'
/* CSS */
import { ERROR } from '../../flags'
import { CSS } from '../../flags'
import { TYPE_CSS_SELECTOR, TYPE_CSS_KEYFRAME } from '../../flags'
import { TYPE_CSS_ATRULE, TYPE_CSS_ATRULE_VALUE } from '../../flags'
import { TYPE_CSS_ATTRIBUTE, TYPE_CSS_ATTRIBUTE_VALUE } from '../../flags'

/* PUNCTUATOR */
import { CSS_PUNCTUATOR } from '../../flags'

let undef: undefined
const joinTokens = (
  self: ITokenizer,
  tokenSafe: IToken,
  tokenLast: IToken,
  tokenSafePrev: IToken
): void => {
  splice(self.tokens, tokenSafe.id + 1, tokenLast.id - tokenSafe.id)

  tokenSafe.type = undef
  // prettier-ignore
  tokenSafe.raw = slice(self.source, tokenSafe.start, (tokenSafe.end = tokenLast.end))
  if (tokenSafe.loc) tokenSafe.loc.end = tokenLast.loc!.end
  tokenSafe.value = tokenSafe.raw

  self.token = self.tokenSafe = tokenSafe
  self.tokenSafePrev = tokenSafePrev
}

const CSS_AFTER_KEYS: any = {
  '{': TYPE_CSS_SELECTOR,
  ':': TYPE_CSS_ATTRIBUTE,
  ';': TYPE_CSS_ATTRIBUTE_VALUE,
  '}': TYPE_CSS_ATTRIBUTE_VALUE
}
const CSS_PUNCTUATORS_LIST = keys(CSS_AFTER_KEYS)

export const typingCssNormalize: ITokenizerTypingFn = (
  self: ITokenizer,
  BRACKETS: any[] = [],
  IDN_TEMP?: [IToken, IToken]
) => (token: IToken): any => {
  const raw = token.raw

  // const idx = indexOf(tokens, token)

  /* TYPING_JOIN_BRACKETS */
  if (raw === '(' || raw === '[') {
    if (!IDN_TEMP && !size(BRACKETS)) {
      IDN_TEMP = [token, self.tokenSafePrev]
    }
    BRACKETS.push([token, self.tokenSafePrev])
  } else if (raw === ')' || raw === ']') {
    if (size(BRACKETS)) {
      const [tokenSafe, tokenSafePrev] = BRACKETS.pop()
      joinTokens(self, tokenSafe, token, tokenSafePrev)
    } else self.error()
  } else if (!size(BRACKETS)) {
    /* TYPING_ATRULE */
    if (!token.type! && token.raw[0] === '@') {
      token.type = TYPE_CSS_ATRULE
      token.setFlags(CSS)
      token.value = slice(token.raw, 1)
    }

    /* TYPING_BRACKETS */
    if (includes(CSS_PUNCTUATORS_LIST, raw)) {
      token.setFlags(CSS_PUNCTUATOR, CSS)
    }

    if (!IDN_TEMP && !token.hasFlag(CSS) && token === self.tokenSafe) {
      IDN_TEMP = [token, self.tokenSafePrev]
    }

    let tmp: any
    if (IDN_TEMP && ((tmp = token.hasFlag(CSS)) || self.eof())) {
      let [tokenSafe, tokenSafePrev] = IDN_TEMP
      IDN_TEMP = undef
      const tokenLast = tmp ? self.tokenSafePrev : self.tokenSafe

      joinTokens(self, tokenSafe, tokenLast, tokenSafePrev)
      ;({ tokenSafe, tokenSafePrev } = self)
      tokenSafe.setFlags(CSS)

      tokenSafe.type =
        tokenSafePrev.type === TYPE_CSS_ATRULE
          ? TYPE_CSS_ATRULE_VALUE
          : CSS_AFTER_KEYS[raw] ||
            (tokenSafe.setFlags(ERROR), self.error(), undef)

      if (
        tokenSafe.type === TYPE_CSS_SELECTOR &&
        /^(?:from|to|\d+%?)$/i.test(tokenSafe.raw)
      ) {
        tokenSafe.type = TYPE_CSS_KEYFRAME
      }
    }
  }
}
