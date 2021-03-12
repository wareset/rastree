import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'

import {
  TYPE_COMMENT,
  MULTI_LINE_COMMENT,
  SINGLE_LINE_COMMENT
} from '../../flags'
import { createCommentValue } from '../../ecma/comments'

/* LINE_TERMINATOR */
import { isLineTerminator } from '../../ecma/line-terminators'

const __save__ = (save: any, raw: any, flag: any, options: any): any =>
  save(TYPE_COMMENT, [flag], options.values ? createCommentValue(raw) : raw)

/* COMMENT */
export const pluginMultiLineComment: ITokenizerPluginFn = ({
  raw,
  char,
  next,
  save,
  options,
  error
}: ITokenizer) => (): any => {
  if (raw() === '/' && char(1) === '*') {
    next(3)
    let isValid = false
    while (!(char(-1) === '*' && char() === '/' && (isValid = true)) && next());
    __save__(save, raw(), MULTI_LINE_COMMENT, options)
    if (!isValid) error()
  }
}
export const pluginSingleLineComment: ITokenizerPluginFn = ({
  raw,
  char,
  next,
  save,
  options
}: ITokenizer) => (): any => {
  if (raw() === '/' && char(1) === '/') {
    while (!isLineTerminator(char(1)) && next());
    __save__(save, raw(), SINGLE_LINE_COMMENT, options)
  }
}
