import { ITokens } from '../../lib/tokenizer'
import { CssProgram } from './classes/css-program'

export const createProgram = (tokens: ITokens): CssProgram =>
  new CssProgram(...tokens)

export default createProgram
