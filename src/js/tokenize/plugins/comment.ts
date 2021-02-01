import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* COMMENT */
import {
  TYPE_COMMENT,
  MULTI_LINE_COMMENT,
  SINGLE_LINE_COMMENT
} from '../../flags'
import { createCommentValue } from '../../../lib/ecma/comments'
/* LINE_TERMINATOR */
import { isLineTerminator } from '../../../lib/ecma/line-terminators'

const __save__ = (save: any, raw: any, flag: any, options: any): any =>
  save(TYPE_COMMENT, createCommentValue(raw()), [flag], false, options.comments)

const createSingleLineComment = ({
  next,
  char,
  save,
  raw,
  options
}: ITokenizer): any => {
  next(1)
  while (!isLineTerminator(char(1)) && next());
  __save__(save, raw, SINGLE_LINE_COMMENT, options)
}

const createMultiLineComment = ({
  next,
  char,
  save,
  raw,
  options,
  error
}: ITokenizer): any => {
  next(3)
  let isValid = false
  while (!(char(-1) === '*' && char() === '/' && (isValid = true)) && next());
  __save__(save, raw, MULTI_LINE_COMMENT, options)
  if (!isValid) error()
}

export const pluginSingleLineComment: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  self.raw() === '/' && self.char(1) === '/' && !createSingleLineComment(self)

export const pluginMultiLineComment: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean =>
  self.raw() === '/' && self.char(1) === '*' && !createMultiLineComment(self)
