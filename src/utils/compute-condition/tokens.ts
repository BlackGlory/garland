import { IToken } from 'extra-parser'

export type Token =
| IdentifierToken
| AndToken
| OrToken
| NotToken
| XorToken
| WhiteSpaceToken
| LeftParenthesisToken
| RightParenthesisToken

export interface IdentifierToken extends IToken {
  tokenType: 'Identifier'
}

export interface AndToken extends IToken {
  tokenType: 'And'
}

export interface OrToken extends IToken {
  tokenType: 'Or'
}

export interface NotToken extends IToken {
  tokenType: 'Not'
}

export interface XorToken extends IToken {
  tokenType: 'Xor'
}

export interface WhiteSpaceToken extends IToken {
  tokenType: 'WhiteSpace'
}

export interface LeftParenthesisToken extends IToken {
  tokenType: 'LeftParenthesis'
}

export interface RightParenthesisToken extends IToken {
  tokenType: 'RightParenthesis'
}
