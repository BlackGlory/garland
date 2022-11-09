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

export const whiteSpacePattern = createTokenPatternFromRegExp<WhiteSpace>(
  'WhiteSpace'
, /\s+/
)
tokenPatterns.push(whiteSpacePattern)

export const andPattern = createTokenPatternFromRegExp<And>(
  'And'
, /and/
)
tokenPatterns.push(andPattern)

export const orPattern = createTokenPatternFromRegExp<Or>(
  'Or'
, /or/
)
tokenPatterns.push(orPattern)

export const notPattern = createTokenPatternFromRegExp<Not>(
  'Not'
, /not/
)
tokenPatterns.push(notPattern)

export const xorPattern = createTokenPatternFromRegExp<Xor>(
  'Xor'
, /xor/
)
tokenPatterns.push(xorPattern)

export const leftParenthesisPattern = createTokenPatternFromRegExp<LeftParenthesis>(
  'LeftParenthesis'
, /\(/
)
tokenPatterns.push(leftParenthesisPattern)

export const rightParenthesisPattern = createTokenPatternFromRegExp<RightParenthesis>(
  'RightParenthesis'
, /\)/
)
tokenPatterns.push(rightParenthesisPattern)

export const identifierPattern = createTokenPatternFromRegExp<Identifier>(
  'Identifier'
, /[a-zA-Z0-9_-]+/
)
tokenPatterns.push(identifierPattern)
