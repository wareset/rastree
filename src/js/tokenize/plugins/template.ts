import { ITokenizer, ITokenizerPluginFn } from '../../../lib/tokenizer'
/* TEMPLATE */
/* LITERAL */
import { LITERAL } from '../../flags'
// prettier-ignore
import { TYPE_TEMPLATE } from '../../flags'
import { NO_SUBSTITUTION_TEMPLATE, TEMPLATE_HEAD } from '../../flags'
// prettier-ignore
import { TEMPLATE_SUBSTITUTION_TAIL } from '../../flags'
import { TEMPLATE_MIDDLE, TEMPLATE_TAIL } from '../../flags'
// import { INSIDE_TEMPLATE } from '../../flags'
import { createTemplateValue } from '../../../lib/ecma/literals/template'

const createTemplate = (
  self: ITokenizer,
  LIST: number[],
  temp1?: any,
  temp2?: any
): any => {
  const { next, char, save, raw, slashed, error } = self
  temp1 = char() === '`'
  const flags = temp1 ? [] : [TEMPLATE_SUBSTITUTION_TAIL]
  if (!temp1) --self.deep, LIST.shift()

  let isValid = false

  while (
    next() &&
    (slashed() ||
      !(
        ((temp2 = char() === '`') ||
          (char() === '$' && char(1) === '{' && next())) &&
        (isValid = true)
      ))
  );

  // prettier-ignore
  flags.push(
    temp1
      ? temp2 ? NO_SUBSTITUTION_TEMPLATE : TEMPLATE_HEAD
      : temp2 ? TEMPLATE_TAIL : TEMPLATE_MIDDLE,
    LITERAL
  )

  save(TYPE_TEMPLATE, createTemplateValue(raw()), flags)
  if (!temp2) LIST.unshift(++self.deep)
  if (!isValid) error()
}

export const pluginTemplate: ITokenizerPluginFn = (
  self: ITokenizer,
  LIST: number[] = []
) => (): boolean =>
  (self.raw() === '`' || (self.raw() === '}' && LIST[0] === self.deep)) &&
  !createTemplate(self, LIST)
