export const ERROR = 'ERROR'

/*
FORMAT_CONTROL
*/
export const FORMAT_CONTROL = 'FormatControl'
export { FORMAT_CONTROL as TYPE_FORMAT_CONTROL }

/*
WHITE_SPACE
*/
export const WHITE_SPACE = 'WhiteSpace'
export { WHITE_SPACE as TYPE_WHITE_SPACE }

/*
LINE_TERMINATOR
*/
export const LINE_TERMINATOR = 'LineTerminator'
export { LINE_TERMINATOR as TYPE_LINE_TERMINATOR }

/*
COMMENTS
*/
export const COMMENT = 'Comment'
export { COMMENT as TYPE_COMMENT }
export const MULTI_LINE_COMMENT = 'MultiLineComment'
export const SINGLE_LINE_COMMENT = 'SingleLineComment'

/*
PUNCTUATORS
*/
export const PUNCTUATOR = 'Punctuator'
export { PUNCTUATOR as TYPE_PUNCTUATOR }

/*
LITERALS
*/
export const LITERAL = 'Literal'

/* NULL */
export const NULL = 'Null'
export { NULL as TYPE_NULL }

/* BOOLEAN */
export const BOOLEAN = 'Boolean'
export { BOOLEAN as TYPE_BOOLEAN }

/* NUMERIC */
export const NUMERIC = 'Numeric'
export { NUMERIC as TYPE_NUMERIC }

export const DECIMAL_LITERAL = 'DecimalLiteral'
export const DECIMAL_INTEGER_LITERAL = 'DecimalIntegerLiteral'
export const DECIMAL_BIGINTEGER_LITERAL = 'DecimalBigIntegerLiteral'

export const NON_DECIMAL_INTEGER_LITERAL = 'NonDecimalIntegerLiteral'
export const BINARY_INTEGER_LITERAL = 'BinaryIntegerLiteral'
export const HEX_INTEGER_LITERAL = 'HexIntegerLiteral'
export const OCTAL_INTEGER_LITERAL = 'OctalIntegerLiteral'

export const NON_DECIMAL_BIGINTEGER_LITERAL = 'NonDecimalBigIntegerLiteral'
export const BINARY_BIGINTEGER_LITERAL = 'BinaryBigIntegerLiteral'
export const HEX_BIGINTEGER_LITERAL = 'HexBigIntegerLiteral'
export const OCTAL_BIGINTEGER_LITERAL = 'OctalBigIntegerLiteral'

export const NON_SUPPORT_BIGDECIMAL_LITERAL = 'NonSupportBigDecimalLiteral'

/* STRING */
export const STRING = 'String'
export { STRING as TYPE_STRING }
export const DOUBLE_STRING_CHARACTERS = 'DoubleStringCharacters'
export const SINGLE_STRING_CHARACTERS = 'SingleStringCharacters'

/* REGULAR_EXPRESSION */
export const REGULAR_EXPRESSION = 'RegularExpression'
export { REGULAR_EXPRESSION as TYPE_REGULAR_EXPRESSION }

/* TEMPLATE */
export const TEMPLATE = 'Template'
export { TEMPLATE as TYPE_TEMPLATE }
export const NO_SUBSTITUTION_TEMPLATE = 'NoSubstitutionTemplate'
export const TEMPLATE_HEAD = 'TemplateHead'
export const TEMPLATE_SUBSTITUTION_TAIL = 'TemplateSubstitutionTail'
export const TEMPLATE_MIDDLE = 'TemplateMiddle'
export const TEMPLATE_TAIL = 'TemplateTail'

export const INSIDE_TEMPLATE = 'InsideTemplate'

/*
IDENTIFIER
*/
export const IDENTIFIER = 'Identifier'
export { IDENTIFIER as TYPE_IDENTIFIER }

/*
KEYWORD
*/
export const KEYWORD = 'Keyword'
export { KEYWORD as TYPE_KEYWORD }
export const RESERVED_WORD = 'ReservedWord'
export const RESERVED_WORD_STRICT = 'ReservedWordStrict'
export const RESERVED_WORD_CONTEXTUAL = 'ReservedWordContextual'
export const WORD_CONTEXTUAL = 'WordContextual'
export const WORD_CONTEXTUAL_STRICT = 'WordContextualStrict'

export const TYPE_CUSTOM_TEMPLATE = 'CustomTemplate'

/*
JSX
*/
export const INSIDE_JSX = 'InsideJSX'

export const INSIDE_JSX_TAG_OPENING = 'InsideJSXTagOpening'
export const JSX_TAG_OPENING_START = 'JSXTagOpeningStart'
export const JSX_TAG_OPENING_END = 'JSXTagOpeningEnd'

export const INSIDE_JSX_TAG_CLOSING = 'InsideJSXTagClosing'
export const JSX_TAG_CLOSING_START = 'JSXTagClosingStart'
export const JSX_TAG_CLOSING_END = 'JSXTagClosingEnd'

export const INSIDE_JSX_TEMPLATE_START = 'InsideJSXTemplateStart'
export const INSIDE_JSX_TEMPLATE_END = 'InsideJSXTemplateEnd'
export const INSIDE_JSX_TEMPLATE = 'InsideJSXTemplate'
export const JSX_TEXT = 'JSXText'
