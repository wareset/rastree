/* eslint-disable max-len */
import { splitWords, includesFactory } from '../lib/utils'

/*
https://tc39.es/ecma262/#sec-identifier-names
*/
// IdentifierName ::
//    IdentifierStart
//    IdentifierName IdentifierPart

/*
https://tc39.es/ecma262/#sec-keywords-and-reserved-words
*/
// ReservedWord :: one of
export const isReservedWord = includesFactory(
  splitWords(
    'await break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield'
  )
)

export const isReservedWordStrict = includesFactory(
  splitWords('let static implements interface package private protected public')
)

export const isReservedWordContextual = includesFactory(
  splitWords('await yield')
)

export const isWordContextual = includesFactory(
  splitWords('as async from get of set target')
)

export const isWordContextualStrict = includesFactory(
  splitWords('arguments eval')
)

// prettier-ignore
export const isKeyword = (s: string): boolean => isReservedWord(s) || isReservedWordStrict(s)
