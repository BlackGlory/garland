import {
  INodePattern
, createBinaryOperatorExpressionNodePattern
, createUnaryOperatorExpressionNodePattern
, createGroupedExpressionNodePattern
, createValueExpressionNodePattern
, matchAnyOf
} from 'extra-parser'
import { Token } from './tokens'
import {
  Node
, IdentifierExpressionNode
, OrExpressionNode
, XorExpressionNode
, AndExpressionNode
, NotExpressionNode
} from './nodes'

// 模式解析的顺序将决定运算符的优先级, 这与运算符的优先级顺序相反:
// 运算符的优先级越低, 它在AST里的位置距离根节点就越近.
// 节点离根节点越近, 意味着其解析的时间点越早, 因此模式解析的优先级就越高.
export const nodePatterns: Array<INodePattern<Token, Node>> = []

const anyNodePattern: INodePattern<Token, Node> = tokens => matchAnyOf(
  nodePatterns
, tokens
)

const orExpressionPattern = createBinaryOperatorExpressionNodePattern<
  Token
, OrExpressionNode
, Node
, Node
>({
  nodeType: 'OrExpression'
, leftNodePattern: anyNodePattern
, centerTokenType: 'Or'
, rightNodePattern: anyNodePattern
})
nodePatterns.push(orExpressionPattern)

const xorExpressionPattern = createBinaryOperatorExpressionNodePattern<
  Token
, XorExpressionNode
, Node
, Node
>({
  nodeType: 'XorExpression'
, leftNodePattern: anyNodePattern
, centerTokenType: 'Xor'
, rightNodePattern: anyNodePattern
})
nodePatterns.push(xorExpressionPattern)

const andExpressionPattern = createBinaryOperatorExpressionNodePattern<
  Token
, AndExpressionNode
, Node
, Node
>({
  nodeType: 'AndExpression'
, leftNodePattern: anyNodePattern
, centerTokenType: 'And'
, rightNodePattern: anyNodePattern
})
nodePatterns.push(andExpressionPattern)

const notExpressionPattern = createUnaryOperatorExpressionNodePattern<
  Token
, NotExpressionNode
, Node
>({
  nodeType: 'NotExpression'
, leftTokenType: 'Not'
, rightNodePattern: anyNodePattern
})
nodePatterns.push(notExpressionPattern)

const parenthesisExpressionPattern = createGroupedExpressionNodePattern<Token, Node>({
  leftTokenType: 'LeftParenthesis'
, centerNodePattern: anyNodePattern
, rightTokenType: 'RightParenthesis'
})
nodePatterns.push(parenthesisExpressionPattern)

const identifierExpressionPattern = createValueExpressionNodePattern<
  Token
, IdentifierExpressionNode
, string
>({
  nodeType: 'IdentifierExpression'
, valueTokenType: 'Identifier'
, transformValue: x => x
})
nodePatterns.push(identifierExpressionPattern)
