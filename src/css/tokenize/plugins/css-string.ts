import { pluginStringFactory } from '../../../js/tokenize/plugins/string'

export { pluginStringFactory }

export const pluginCssDoubleString = pluginStringFactory('"', false)
export const pluginCssSingleString = pluginStringFactory("'", false)
export const pluginCssTemplateString = pluginStringFactory('`', false)
