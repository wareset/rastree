export class Token {
  // prettier-ignore
  constructor(
    readonly deep: number,
    readonly raw: string,
    readonly type: string,
    readonly flags: string[],
    readonly start?: number,
    readonly end?: number,
    readonly value?: any,
    readonly range?: [number, number],
    readonly loc?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
  ) {}
}

export interface IOptionsTokenizeJS {
  range?: boolean
  loc?: boolean
  // backTicks?: boolean
  // singleQuotes?: boolean
  // doubleQuotes?: boolean
  regexp?: boolean
  customTemplate?: boolean | [string | RegExp, string | RegExp]
  jsx?: boolean
  strict?: boolean
}
