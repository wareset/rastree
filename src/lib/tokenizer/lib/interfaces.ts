import { includes, push } from 'wareset-utilites'

export type IToken = Token
export type ITokens = IToken[]
type IChildren = IToken | ITokens | IChildren[]
export class Token {
  // readonly id!: number

  readonly range = [-1, -1]
  public loc?: ILoc

  public children: IChildren = []

  constructor(
    public deep: number,
    public raw: string,
    public type: string,
    public flags: string[] = [],
    public value?: any,
    // public start: number = -1,
    // public end: number = -1,
    loc?: ILoc
  ) {
    if (loc) this.loc = loc
  }

  get start(): number {
    return this.range[0]
  }
  set start(n: number) {
    this.range[0] = n
  }

  get end(): number {
    return this.range[1]
  }
  set end(n: number) {
    this.range[1] = n
  }

  setFlags(...flags: string[]): number {
    return push(this.flags, ...flags)
  }

  hasFlag(flag: string): boolean {
    return includes(this.flags, flag)
  }

  // get range(): [number, number] {
  //   return [this.start, this.end]
  // }
}

export interface ITokenizerOptions {
  // [key: string]: any
  loc?: boolean
  // separators?: boolean
  // comments?: boolean
  values?: boolean
  customTemplate?: boolean | [string | RegExp, string | RegExp]
  env?: 'script' | 'template' | 'templateConcise' | 'style' | 'styleConcise'
  // strict?: boolean
}

export interface ITokenizer {
  temp: { JSX_DEEPS: number[] }
  options: ITokenizerOptions
  source: () => string
  tokens: () => IToken[]

  token: (offset?: number) => IToken
  tokenSafe: (
    offset?: number,
    cb?: (token: IToken, k: number, source: ITokens) => boolean
  ) => Token

  index: (offset?: number) => number
  env: (addOrRemove?: string | false) => string[]
  raw: () => string
  char: (offset?: number) => string
  next: (count?: number) => boolean
  deep: (offset?: number) => number
  save: (type: string, flags?: string[], value?: any) => void
  slashed: () => boolean
  error: (...a: any[]) => any
}

export interface ITokenizerPluginFn {
  (self: ITokenizer, ...any: any[]): (...a: any[]) => void
}
export interface ITokenizerTypingFn {
  (self: ITokenizer, ...any: any[]): (token: IToken) => void
}
export interface ITokenizerEnvFn {
  (self: ITokenizer, ...any: any[]): (...a: any[]) => void
}

export type ILoc = {
  start: { line: number; column: number }
  end: { line: number; column: number }
}

export type ITokenDataJSXOpeningElementStart = [ITokens, ITokens?][]
