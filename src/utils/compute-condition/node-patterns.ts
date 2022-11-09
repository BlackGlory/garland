import { Token } from './tokens'
import {
  Node
, IdentifierExpression
, OrExpression
, XorExpression
, AndExpression
, NotExpression
} from './nodes'
import {
  createValueOperatorExpressionPattern
, createGroupedOperatorExpressionPattern
, createUnaryOperatorExpressionPattern
, createBinaryOperatorExpressionPattern
, createCompositePattern
, INodePatternWithContext
} from './utils'

// 模式解析的顺序将决定运算符的优先级, 这与运算符的优先级顺序相反:
// 运算符的优先级越低, 它在AST里的位置距离根节点就越近.
// 节点离根节点越近, 意味着其解析的时间点越早, 因此模式解析的优先级就越高.
export const nodePatterns: Array<INodePatternWithContext<Token, Node>> = []

const parseNode = createCompositePattern(nodePatterns)

const parseOrExpression = createBinaryOperatorExpressionPattern<
  Token
, OrExpression
, Node
, Node
>({
  tokenType: 'Or'
, nodeType: 'OrExpression'
, parseLeftNode: parseNode
, parseRightNode: parseNode
})
nodePatterns.push(parseOrExpression)

const parseXorExpression = createBinaryOperatorExpressionPattern<
  Token
, XorExpression
, Node
, Node
>({
  tokenType: 'Xor'
, nodeType: 'XorExpression'
, parseLeftNode: parseNode
, parseRightNode: parseNode
})
nodePatterns.push(parseXorExpression)

const parseAndExpression = createBinaryOperatorExpressionPattern<
  Token
, AndExpression
, Node
, Node
>({
  tokenType: 'And'
, nodeType: 'AndExpression'
, parseLeftNode: parseNode
, parseRightNode: parseNode
})
nodePatterns.push(parseAndExpression)

const parseNotExpression = createUnaryOperatorExpressionPattern<
  Token
, NotExpression
, Node
>({
  tokenType: 'Not'
, nodeType: 'NotExpression'
, parseRightNode: parseNode
})
nodePatterns.push(parseNotExpression)

const parseParenthesisExpression = createGroupedOperatorExpressionPattern<Token, Node>({
  leftTokenType: 'LeftParenthesis'
, rightTokenType: 'RightParenthesis'
, parseNode
})
nodePatterns.push(parseParenthesisExpression)

const parseIdentifierExpression = createValueOperatorExpressionPattern<
  Token
, IdentifierExpression
, string
>({
  tokenType: 'Identifier'
, nodeType: 'IdentifierExpression'
, transform: x => x
})
nodePatterns.push(parseIdentifierExpression)
