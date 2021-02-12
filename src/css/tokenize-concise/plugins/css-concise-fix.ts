import { test } from 'wareset-utilites'

import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'

const createCssConciseFix = ({ next, char }: ITokenizer): any => {
  while (test(/\s/, char(1)) && next());
}

// [-+>,~]
export const cssConciseFix: ITokenizerPluginFn = (
  self: ITokenizer
) => (): boolean => test(/[,]/, self.raw()) && !!createCssConciseFix(self)
