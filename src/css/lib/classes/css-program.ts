import { length as len, splice, repeat, instanceOf } from 'wareset-utilites'
import { test, isArray, isVoid, replace } from 'wareset-utilites'

import { IToken, ITokens } from '../../../lib/tokenizer'
import { ProgramDirty } from '../../../lib/classes/program-dirty'
import { NodeDirty } from '../../../lib/classes/node-dirty'

// import { OPTIONS } from './utils'
import { EMPTY, SPACE } from './utils'

import { CssComment } from './css-comment'
import { CssAtrule } from './css-atrule'
import { CssAttribute } from './css-attribute'
import { CssKeyframe } from './css-keyframe'
import { CssSelector } from './css-selector'

import {
  TYPE_COMMENT,
  TYPE_CSS_ATRULE,
  TYPE_CSS_ATTRIBUTE,
  TYPE_CSS_KEYFRAME,
  TYPE_CSS_SELECTOR
} from '../../flags'

const CLASSES: any = {
  [TYPE_COMMENT]: CssComment,
  [TYPE_CSS_ATRULE]: CssAtrule,
  [TYPE_CSS_ATTRIBUTE]: CssAttribute,
  [TYPE_CSS_KEYFRAME]: CssKeyframe,
  [TYPE_CSS_SELECTOR]: CssSelector
}

export interface IToCodeOptions {
  indent?: string
  concise?: boolean
  global?: boolean
  scoper?: string
  minify?: boolean
}

export const CSS_TYPE_COMMON = '[:common]'
const REG_CSS_TYPE_COMMON = /\[:common\]/g
export const CSS_TYPE_GLOBAL = '[:global]'
const REG_CSS_TYPE_GLOBAL = /\[:global\]/g
export const CSS_TYPE_SCOPED = '[:scoped]'
const REG_CSS_TYPE_SCOPED = /\[:scoped\]/g

const TO_CODE_OPTIONS: IToCodeOptions = {
  indent: '\t',
  concise: false,
  // global: true,
  // scoper: '[scoped]',
  minify: false
}

export class CssProgram extends ProgramDirty {
  constructor(...tokens: ITokens) {
    super()
    tokens.forEach((v: IToken) => {
      const className = CLASSES[v.type!]
      if (className) this.push(new className(v))
    })
  }

  toArray(): [string, string[], string[]][] {
    const res: any = []
    let i: number, node: any, deep: number, type: string
    let i2: number, node2: any, deep2: number, type2: string
    // let pCount: number

    this.forEach((v, str) => {
      if (instanceOf(v, NodeDirty) && (str = v.toString())) {
        ;({ deep, type } = v)
        res.push([deep, type, [], [], str])
      }
    })

    // const sets = (cb: Function): void => {
    //   let now: any
    //   let i = -1
    //   while (++i < len(res)) {
    //     ;(node = res[i]), (deep = node[0]), (type = node[1])

    //     if (cb()) (now = node), splice(res, i, 1), --i
    //     else if (now && node[0] <= now[0] && type !== TYPE_COMMENT) now = 0
    //     else if (now && node[0] > now[0]) node[2].push(now[4]), --node[0]
    //   }
    // }

    // sets(() => type === TYPE_CSS_ATRULE && test(/^\s*@media\b/, node[4]))
    // sets(() => type === TYPE_CSS_ATRULE && test(/^\s*@supports\b/, node[4]))

    i = -1
    let isMedia: boolean
    let needRemove: boolean
    while (++i < len(res)) {
      ;(node = res[i]), (deep = node[0]), (type = node[1])
      // if (type === TYPE_CSS_ATTRIBUTE) {
      //   i2 = i
      //   second: while (++i2 < len(res)) {
      //     ;(node2 = res[i2]), (deep2 = node2[0]), (type2 = node2[1])
      //     if (type2 !== TYPE_COMMENT && deep2 < deep) break second
      //     if (type2 === TYPE_CSS_ATTRIBUTE && deep2 === deep) {
      //       if (EMPTY + node[2] === EMPTY + node2[2])
      //         node.push(node2[4]), splice(res, i2--, 1)
      //     }
      //   }
      // }

      if (type !== TYPE_CSS_ATTRIBUTE && type !== TYPE_COMMENT) {
        i2 = i
        needRemove = false
        isMedia = test(/^\s*@(?:media|supports)\b/, node[4])
        if (isMedia) needRemove = true
        second: while (++i2 < len(res)) {
          ;(node2 = res[i2]), (deep2 = node2[0]), (type2 = node2[1])
          if (type2 !== TYPE_COMMENT && deep2 <= deep) break second
          if (deep2 > deep) {
            needRemove = true

            if (isMedia) node2[2].push(node[4])
            else {
              if (node[4][0] === '@') {
                node2[3] = node2[3].filter((v: string) => v[0] === '@')
              } else if (type === TYPE_CSS_SELECTOR) node2[3].length = 0

              node2[3].push(node[4])
            }
          }
        }
        if (needRemove) splice(res, i--, 1)
      }
    }

    i = -1
    let i3 = 0
    while (++i < len(res)) {
      node = res[i]
      if (!node._t) node._t = node[2] + '|' + node[3]
      // if (node._t !== '|') {
      i3 = 0
      i2 = i
      while (++i2 < len(res)) {
        node2 = res[i2]
        if (!node2._t) node2._t = node2[2] + '|' + node2[3]

        if (node._t === node2._t) {
          if (node[4] === node2[4]) splice(res, i2--, 1)
          else if (i2 - i > 1) {
            splice(res, i2, 1), splice(res, i + ++i3, 0, node2)
          }
        }
      }
      // }
    }

    // console.log(res)
    return res.map(([, type, media, path, attrs]: any) => [
      type,
      [...media, ...path],
      attrs
    ])
  }

