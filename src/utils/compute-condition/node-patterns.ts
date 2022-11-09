import { INode, INodePattern, INodePatternMatch } from 'extra-parser'
import { Falsy, isntFalsy } from '@blackglory/prelude'
import { Token } from './tokens'
import {
  Node
, IIdentifier
, IOrExpression
, IXorExpression
, IAndExpression
, INotExpression
} from './nodes'

interface IContext {
  excludePatterns: Array<INodePattern<Token, Node>>
}

interface INodePatternWithContext<
  Node extends INode<string>
> extends INodePattern<Token, Node> {
  (tokens: Token[], context?: IContext): INodePatternMatch<Node> | Falsy
}

function* parseNodes(
  tokens: Token[]
, context: IContext
): IterableIterator<INodePatternMatch<Node>> {
  for (const pattern of nodePatterns) {
    if (!context.excludePatterns.includes(pattern)) {
      const result = pattern(tokens, context)
      if (isntFalsy(result)) {
        yield result
      }
    }
  }
}

const parseOrExpression: INodePatternWithContext<IOrExpression> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  for (const leftValue of parseNodes(tokens, {
    ...context
  , excludePatterns: [...context.excludePatterns, parseOrExpression]
  })) {
    if (isntFalsy(leftValue)) {
      if (tokens[leftValue.consumed]?.type === 'Or') {
        const restTokens = tokens.slice(leftValue.consumed + 1)
        for (const rightValue of parseNodes(restTokens, {
          excludePatterns: []
        })) {
          return {
            consumed: leftValue.consumed + 1 + rightValue.consumed
          , node: {
              type: 'OrExpression'
            , left: leftValue.node
            , right: rightValue.node
            }
          }
        }
      }
    }
  }
}

const parseXorExpression: INodePatternWithContext<IXorExpression> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  for (const leftValue of parseNodes(tokens, {
    ...context
  , excludePatterns: [...context.excludePatterns, parseXorExpression]
  })) {
    if (isntFalsy(leftValue)) {
      if (tokens[leftValue.consumed]?.type === 'Xor') {
        const restTokens = tokens.slice(leftValue.consumed + 1)
        for (const rightValue of parseNodes(restTokens, {
          excludePatterns: []
        })) {
          return {
            consumed: leftValue.consumed + 1 + rightValue.consumed
          , node: {
              type: 'XorExpression'
            , left: leftValue.node
            , right: rightValue.node
            }
          }
        }
      }
    }
  }
}

const parseAndExpression: INodePatternWithContext<IAndExpression> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  for (const leftValue of parseNodes(tokens, {
    ...context
  , excludePatterns: [...context.excludePatterns, parseAndExpression]
  })) {
    if (isntFalsy(leftValue)) {
      if (tokens[leftValue.consumed]?.type === 'And') {
        const restTokens = tokens.slice(leftValue.consumed + 1)
        for (const rightValue of parseNodes(restTokens, {
          excludePatterns: []
        })) {
          return {
            consumed: leftValue.consumed + 1 + rightValue.consumed
          , node: {
              type: 'AndExpression'
            , left: leftValue.node
            , right: rightValue.node
            }
          }
        }
      }
    }
  }
}

const parseNotExpression: INodePatternWithContext<INotExpression> = tokens => {
  const [firstToken, ...restTokens] = tokens
  if (firstToken?.type === 'Not') {
    for (const rightValue of parseNodes(restTokens, {
      excludePatterns: []
    })) {
      return {
        consumed: 1 + rightValue.consumed
      , node: {
          type: 'NotExpression'
        , right: rightValue.node
        }
      }
    }
  }
}

const parseParenthesisExpression: INodePatternWithContext<Node> = tokens => {
  const [firstToken, ...restTokens] = tokens
  if (firstToken?.type === 'LeftParenthesis') {
    for (const value of parseNodes(restTokens, {
      excludePatterns: []
    })) {
      if (tokens[value.consumed + 1]?.type === 'RightParenthesis') {
        return {
          consumed: 1 + value.consumed + 1
        , node: value.node
        }
      }
    }
  }
}

const parseIdentifier: INodePatternWithContext<IIdentifier> = tokens => {
  const [firstToken] = tokens
  if (firstToken?.type === 'Identifier') {
    return {
      consumed: 1
    , node: {
        type: 'Identifier'
      , value: firstToken.value
      }
    }
  }
}

// 模式解析的顺序将决定运算符的优先级
export const nodePatterns: Array<INodePatternWithContext<Node>> = [
  parseNotExpression
, parseAndExpression
, parseXorExpression
, parseOrExpression
, parseParenthesisExpression
, parseIdentifier
]
