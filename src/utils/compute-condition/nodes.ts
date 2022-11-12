import {
  IValueExpressionNode
, IBinaryOperatorExpressionNode
, IUnaryOperatorExpressionNode
} from 'extra-parser'

export type Node =
| IdentifierExpressionNode
| OrExpressionNode
| XorExpressionNode
| AndExpressionNode
| NotExpressionNode

export type IdentifierExpressionNode = IValueExpressionNode<'IdentifierExpression', string>
export type OrExpressionNode = IBinaryOperatorExpressionNode<'OrExpression', Node, Node>
export type XorExpressionNode = IBinaryOperatorExpressionNode<'XorExpression', Node, Node>
export type AndExpressionNode = IBinaryOperatorExpressionNode<'AndExpression', Node, Node>
export type NotExpressionNode = IUnaryOperatorExpressionNode<'NotExpression', Node>
