/* eslint-disable max-len */
// import { DOUBLE_BACKSLASH, regexpCreate, testFactory } from '../../utils'

/*
https://tc39.es/ecma262/#sec-template-literal-lexical-components
*/

// Template ::
//    NoSubstitutionTemplate
//    TemplateHead
// NoSubstitutionTemplate ::
//    ` TemplateCharactersopt `
// TemplateHead ::
//    ` TemplateCharactersopt ${
// TemplateSubstitutionTail ::
//    TemplateMiddle
//    TemplateTail
// TemplateMiddle ::
//    } TemplateCharactersopt ${
// TemplateTail ::
//    } TemplateCharactersopt `
// TemplateCharacters ::
//    TemplateCharacter TemplateCharactersopt

// prettier-ignore
// const __tFn__ = (h: string, t: string, l: '\\\\' = DOUBLE_BACKSLASH as '\\\\'): string =>
//   h + '(?:[^' + l + '$`]|' + l + '[$][{]|' + l + '[$`]|[$](?![{])|' + l + '[^$`])*' + t
// const __NST__ = __tFn__('`', '`')
// const __TH__ = __tFn__('`', '\\$\\{')
// const __TM__ = __tFn__('\\}', '\\$\\{')
// const __TT__ = __tFn__('\\}', '`')

// export const isNoSubstitutionTemplate = testFactory(regexpCreate(__NST__))
// export const isTemplateHead = testFactory(regexpCreate(__TH__))
// export const isTemplateMiddle = testFactory(regexpCreate(__TM__))
// export const isTemplateTail = testFactory(regexpCreate(__TT__))

// // prettier-ignore
// export const isTemplate =
//   testFactory(regexpCreate('(?:' + __NST__ + '|' + __TH__ + '|' + __TM__ + '|' + __TT__ + ')'))

import { replace, slice, last } from 'wareset-utilites'
import { REG_ESCAPE_SEQUENCES, ESCAPE_SEQUENCES } from '../format-control'

// prettier-ignore
export const createTemplateValue = (value: string): string =>
  replace(replace(slice(value, 1, last(value) === '`' ? -1 : -2),
    /\\([\\`])|\\(\$)(?=\{)|(?<=\$)\\(\{)/g, '$1$2$3'),
  REG_ESCAPE_SEQUENCES, (a: any) => (ESCAPE_SEQUENCES as any)[a[1]] || a)
