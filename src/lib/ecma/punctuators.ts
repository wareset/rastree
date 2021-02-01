/* eslint-disable max-len */
import { splitWords, includesFactory } from '../ecma-utils'

/*
https://tc39.es/proposal-logical-assignment/
*/
// // LogicalAssignmentPunctuator::one of
// export const LOGICAL_ASSIGMENT_PUNCTUATOR = regexpCreate(pipety('&&= ||= ??='))
// // prettier-ignore
// export const isLogicalAssignmentPunctuator = testFactory(LOGICAL_ASSIGMENT_PUNCTUATOR)

/*
https://tc39.es/ecma262/#sec-punctuators
*/

export const isPunctuator = includesFactory(
  splitWords(
    `{ } ( ) [ ]
; , ~  :
? ?. ?? ??=
< <= << <<=
> >= >> >>= >>> >>>=
= == === =>
^ ^=
% %=
! != !==
+ += ++
- -= --
* *= ** **=
& &= && &&=
| |= || ||=
. ...
/ /=`
  )
)
