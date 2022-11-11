import {
  IUnaryOperatorExpression
, IBinaryOperatorExpression
, IValueExpression
} from './utils'

export type Node =
| IdentifierExpression
| OrExpression
| XorExpression
| AndExpression
| NotExpression

export type IdentifierExpression = IValueExpression<'IdentifierExpression', string>
export type OrExpression = IBinaryOperatorExpression<'OrExpression', Node, Node>
export type XorExpression = IBinaryOperatorExpression<'XorExpression', Node, Node>
export type AndExpression = IBinaryOperatorExpression<'AndExpression', Node, Node>
export type NotExpression = IUnaryOperatorExpression<'NotExpression', Node>
