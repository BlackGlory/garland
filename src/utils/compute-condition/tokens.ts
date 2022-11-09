import { IToken } from 'extra-parser'

export type Token =
| Identifier
| And
| Or
| Not
| Xor
| WhiteSpace
| LeftParenthesis
| RightParenthesis

export type Identifier = IToken<'Identifier'>
export type And = IToken<'And'>
export type Or = IToken<'Or'>
export type Not = IToken<'Not'>
export type Xor = IToken<'Xor'>
export type WhiteSpace = IToken<'WhiteSpace'>
export type LeftParenthesis = IToken<'LeftParenthesis'>
export type RightParenthesis = IToken<'RightParenthesis'>
