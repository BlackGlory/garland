import { createTokenPatternFromRegExp } from 'extra-parser'
import {
  Identifier
, And
, Or
, Not
, Xor
, WhiteSpace
, LeftParenthesis
, RightParenthesis
} from './tokens'

export const tokenizeIdentifier = createTokenPatternFromRegExp<Identifier>(
  'Identifier'
, /[a-zA-Z0-9_-]+/
)
export const tokenizeAnd = createTokenPatternFromRegExp<And>(
  'And'
, /and/
)
export const tokenizeOr = createTokenPatternFromRegExp<Or>(
  'Or'
, /or/
)
export const tokenizeToken = createTokenPatternFromRegExp<Not>(
  'Not'
, /not/
)
export const tokenizeXor = createTokenPatternFromRegExp<Xor>(
  'Xor'
, /xor/
)
export const tokenizeWhiteSpace = createTokenPatternFromRegExp<WhiteSpace>(
  'WhiteSpace'
, /\s+/
)
export const tokenizeLeftParenthesis = createTokenPatternFromRegExp<LeftParenthesis>(
  'LeftParenthesis'
, /\(/
)
export const tokenizeRightParenthesis = createTokenPatternFromRegExp<RightParenthesis>(
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
