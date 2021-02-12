import { instanceOf, typed } from 'wareset-utilites'

import { NodeDirty } from './node-dirty'
import { NULL } from './utils'

export class ProgramDirty extends Array {
  constructor(...a: any[]) {
    super(), a.length && this.push(...a)
  }
  setParent(...a: NodeDirty[]): NodeDirty[] {
    return a.filter((v) => instanceOf(v, NodeDirty) && (v.program = this))
  }

  unshift(...a: NodeDirty[]): any {
    super.unshift(...this.setParent(...a))
    return this
  }
  splice(n1: number, n2: number, ...a: NodeDirty[]): any {
    super.splice(n1, n2, ...this.setParent(...a))
    return this
  }
  push(...a: NodeDirty[]): any {
    super.push(...this.setParent(...a))
    return this
  }
  set(k: number, value: NodeDirty): this {
    this[k] = this.setParent(value)[0]
    return this
  }

  clone(): ProgramDirty {
    const Proto = typed(this) as any
    const clone = new Proto()

    this.forEach((v) => clone.push(v.clone()))
    return clone
  }

  toString(): string {
    return NULL
  }

  // get __toString__(): string {
  //   return this.toString()
  // }
}
