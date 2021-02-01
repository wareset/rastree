/* eslint-disable max-len */
import { keys } from 'wareset-utilites'
import { includesFactory } from '../ecma-utils'

// prettier-ignore
export const ESCAPE_SEQUENCES = {
  'b': '\b',
  't': '\t',
  'n': '\n',
  'v': '\v',
  'f': '\r',
  '\\': '\\'
}

export const REG_ESCAPE_SEQUENCES = /\\[^]/g

/*
https://tc39.es/ecma262/#sec-unicode-format-control-characters
*/

// Table 33: Format-Control Code Point Usage
// Code Point	Name	Abbreviation	Usage
// U+200C	ZERO WIDTH NON-JOINER	<ZWNJ>	IdentifierPart
// U+200D	ZERO WIDTH JOINER	<ZWJ>	IdentifierPart
// U+FEFF	ZERO WIDTH NO-BREAK SPACE	<ZWNBSP>	WhiteSpace

export const FORMAT_CONTROL_CODE_POINTS: any = {
  '\u200C': ['ZERO WIDTH NON-JOINER', 'ZWNJ'],
  '\u200D': ['ZERO WIDTH JOINER', 'ZWJ']
}

export const isFormatControl = includesFactory(keys(FORMAT_CONTROL_CODE_POINTS))

export const getFormatControlCodePoint = (s: string): [string, string?] =>
  FORMAT_CONTROL_CODE_POINTS[s] || ['ZWNBSP']
