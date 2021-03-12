import enumChars from 'enum-chars'
import { indexOf } from 'wareset-utilites'

export const getDelimeter = (content: string, salt = '\0%'): string => {
  let rand = ''
  let res = ''
  do rand = enumChars.numbers(rand)
  while (!(res = salt + rand) || indexOf(content, res) > -1)
  return res
}

export default getDelimeter
