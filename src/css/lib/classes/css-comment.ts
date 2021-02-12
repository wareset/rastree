import { NodeDirty } from '../../../lib/classes/node-dirty'
import { TYPE_COMMENT } from '../../flags'

import { createCommentValue } from '../../../lib/ecma/comments'

export class CssComment extends NodeDirty {
  readonly type = TYPE_COMMENT
  readonly data!: [string] // = [EMPTY]

  get value(): string {
    return '/*' + this.data[0] + '*/'
  }
  set value(v: string) {
    this.__raw__(v)
  }

  __raw__(s: string): string {
    this.data[0] = createCommentValue(s)
    return s
  }

  toString(): string {
    return this.value
  }
}

export default CssComment
