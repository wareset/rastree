import { tokenizer } from '../lib/tokenizer'
import { ITokens, ITokenizerOptions } from '../lib/tokenizer/lib/interfaces'
import { ENV_SCRIPT } from '../lib/tokenizer/env/types'

export { ITokenizerOptions }

const tokenize = (source: string, options?: ITokenizerOptions): ITokens =>
  tokenizer(source, { ...(options || {}), env: ENV_SCRIPT })

export { tokenize }
export default { tokenize }
