/* eslint-disable max-len */
import { test } from 'wareset-utilites'

/*
https://tc39.es/ecma262/#sec-white-space
*/

// Table 34: White Space Code Points
// Code Point	Name	Abbreviation
// U+0009	CHARACTER TABULATION	<TAB>
// U+000B	LINE TABULATION	<VT>
// U+000C	FORM FEED (FF)	<FF>
// U+0020	SPACE	<SP>
// U+00A0	NO-BREAK SPACE	<NBSP>
// U+FEFF	ZERO WIDTH NO-BREAK SPACE	<ZWNBSP>
// Other category “Zs”	Any other Unicode “Space_Separator” code point	<USP>

const WHITE_SPACE_CODE_POINTS: any = {
  '\u0009': ['TAB'],
  '\u000B': ['VT'],
  '\u000C': ['FF'],
  '\u0020': ['SP'],
  '\u00A0': ['NBSP'],
  '\uFEFF': ['ZWNBSP']
}

const __WHITE_SPACE__ = /^\s+$/
export const isWhiteSpace = (s: string): boolean => test(__WHITE_SPACE__, s)

export const getWhiteSpaceCodePoint = (s: string): [string, string?] =>
  WHITE_SPACE_CODE_POINTS[s] || ['USP']
