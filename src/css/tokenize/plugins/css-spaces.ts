import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'

import { SEPARATOR } from '../../flags'

import { isWhiteSpace } from '../../../lib/ecma/white-spaces'

const createCssSeparator = ({
  next,
  char,
  save,
  raw,
  options
}: ITokenizer): any => {
  while (isWhiteSpace(char() + char(1)) && next());
  save(SEPARATOR, raw(), [], options.separators)
}

export const pluignCssSeparator: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => isWhiteSpace(self.raw()) && !createCssSeparator(self)
