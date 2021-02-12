import createProgram from '../lib/create-program'
import tokenizeConciseCSS, {
  ITokenizeConciseCssOptions
} from '../tokenize-concise'
import { CssProgram } from '../lib/classes/css-program'

export const parseConcise = (
  source: string,
  options?: ITokenizeConciseCssOptions
): CssProgram => createProgram(tokenizeConciseCSS(source, options))

export default parseConcise
