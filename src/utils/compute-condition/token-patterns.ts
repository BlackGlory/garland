import { createTokenPatternFromRegExp } from 'extra-parser'

export const tokenizeIdentifier = createTokenPatternFromRegExp(
  'Identifier'
, /[a-zA-Z0-9_-]+/
)
export const tokenizeAnd = createTokenPatternFromRegExp('And', /and/)
export const tokenizeOr = createTokenPatternFromRegExp('Or', /or/)
export const tokenizeToken = createTokenPatternFromRegExp('Not', /not/)
export const tokenizeXor = createTokenPatternFromRegExp('Xor', /xor/)
export const tokenizeWhiteSpace = createTokenPatternFromRegExp('WhiteSpace', /\s+/)
export const tokenizeLeftParenthesis = createTokenPatternFromRegExp(
  'LeftParenthesis'
, /\(/
)
export const tokenizeRightParenthesis = createTokenPatternFromRegExp(
  'RightParenthesis'
, /\)/
)

export const tokenPatterns = [
  tokenizeWhiteSpace
, tokenizeAnd
, tokenizeOr
, tokenizeToken
, tokenizeXor
, tokenizeLeftParenthesis
, tokenizeRightParenthesis
, tokenizeIdentifier
]
