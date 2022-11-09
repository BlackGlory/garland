import { IToken, INode, INodePattern, INodePatternMatch } from 'extra-parser'
import { Falsy, isntFalsy } from '@blackglory/prelude'
import { Node, IOrExpression, INotExpression, IIdentifier, IAndExpression, IXorExpression } from './nodes'

interface IContext {
  excludePatterns: Array<INodePattern<IToken<string>, Node>>
}

interface INodePatternWithContext<
  Node extends INode<string>
> extends INodePattern<IToken<string>, Node> {
  (
    tokens: Array<IToken<string>>
  , context?: IContext
  ): INodePatternMatch<Node> | Falsy
}

const parseNode: INodePatternWithContext<Node> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  for (const pattern of nodePatterns) {
    if (!context.excludePatterns.includes(pattern)) {
      const result = pattern(tokens, context)
      if (isntFalsy(result)) {
        return result
      }
    }
  }
}

const parseOrExpression: INodePatternWithContext<IOrExpression> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  const leftValue = parseNode(tokens, {
    ...context
  , excludePatterns: [...context.excludePatterns, parseOrExpression]
  })
  if (isntFalsy(leftValue)) {
    if (tokens[leftValue.consumed]?.type === 'Or') {
      const restTokens = tokens.slice(leftValue.consumed + 1)
      const rightValue = parseNode(restTokens, {
        excludePatterns: []
      })
      if (isntFalsy(rightValue)) {
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

const parseXorExpression: INodePatternWithContext<IXorExpression> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  const leftValue = parseNode(tokens, {
    ...context
  , excludePatterns: [...context.excludePatterns, parseXorExpression]
  })
  if (isntFalsy(leftValue)) {
    if (tokens[leftValue.consumed]?.type === 'Xor') {
      const restTokens = tokens.slice(leftValue.consumed + 1)
      const rightValue = parseNode(restTokens, {
        excludePatterns: []
      })
      if (isntFalsy(rightValue)) {
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

const parseAndExpression: INodePatternWithContext<IAndExpression> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  const leftValue = parseNode(tokens, {
    ...context
  , excludePatterns: [...context.excludePatterns, parseAndExpression]
  })
  if (isntFalsy(leftValue)) {
    if (tokens[leftValue.consumed]?.type === 'And') {
      const restTokens = tokens.slice(leftValue.consumed + 1)
      const rightValue = parseNode(restTokens, {
        excludePatterns: []
      })
      if (isntFalsy(rightValue)) {
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

const parseNotExpression: INodePatternWithContext<INotExpression> = tokens => {
  const [firstToken, ...restTokens] = tokens
  if (firstToken?.type === 'Not') {
    const result = parseNode(restTokens, {
      excludePatterns: []
    })
    if (isntFalsy(result)) {
      return {
        consumed: 1 + result.consumed
      , node: {
          type: 'NotExpression'
        , right: result.node
        }
      }
    }
  }
}

const parseParenthesisExpression: INodePatternWithContext<Node> = tokens => {
  const [firstToken, ...restTokens] = tokens
  if (firstToken?.type === 'LeftParenthesis') {
    const result = parseNode(restTokens, {
      excludePatterns: []
    })
    if (isntFalsy(result)) {
      if (tokens[result.consumed + 1]?.type === 'RightParenthesis') {
        return {
          consumed: 1 + result.consumed + 1
        , node: result.node
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
  parseParenthesisExpression
, parseNotExpression
, parseAndExpression
, parseXorExpression
, parseOrExpression
, parseIdentifier
]
