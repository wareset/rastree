import { last, length as len, splice, test, trim } from 'wareset-utilites'

import { NULL, EMPTY, SPACE } from './utils'
import {
  normalizeSelector,
  testIsGlobalOrScoped
} from '../normalizes/normalize-selector'

import { NodeDirty } from '../../../lib/classes/node-dirty'
import { TYPE_CSS_SELECTOR } from '../../flags'
import { TYPE_COMMENT } from '../../flags'

const splitArrByComma = (arr: string[]): string[][] => {
  let current: string[] = []
  const res = [current]
  arr.forEach((v) => (v === ',' ? res.push((current = [])) : current.push(v)))
  return res
}

export class CssSelector extends NodeDirty {
  readonly type = TYPE_CSS_SELECTOR
  readonly data!: string[] // = ['&']

  get value(): string {
    return this.data.join(EMPTY)
  }
  set value(s: string) {
    this.__raw__(s)
  }

  __raw__(s: string): string {
    splice(this.data, 0, len(this.data), ...normalizeSelector(s))
    return s
  }

  toString(): string {
    let i = this.index
    const program = this.__program__
    const tempArr: string[] = []
    let node: any
    let deep = this.deep
    while (--i >= 0 && deep) {
      node = program[i]
      if (node.type !== TYPE_COMMENT) {
        if (node.type === TYPE_CSS_SELECTOR) {
          if (node.deep < deep) tempArr.unshift(node.data)
        }

        if (deep > node.deep) deep = node.deep
      }
    }

    // console.log([...tempArr.map((v) => [...v]), [...this.data]])
    // console.log(splitArrByComma(this.data))
    let res: string[] = this.data
    let temp: any
    while (len(tempArr)) {
      ;(temp = res), (res = [])
      splitArrByComma((tempArr as any[]).pop()).forEach((prt) => {
        if (len(res) && last(res) !== ',') res.push(',')
        res.push(
          ...[].concat(...(temp.map((v: any) => (v === '&' ? prt : v)) as any))
        )
        // console.log(333, [...prt], [...temp], [...res])
      })
    }
    res = normalizeSelector(res.join(EMPTY)).filter((v) => v !== '&')

    // console.log(222, [...res])

    i = -1
    const TYPE_DEFAULT = ':common'
    let globalScope = TYPE_DEFAULT
    const localScopes: string[] = []

    const removeSpaces = (): void => {
      if (test(/^[\s]+$/, res[i + 1])) splice(res, i + 1, 1)
      if (test(/^[\s]+$/, res[i - 1])) splice(res, i - 1, 1), --i
    }

    while (++i < len(res)) {
      temp = res[i]
      if (testIsGlobalOrScoped(temp)) {
        splice(res, i, 1), --i
        if (res[i + 1] !== '(') {
          globalScope = temp
        } else localScopes.unshift(temp), splice(res, i + 1, 1)
      } else if (res[i] === ')') localScopes.shift(), splice(res, i, 1), --i
      else if (!test(/^[\s,>+~]+$/, temp)) {
        res[i] += '[' + (localScopes[0] || globalScope) + ']'
      } else if (temp === ',') globalScope = TYPE_DEFAULT
      else if (trim(res[i])) {
        res[i] = SPACE + temp + SPACE
        removeSpaces()
      }

      if (test(/^[\s]+$/, res[i])) removeSpaces()
    }

    // console.log(res)
    const resStr = splitArrByComma(res)
      .map((v) => trim(v.join(EMPTY), '\\s&,>+~'))
      .join(', ')
    // console.log(resStr)
    return resStr || NULL
  }
}

export default CssSelector
