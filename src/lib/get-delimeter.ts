import enumChars from 'enum-chars'

export const getDelimeter = (content: string, soult = '\0%'): string => {
  let rand = ''
  do rand = enumChars.numbers(rand)
  while (!(soult + rand) || content.indexOf(soult + rand) > -1)
  return soult + rand
}

export default getDelimeter
