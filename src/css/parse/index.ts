import tokenizeCSS, { ITokenizeCssOptions } from '../tokenize'
import createProgram from '../lib/create-program'
import { CssProgram } from '../lib/classes/css-program'

export const parse = (
  source: string,
  options?: ITokenizeCssOptions
): CssProgram => createProgram(tokenizeCSS(source, options))

export default parse
