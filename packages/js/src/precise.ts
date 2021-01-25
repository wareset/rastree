import preciseTokenize from './precise-tokenize'
import { INodeTokenize, IOptionsTokenize } from '@rastree/lib'
export { INodeTokenize, IOptionsTokenize }

export const preciseJS = (content = '', options?: IOptionsTokenize): any => {
  throw new Error(
    'Rastree JS precise in progress:\n' + content + '\n' + options
  )
}

preciseJS.tokenize = preciseTokenize
// preciseJS.conciseTokenize = conciseTokenize
// preciseJS.concise = concise
preciseJS.precise = preciseJS

export default preciseJS
