import { replace, trim } from 'wareset-utilites'

import { NodeDirty } from '../../../lib/classes/node-dirty'
import { TYPE_CSS_ATTRIBUTE } from '../../flags'
// import { TYPE_COMMENT } from '../../flags'

import { getDelimeter } from '../../../lib/get-delimeter'
import { NULL } from './utils'

import { normalizeValue } from '../normalizes/normalize-value'

export class CssAttribute extends NodeDirty {
  readonly type = TYPE_CSS_ATTRIBUTE
  readonly data!: [string, string] // = [NULL, NULL]

  get name(): string {
    return this.data[0] || NULL
  }
  set name(s: string) {
    this.data[0] = trim(normalizeValue(s), ':')
  }
  get value(): string {
    return this.data[1] || NULL
  }
  set value(s: string) {
    this.data[1] = normalizeValue(s)
  }

  __raw__(s: string): string {
    const __s__ = normalizeValue(s)
    const __d__ = getDelimeter(__s__)
    const [name, value] = replace(__s__, /\s*(:|\s)\s*/, __d__).split(__d__)
    ;(this.data[0] = name), (this.data[1] = value)
    return s
  }

  toString(): string {
    return this.name + ': ' + this.value
  }
}

export default CssAttribute
