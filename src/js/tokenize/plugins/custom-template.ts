import { esc, regexp, unique, test, size, replace } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* CUSTOM_TEMPLATE */
import { TYPE_CUSTOM_TEMPLATE } from '../../flags'
import pluginDummy from '../../../lib/tokenizer/plugins/plugin-dummy'

const FAKE_QUOTES = ['{', '}']

const getReg = (v: any): string => v.source || esc(v)
const n2 = '(?<!([\\\\]'
const n3 = '))(?:'
const fakeOpenerFn = (v: any): RegExp => {
  let v2 = ''
  // prettier-ignore
  if (!v.source) v2 = '|' + getReg(unique([...v]).join(''))
  return regexp(n2 + v2 + n3 + getReg(v) + ')$')
}
const fakeCloserFn = (v: any): RegExp => {
  return regexp('^(?:' + getReg(v) + ')')
}
const fakeTemperFn = (v: any): RegExp => {
  return regexp(n2 + n3 + getReg(v) + ')')
}

const createCustomTemplatePatterns: {
  (pattern: false): false
  (pattern: true | [string | RegExp, string | RegExp]): [RegExp, RegExp, RegExp]
} = (pattern: any = false): any => {
  let res: any = pattern
  if (pattern) {
    if (!pattern[0] && !pattern[1]) res = [...FAKE_QUOTES]
    if (!pattern[1]) res[1] = res[0]
    res = [
      fakeOpenerFn(res[0]),
      fakeCloserFn(res[1]),
      fakeTemperFn(res[0])
      // getReg(res[1]) === getReg(res[0])
    ]
  }

  return res
}

const createCustomTemplate = (
  self: ITokenizer,
  pattern: [RegExp, RegExp, RegExp],
  temp?: any,
  temp2: string = ''
): any => {
  const { next, char, save, raw } = self
  self.deep = 0

  next()
  do {
    temp2 = raw()
    temp =
      pattern[0].test(temp2) &&
      pattern[2].test((temp2 += char(1))) &&
      !pattern[0].test(temp2)

    if (temp && self.deep) temp = false
  } while (!temp && next())

  save(TYPE_CUSTOM_TEMPLATE, replace(replace(raw(), pattern[0]), pattern[1]))
  self.deep++
}

// prettier-ignore
export const pluginCustomTemplateFactory = (
  customTemplate: any,
  pattern = createCustomTemplatePatterns(customTemplate)
): ITokenizerPluginFn =>
  !pattern
    ? pluginDummy
    : (self: ITokenizer) => (deep = self.deep, index = self.i): boolean =>
      (pattern as [RegExp, RegExp, RegExp]) &&
        deep < 2 &&
        (!deep ||
          self.eof() ||
          test(
            pattern[1],
            self.source.slice(
              index,
              index + size((pattern[1] as RegExp).source)
            )
          )) &&
        !createCustomTemplate(self, pattern)
