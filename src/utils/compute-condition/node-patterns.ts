import { INodePatternMatch, IToken } from 'extra-parser'
import { Falsy, isntFalsy } from '@blackglory/prelude'
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
, INodePatternWithContext
, IContext
} from './utils'

const parseNode: INodePatternWithContext<Token, Node> = (
  tokens: Token[]
, context: IContext<Token> = { excludePatterns: [] }
): INodePatternMatch<Node> | Falsy => {
  for (const pattern of nodePatterns) {
    if (!context.excludePatterns.includes(pattern)) {
      const result = pattern(tokens, context)
      if (isntFalsy(result)) {
        return result
      }
    }
  }
}

const parseIdentifierExpression = createValueOperatorExpressionPattern<
  Token
, IdentifierExpression
, string
>({
  tokenType: 'Identifier'
, nodeType: 'IdentifierExpression'
, transform: x => x
})

const parseParenthesisExpression = createGroupedOperatorExpressionPattern<Token, Node>({
  leftTokenType: 'LeftParenthesis'
, rightTokenType: 'RightParenthesis'
, parseNode
})

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

const parseNotExpression = createUnaryOperatorExpressionPattern<
  Token
, NotExpression
, Node
>({
  tokenType: 'Not'
, nodeType: 'NotExpression'
, parseRightNode: parseNode
})

// 模式解析的顺序将决定运算符的优先级, 这与运算符的优先级顺序相反:
// 运算符的优先级越低, 它在AST里的位置距离根节点就越近.
// 节点离根节点越近, 意味着其解析的时间点越早, 因此模式解析的优先级就越高.
export const nodePatterns: Array<INodePatternWithContext<Token, Node>> = [
  parseOrExpression
, parseXorExpression
, parseAndExpression
, parseNotExpression
, parseParenthesisExpression
, parseIdentifierExpression
]
