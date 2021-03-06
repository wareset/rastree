import { tokenizer } from '../lib/tokenizer'
import { ITokens, ITokenizerOptions } from '../lib/tokenizer/lib/interfaces'
import { ENV_STYLE, ENV_STYLE_CONCISE } from '../lib/tokenizer/env/types'

export { ITokenizerOptions }

const tokenize = (source: string, options?: ITokenizerOptions): ITokens =>
  tokenizer(source, { ...(options || {}), env: ENV_STYLE })

const tokenizeConcise = (
  source: string,
  options?: ITokenizerOptions
): ITokens => tokenizer(source, { ...(options || {}), env: ENV_STYLE_CONCISE })

export { tokenize, tokenizeConcise }
export default { tokenize, tokenizeConcise }
