import { ITokenPattern, createTokenPatternFromRegExp } from 'extra-parser'
import {
  Token
, IdentifierToken
, AndToken
, OrToken
, NotToken
, XorToken
, WhiteSpaceToken
, LeftParenthesisToken
, RightParenthesisToken
} from './tokens.js'

export const tokenPatterns: Array<ITokenPattern<Token>> = []

export const whiteSpacePattern = createTokenPatternFromRegExp<WhiteSpaceToken>(
  'WhiteSpace'
, /\s+/
) as ITokenPattern<Token>
tokenPatterns.push(whiteSpacePattern)

export const andPattern = createTokenPatternFromRegExp<AndToken>(
  'And'
, /(?<![a-zA-Z0-9_-])and(?![a-zA-Z0-9_-])/
) as ITokenPattern<Token>
tokenPatterns.push(andPattern)

export const orPattern = createTokenPatternFromRegExp<OrToken>(
  'Or'
, /(?<![a-zA-Z0-9_-])or(?![a-zA-Z0-9_-])/
) as ITokenPattern<Token>
tokenPatterns.push(orPattern)

export const notPattern = createTokenPatternFromRegExp<NotToken>(
  'Not'
, /(?<![a-zA-Z0-9_-])not(?![a-zA-Z0-9_-])/
) as ITokenPattern<Token>
tokenPatterns.push(notPattern)

export const xorPattern = createTokenPatternFromRegExp<XorToken>(
  'Xor'
, /(?<![a-zA-Z0-9_-])xor(?![a-zA-Z0-9_-])/
) as ITokenPattern<Token>
tokenPatterns.push(xorPattern)

export const leftParenthesisPattern = createTokenPatternFromRegExp<LeftParenthesisToken>(
  'LeftParenthesis'
, /\(/
) as ITokenPattern<Token>
tokenPatterns.push(leftParenthesisPattern)

export const rightParenthesisPattern = createTokenPatternFromRegExp<RightParenthesisToken>(
  'RightParenthesis'
, /\)/
) as ITokenPattern<Token>
tokenPatterns.push(rightParenthesisPattern)

export const identifierPattern = createTokenPatternFromRegExp<IdentifierToken>(
  'Identifier'
, /[a-zA-Z0-9_-]+/
) as ITokenPattern<Token>
tokenPatterns.push(identifierPattern)