  toCode(
    arr?: [string, string[], string[]][] | IToCodeOptions,
    options?: IToCodeOptions
  ): string {
    if (!isArray(arr)) (options = arr), (arr = this.toArray())
    return CssProgram.toCode(arr, options)
  }

  static toCode(
    arr: [string, string[], string[]][],
    options?: IToCodeOptions
  ): string {
    options = { ...TO_CODE_OPTIONS, ...(options || {}) }
    const { indent, minify, concise } = options

    const SEP = minify ? EMPTY : SPACE
    const CRLF = minify ? EMPTY : '\n'
    const IND = minify ? EMPTY : '' + indent

    const FBO = !minify && concise ? EMPTY : '{'
    const FBC = !minify && concise ? EMPTY : '}'
    const CSP = !minify && concise ? EMPTY : ';'

    let res = EMPTY
    let start = EMPTY
    let space = EMPTY
    let temp: any = []

    let lk = 0
    let is: boolean
    arr.forEach((v: any) => {
      if (!minify || v[0] !== TYPE_COMMENT) {
        const __l1__ = len(v[1])
        const __t1__ = repeat(IND, __l1__)
        const COMMA = v[0] === TYPE_COMMENT ? EMPTY : CSP
        v[2] = CRLF + __t1__ + v[2] + COMMA

        start = EMPTY
        space = EMPTY
        is = false
        if (!len(v[1])) res += repeat(FBC, lk)
        v[1].forEach((v2: any, k2: any) => {
          if (!space) space = SEP
          if (temp[k2] !== v2) {
            temp = []
            if (!is) is = !!(res += repeat(FBC, lk - k2))
            start += CRLF + repeat(IND, k2) + v2 + SEP + FBO
          }
        })

        res += start + v[2] + space
        temp = [...v[1]]
        lk = __l1__
      }
    })

    res += repeat(FBC, lk)

    const { global, scoper } = options
    if (!isVoid(global) || !isVoid(scoper)) {
      res = replace(
        res,
        REG_CSS_TYPE_COMMON,
        global ? CSS_TYPE_GLOBAL : CSS_TYPE_SCOPED
      )
    }

    if (!isVoid(scoper)) {
      res = replace(res, REG_CSS_TYPE_GLOBAL)
      res = replace(res, REG_CSS_TYPE_SCOPED, scoper)
    }
    // console.log(arr)

    return res
  }
}

export default CssProgram
