import { pluginStringFactory } from '../../../js/tokenize/plugins/string'

export const pluginDoubleString = pluginStringFactory('"')
export const pluginSingleString = pluginStringFactory("'")
export const pluginTemplateString = pluginStringFactory('`')
