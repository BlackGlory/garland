import { ITokenPattern, createTokenPatternFromRegExp } from 'extra-parser'
import {
  Token
, Identifier
, And
, Or
, Not
, Xor
, WhiteSpace
, LeftParenthesis
, RightParenthesis
} from './tokens'

export const tokenPatterns: Array<ITokenPattern<Token>> = []

export const tokenizeWhiteSpace = createTokenPatternFromRegExp<WhiteSpace>(
  'WhiteSpace'
, /\s+/
)
tokenPatterns.push(tokenizeWhiteSpace)

export const tokenizeAnd = createTokenPatternFromRegExp<And>(
  'And'
, /and/
)
tokenPatterns.push(tokenizeAnd)

export const tokenizeOr = createTokenPatternFromRegExp<Or>(
  'Or'
, /or/
)
tokenPatterns.push(tokenizeOr)

export const tokenizeNot = createTokenPatternFromRegExp<Not>(
  'Not'
, /not/
)
tokenPatterns.push(tokenizeNot)

export const tokenizeXor = createTokenPatternFromRegExp<Xor>(
  'Xor'
, /xor/
)
tokenPatterns.push(tokenizeXor)

export const tokenizeLeftParenthesis = createTokenPatternFromRegExp<LeftParenthesis>(
  'LeftParenthesis'
, /\(/
)
tokenPatterns.push(tokenizeLeftParenthesis)

export const tokenizeRightParenthesis = createTokenPatternFromRegExp<RightParenthesis>(
  'RightParenthesis'
, /\)/
)
tokenPatterns.push(tokenizeRightParenthesis)

export const tokenizeIdentifier = createTokenPatternFromRegExp<Identifier>(
  'Identifier'
, /[a-zA-Z0-9_-]+/
)
tokenPatterns.push(tokenizeIdentifier)
