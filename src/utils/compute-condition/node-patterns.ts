import { IToken, INodePattern, INodePatternMatch } from 'extra-parser'
import { Falsy, isntFalsy } from '@blackglory/prelude'
import { Node, INotExpression, IIdentifier } from './ast'

interface INodePatternWithExclude extends INodePattern<IToken<string>, Node> {
  (
    tokens: Array<IToken<string>>
  , excludePatterns?: Array<INodePattern<IToken<string>, Node>>
  ): INodePatternMatch<Node> | Falsy
}

const parseExpression = (
  tokens: Array<IToken<string>>
, excludePatterns: INodePatternWithExclude[]
): INodePatternMatch<Node> | Falsy => {
  for (const pattern of nodePatterns) {
    if (!excludePatterns.includes(pattern)) {
      const result = pattern(tokens, excludePatterns)
      if (isntFalsy(result)) {
        return result
      }
    }
  }
}

const parseOrExpression: INodePatternWithExclude = (
  tokens
, excludePatterns: Array<INodePattern<IToken<string>, Node>> = []
) => {
  const leftValue = parseExpression(tokens, [...excludePatterns, parseOrExpression])
  if (isntFalsy(leftValue)) {
    if (tokens[leftValue.consumed]?.type === 'Or') {
      const restTokens = tokens.slice(leftValue.consumed + 1)
      const rightValue = parseExpression(restTokens, [])
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

const parseXorExpression: INodePatternWithExclude = (
  tokens
, excludePatterns: Array<INodePattern<IToken<string>, Node>> = []
) => {
  const leftValue = parseExpression(tokens, [...excludePatterns, parseXorExpression])
  if (isntFalsy(leftValue)) {
    if (tokens[leftValue.consumed]?.type === 'Xor') {
      const restTokens = tokens.slice(leftValue.consumed + 1)
      const rightValue = parseExpression(restTokens, [])
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

const parseAndExpression: INodePatternWithExclude = (
  tokens
, excludePatterns: Array<INodePattern<IToken<string>, Node>> = []
) => {
  const leftValue = parseExpression(tokens, [...excludePatterns, parseAndExpression])
  if (isntFalsy(leftValue)) {
    if (tokens[leftValue.consumed]?.type === 'And') {
      const restTokens = tokens.slice(leftValue.consumed + 1)
      const rightValue = parseExpression(restTokens, [])
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

const parseNotExpression: INodePattern<
  IToken<string>
, INotExpression
> = tokens => {
  const [firstToken, ...restTokens] = tokens
  if (firstToken?.type === 'Not') {
    const result = parseExpression(restTokens, [])
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

const parseParenthesisExpression: INodePattern<
  IToken<string>
, Node
> = tokens => {
  const [firstToken, ...restTokens] = tokens
  if (firstToken?.type === 'LeftParenthesis') {
    const result = parseExpression(restTokens, [])
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

const parseIdentifier: INodePattern<IToken<string>, IIdentifier> = tokens => {
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
export const nodePatterns: INodePatternWithExclude[] = [
  parseParenthesisExpression
, parseNotExpression
, parseAndExpression
, parseXorExpression
, parseOrExpression
, parseIdentifier
]
