import { trim } from 'wareset-utilites'

export const trimCss = (value: string): string => trim(value, '\\s{};')

export default trimCss
