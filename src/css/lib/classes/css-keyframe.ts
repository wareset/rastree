import { test } from 'wareset-utilites'

// import { CssSelector } from './css-selector'
import { NodeDirty } from '../../../lib/classes/node-dirty'
import { TYPE_CSS_KEYFRAME } from '../../flags'

import { NULL, EMPTY } from './utils'

import { normalizeValue } from '../normalizes/normalize-value'

export class CssKeyframe extends NodeDirty {
  readonly type = TYPE_CSS_KEYFRAME
  readonly data!: [string] // = [NULL]

  get value(): string {
    return this.data[0] + (test(/^\s*\d+$/, this.data[0]) ? '%' : EMPTY) || NULL
  }
  set value(s: string) {
    this.__raw__(s)
  }

  __raw__(s: string): string {
    this.data[0] = normalizeValue(s)
    return s
  }

  toString(): string {
    return this.value
  }
}

export default CssKeyframe
