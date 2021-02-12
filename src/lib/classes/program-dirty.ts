import { instanceOf } from 'wareset-utilites'

import { NodeDirty } from './node-dirty'
import { NULL } from './utils'

export class ProgramDirty extends Array {
  constructor(...a: any[]) {
    super(), a.length && this.push(...a)
  }

  __setParent__(a: NodeDirty[]): NodeDirty[] {
    return a.filter((v) => instanceOf(v, NodeDirty) && (v.__program__ = this))
  }

  unshift(...a: NodeDirty[]): any {
    super.unshift(...this.__setParent__(a))
    return this
  }
  splice(n1: number, n2: number, ...a: NodeDirty[]): any {
    super.splice(n1, n2, ...this.__setParent__(a))
    return this
  }
  push(...a: NodeDirty[]): any {
    super.push(...this.__setParent__(a))
    return this
  }
  set(k: number, value: NodeDirty): this {
    this[k] = this.__setParent__([value])[0]
    return this
  }

  toString(): string {
    return NULL
  }

  // get __toString__(): string {
  //   return this.toString()
  // }
}
