import { indexOf, length, typed, keys } from 'wareset-utilites'

import { ProgramDirty } from './program-dirty'
import { NULL } from './utils'

export class NodeDirty {
  readonly type!: string
  deep: number = 0
  // private readonly data: any[] = []
  cacheShear!: number

  #raw!: string
  #program!: ProgramDirty

  constructor({ raw = '', deep = 0 } = {}) {
    ;(this.raw = raw), (this.deep = deep)
  }

  get shear(): number {
    return this.deep
  }

  get raw(): string {
    return this.#raw
  }
  __raw__(v: string): string {
    return v
  }
  set raw(v) {
    this.#raw = this.__raw__(v)
  }

  get program(): ProgramDirty {
    return this.#program
  }
  set program(v: ProgramDirty) {
    this.#program = v
  }

  get index(): number {
    return indexOf(this.program, this)
  }

  remove(): this {
    this.program.splice(this.index, 1)
    return this
  }

  // ${this.index} ${this.shear}
  indent(indent = '\t'): string {
    return `${''.padEnd(this.shear * length(indent), indent)}`
  }

  clone(full = false): NodeDirty {
    const Proto = typed(this) as any
    const clone = new Proto()

    // console.log(Object.keys(this));

    clone.program = this.program
    if (full) clone.raw = this.raw
    // (clone.deep = this.deep), (clone.value = this.value);
    keys(this).forEach((k: string) => (clone[k] = (this as any)[k]))
    // each(this, (v: any, k: string) => k !== 'raw' && (clone[k] = v));
    return clone
  }

  toString(): string {
    return NULL
  }

  get __toString__(): string {
    return this.toString()
  }
}
