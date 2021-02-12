/* eslint-disable max-len */
import { keys } from 'wareset-utilites'
import { includesFactory } from '../ecma-utils'

/*
https://tc39.es/ecma262/#sec-line-terminators
*/

// Table 35: Line Terminator Code Points
// Code Point	Unicode Name	Abbreviation
// U+000A	LINE FEED (LF)	<LF>
// U+000D	CARRIAGE RETURN (CR)	<CR>
// U+2028	LINE SEPARATOR	<LS>
// U+2029	PARAGRAPH SEPARATOR	<PS>

export const LINE_TERMINATOR_CODE_POINTS: any = {
  '\u000A': ['LF'],
  '\u000D': ['CR'],
  '\u2028': ['LS'],
  '\u2029': ['PS']
}

export const isLineTerminator = includesFactory(
  keys(LINE_TERMINATOR_CODE_POINTS)
)

export const getLineTerminatorCodePoint = (s: string): [string, string?] =>
  LINE_TERMINATOR_CODE_POINTS[s] || ['CRLF']
