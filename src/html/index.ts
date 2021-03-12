import { tokenizer } from '../lib/tokenizer'
import { ITokens, ITokenizerOptions } from '../lib/tokenizer/lib/interfaces'
import { ENV_TEMPLATE, ENV_TEMPLATE_CONCISE } from '../lib/tokenizer/env/types'

export { ITokenizerOptions }

const tokenize = (source: string, options?: ITokenizerOptions): ITokens =>
  tokenizer(source, { ...(options || {}), env: ENV_TEMPLATE })

const tokenizeConcise = (
  source: string,
  options?: ITokenizerOptions
): ITokens =>
  tokenizer(source, { ...(options || {}), env: ENV_TEMPLATE_CONCISE })

export { tokenize, tokenizeConcise }
export default { tokenize, tokenizeConcise }
