/* eslint-disable max-len */
import { size } from 'wareset-utilites'

export type IToken = Token
export type ITokens = Token[]
export type ITokenizer = Tokenizer

export interface ITokenizerConstruct {
  (
    source: string,
    options: ITokenizerOptions,
    plugins: ITokenizerPluginFn[],
    typings: ITokenizerTypingFn[]
  ): Tokenizer
}

export interface ITokenizerOptions {
  loc?: boolean
  spaces?: boolean
  comments?: boolean
  strict?: boolean
}

export interface ITokenizerPluginFn {
  (self: ITokenizer, ...any: any[]): (...a: any[]) => boolean
}
export interface ITokenizerTypingFn {
  (self: ITokenizer, ...any: any[]): (token: IToken) => any
}

const TOKENIZER_OPTIONS: ITokenizerOptions = {
  loc: true,
  spaces: false,
  comments: false,
  strict: true
}

export class Token {
  constructor(
    public deep: number,
    public raw: string,
    public type?: string,
    public flags: string[] = [],
    public value?: any,
    public start: number = -1,
    public end: number = -1,
    public loc?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
  ) {}

  get range(): [number, number] {
    return [this.start, this.end]
  }
}

const error = (self: any, ...a: any[]): any => {
  console.error(self.token, ...a)
}

export class Tokenizer {
  readonly tokens: ITokens = []
  public token!: IToken
  public tokenLast!: IToken

  public deep = 0
  public i = 0

  readonly char: Function
  readonly next: Function
  readonly save: Function
  readonly raw: Function

  readonly eof: Function
  readonly slashed: Function
  readonly error: Function

  constructor(
    readonly source: string,
    readonly options: ITokenizerOptions = {},
    __plugins: ITokenizerPluginFn[] = [],
    __typings: ITokenizerTypingFn[] = []
  ) {
    options = { ...TOKENIZER_OPTIONS, ...(options || {}) }
    const plugins = __plugins.map((v) => v(this))
    const typings = __typings.map((v) => v(this))

    let locStart = { line: 1, column: 0 }
    const locEnd = { line: 1, column: 0 }

    let raw = ''
    this.raw = (): string => raw

    this.error = (...a: any[]): any => error(this, ...a)

    let index = -1
    const length = size(source)
    this.eof = (): boolean => index >= length
    this.char = (offset = 0): string => this.source[index + offset]
    let isBackslash = false
    this.slashed = (): boolean => isBackslash

    const next = (count: number, backslash?: boolean): any => {
      this.i = ++index
      const char = this.char() || ''
      raw += char
      if (char === '\n') locEnd.line++, (locEnd.column = 0)
      else locEnd.column++
      isBackslash = !!backslash
      if (!isBackslash && char === '\\') next(0, true)
      if (count > 1) this.next(--count)
    }
    this.next = (count: number = 0): boolean => next(count) || !this.eof()

    let num = 0
    let tkn: IToken
    const val = {}
    this.save = (
      type?: string,
      value: any = val,
      flags: string[] = [],
      lastly: boolean = true,
      pushIt = true
    ): any => {
      if (tkn && (tkn.type || tkn.type !== type)) {
        typings.forEach((typing) => typing(tkn))
        if (tkn.value === val) tkn.value = tkn.raw
      }

      if (raw) {
        if (type || !tkn || tkn.type) {
          tkn = this.token = new Token(this.deep, raw, type, flags, value, num)

          if (options.loc) {
            tkn.loc = { start: { ...locStart }, end: { ...locEnd } }
          }
          if (lastly) this.tokenLast = tkn
          if (pushIt) this.tokens.push(tkn)
        } else {
          tkn.raw += raw
          if (options.loc) tkn.loc!.end = { ...locEnd }
        }

        locStart = { ...locEnd }
        tkn.end = num = tkn.start + size(tkn.raw)
        raw = ''
      }
    }

    // const run = (): any => {
    //   this.next()
    //   plugins.some((plugin) => plugin()) || this.save()
    //   if (this.eof()) this.save('')
    //   if (index < length) run()
    // }
    // run()
    do {
      this.next()
      plugins.some((plugin) => plugin()) || this.save()
      if (this.eof()) this.save('')
    } while (index < length)

    if (this.deep) this.error()
  }
}

export const tokenizer: ITokenizerConstruct = (...a) => new Tokenizer(...a)
export default tokenizer
