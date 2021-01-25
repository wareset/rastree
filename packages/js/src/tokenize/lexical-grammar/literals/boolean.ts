import { splitWords, includesFactory } from '../../lib/utils'

/*
https://tc39.es/ecma262/#sec-boolean-literals
*/
// BooleanLiteral ::

export const isBooleanLiteral = includesFactory(splitWords('true false'))
