import { replace, trim, test, unique } from 'wareset-utilites'

import { NodeDirty } from '../../../lib/classes/node-dirty'
import { TYPE_CSS_ATRULE } from '../../flags'
import { TYPE_COMMENT } from '../../flags'

import { getDelimeter } from '../../../lib/get-delimeter'
import { NULL, EMPTY, SPACE } from './utils'

import { normalizeValue } from '../normalizes/normalize-value'

const fixAtruleName = (s: string): string => trim(normalizeValue(s, true), '@')

export class CssAtrule extends NodeDirty {
  readonly type = TYPE_CSS_ATRULE
  readonly data!: [string, string] // = [NULL, EMPTY]

  get name(): string {
    return (test(/^@/, this.data[0]) ? EMPTY : '@') + this.data[0] || NULL
  }
  set name(s: string) {
    this.data[0] = fixAtruleName(s)
  }
  get value(): string {
    return this.data[1] || EMPTY
  }
  set value(s: string) {
    this.data[1] = normalizeValue(s, true)
  }

  __raw__(s: string): string {
    const __s__ = fixAtruleName(s)
    const __d__ = getDelimeter(__s__)
    const [name, value] = replace(__s__, /\s*(?=[^\w-])\s*/, __d__).split(__d__)
    ;(this.data[0] = name), (this.data[1] = value)
    return s
  }

  get isMedia(): boolean {
    return test(/^\s*@?(?:media)\b/, this.name)
  }

  toString(): string {
    const name = this.name
    let value = this.value
    if (this.isMedia) {
      let i = this.index
      const program = this.__program__
      const tempArr: string[] = [this.value]
      let node: any
      let deep = this.deep
      while (--i >= 0 && deep) {
        node = program[i]
        if (node.type !== TYPE_COMMENT) {
          if (node.type === TYPE_CSS_ATRULE && node.name === name) {
            if (node.deep < deep) tempArr.unshift(node.value)
          }

          if (deep > node.deep) deep = node.deep
        }
      }

      // prettier-ignore
      const atruleValues: string[] = unique([].concat(
        ...(tempArr.map((v) => trim(v).split(/\s*\band\b\s*/)) as any)
      ) as string[])

      value = atruleValues.join(' and ')
    }
    return name + (value ? SPACE : EMPTY) + value
  }
}

export default CssAtrule
