import { ITokenizer, ITokenizerPluginFn } from '../lib/interfaces'
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
import { createTemplateValue } from '../../ecma/literals/template'

// import { ENV_PREFIX } from './lib/env-prefix'

const BACKTICK = '`'

export const pluginTemplate: ITokenizerPluginFn = (
  { next, char, save, deep, raw, slashed, options, error }: ITokenizer,
  LIST: number[] = []
) => (temp1?: boolean, temp2?: boolean): void => {
  if (raw() === BACKTICK || (raw() === '}' && LIST[0] === deep())) {
    temp1 = char() === BACKTICK
    const flags = temp1 ? [] : [TEMPLATE_SUBSTITUTION_TAIL]
    if (!temp1) deep(-1), LIST.shift()

    let isValid = false

    while (
      next() &&
      (slashed() ||
        !(
          ((temp2 = char() === BACKTICK) ||
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

    // if (temp1 === !temp2)
    //   env(temp1 ? ENV_PREFIX + TYPE_TEMPLATE + BACKTICK : false)

    save(
      TYPE_TEMPLATE,
      flags,
      options.values ? createTemplateValue(raw()) : raw()
    )
    if (!temp2) LIST.unshift(deep(1))
    if (!isValid) error()
  }
}
