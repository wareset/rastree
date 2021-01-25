import { esc, regexp, unique } from 'wareset-utilites'

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

export const createCustomTemplatePatterns: {
  (pattern: false): false
  (pattern: true | [string | RegExp, string | RegExp]): [
    RegExp,
    RegExp,
    RegExp,
    boolean
  ]
} = (pattern: any = false): any => {
  let res: any = pattern
  if (pattern) {
    if (!pattern[0] && !pattern[1]) res = [...FAKE_QUOTES]
    if (!pattern[1]) res[1] = res[0]
    res = [
      fakeOpenerFn(res[0]),
      fakeCloserFn(res[1]),
      fakeTemperFn(res[0]),
      getReg(res[1]) === getReg(res[0])
    ]
  }

  return res
}

export default createCustomTemplatePatterns
