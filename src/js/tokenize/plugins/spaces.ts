import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'

import { SEPARATOR } from '../../flags'
/* LINE_TERMINATOR */
import { TYPE_LINE_TERMINATOR } from '../../flags'
import {
  isLineTerminator,
  getLineTerminatorCodePoint
} from '../../../lib/ecma/line-terminators'
/* WHITE_SPACE */
import { TYPE_WHITE_SPACE } from '../../flags'
import {
  isWhiteSpace,
  getWhiteSpaceCodePoint
} from '../../../lib/ecma/white-spaces'

/* FORMAT_CONTROL */
import { TYPE_FORMAT_CONTROL } from '../../flags'
import {
  isFormatControl,
  getFormatControlCodePoint
} from '../../../lib/ecma/format-controls'

/*
SPACE_CHARACTERS
*/
const noop = (): any[] => []
const createSpaces = (
  { next, char, save, raw, options }: ITokenizer,
  type: any,
  flagsFn: any = noop
): any => {
  while (char() === char(1) && next());
  save(type, raw(), [SEPARATOR, ...flagsFn(char())], !1, options.separators)
}

/* LINE_TERMINATOR */
export const pluginLineTerminator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  isLineTerminator(self.raw()) &&
  !createSpaces(self, TYPE_LINE_TERMINATOR, getLineTerminatorCodePoint)

// export const pluginLineTerminatorFast: ITokenizerPluginFn = (
//   self: ITokenizer
// ) => (): boolean =>
//   isLineTerminator(self.raw()) &&
//   !createSpaces(self, TYPE_LINE_TERMINATOR, noop)

/* WHITE_SPACE */
export const pluginWhiteSpace: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  isWhiteSpace(self.raw()) &&
  !createSpaces(self, TYPE_WHITE_SPACE, getWhiteSpaceCodePoint)

// export const pluginWhiteSpaceFast: ITokenizerPluginFn = (
//   self: ITokenizer
// ) => (): boolean =>
//   isWhiteSpace(self.raw()) && !createSpaces(self, TYPE_WHITE_SPACE, noop)

/* FORMAT_CONTROL */
export const pluginFormatControl: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  isFormatControl(self.raw()) &&
  !createSpaces(self, TYPE_FORMAT_CONTROL, getFormatControlCodePoint)

// export const pluginFormatControlFast: ITokenizerPluginFn = (
//   self: ITokenizer
// ) => (): boolean =>
//   isFormatControl(self.raw()) && !createSpaces(self, TYPE_FORMAT_CONTROL, noop)
