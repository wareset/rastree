// import { test } from 'wareset-utilites'
import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'

import { SEPARATOR } from '../../flags'

/* LINE_TERMINATOR */
import { TYPE_LINE_TERMINATOR } from '../../flags'
import {
  isLineTerminator,
  getLineTerminatorCodePoint
} from '../../ecma/line-terminators'

/* WHITE_SPACE */
import { TYPE_WHITE_SPACE } from '../../flags'
import { isWhiteSpace, getWhiteSpaceCodePoint } from '../../ecma/white-spaces'

/* FORMAT_CONTROL */
import { TYPE_FORMAT_CONTROL } from '../../flags'
import {
  isFormatControl,
  getFormatControlCodePoint
} from '../../ecma/format-controls'

/*
SPACE_CHARACTERS
*/
const noop = (): any[] => []
const createSpaces = (
  { char, save, raw }: ITokenizer,
  type: any,
  flagsFn: any = noop
): any => {
  // while (char() === char(1) && next());
  save(type, [SEPARATOR, ...flagsFn(char())], raw())
}

/* LINE_TERMINATOR */
export const pluginLineTerminator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  isLineTerminator(self.raw()) &&
  !createSpaces(self, TYPE_LINE_TERMINATOR, getLineTerminatorCodePoint)

/* WHITE_SPACE */
export const pluginWhiteSpace: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  isWhiteSpace(self.raw()) &&
  !createSpaces(self, TYPE_WHITE_SPACE, getWhiteSpaceCodePoint)

/* FORMAT_CONTROL */
export const pluginFormatControl: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  isFormatControl(self.raw()) &&
  !createSpaces(self, TYPE_FORMAT_CONTROL, getFormatControlCodePoint)

// export const isSeparator = (s: string): boolean =>
//   test(/^[\s\u200C\u200D]+$/, s)

// export const pluginFastSeparator: ITokenizerPluginFn = ({
//   next,
//   char,
//   save,
//   raw
// }: ITokenizer) => (): void => {
//   if (isSeparator(raw())) {
//     while (isSeparator(char() + char(1)) && next());
//     save(SEPARATOR, [SEPARATOR], raw())
//   }
// }
