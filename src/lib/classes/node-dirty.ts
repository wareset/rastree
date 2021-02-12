import { indexOf } from 'wareset-utilites'

import { ProgramDirty } from './program-dirty'
import { NULL } from './utils'

export class NodeDirty {
  readonly type!: string
  deep: number = 0
  readonly data: string[] = []

  // name!: string
  // value!: string

  #raw!: string
  #__program__!: ProgramDirty

  constructor({ raw = '', deep = 0 } = {}) {
    ;(this.raw = raw), (this.deep = deep)
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

  get __program__(): ProgramDirty {
    return this.#__program__
  }
  set __program__(v: ProgramDirty) {
    this.#__program__ = v
  }

  get index(): number {
    return indexOf(this.__program__, this)
  }

  remove(): this {
    this.__program__.splice(this.index, 1)
    return this
  }

  toString(): string {
    return NULL
  }

  get __toString__(): string {
    return this.toString()
  }
}
