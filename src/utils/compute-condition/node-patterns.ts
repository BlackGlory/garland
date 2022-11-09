import { INode, INodePattern, INodePatternMatch } from 'extra-parser'
import { Falsy, isntFalsy } from '@blackglory/prelude'
import { pipe } from 'extra-utils'
import { map, filter } from 'iterable-operator'
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

const parseOrExpression: INodePatternWithContext<IOrExpression> = (
  tokens
, context: IContext = { excludePatterns: [] }
) => {
  for (const indexOfOrToken of findAllIndexes(tokens, x => x.type === 'Or')) {
    const leftTokens = tokens.slice(0, indexOfOrToken)
    for (const leftValue of parseNodes(leftTokens, {
      ...context
    , excludePatterns: [...context.excludePatterns, parseOrExpression]
    })) {
      if (leftValue.consumed === indexOfOrToken) {
        const rightTokens = tokens.slice(leftValue.consumed + 1)
        for (const rightValue of parseNodes(rightTokens, { excludePatterns: [] })) {
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
  for (const indexOfXorToken of findAllIndexes(tokens, x => x.type === 'Xor')) {
    const leftTokens = tokens.slice(0, indexOfXorToken)
    for (const leftValue of parseNodes(leftTokens, {
      ...context
    , excludePatterns: [...context.excludePatterns, parseXorExpression]
    })) {
      if (leftValue.consumed === indexOfXorToken) {
        const restTokens = tokens.slice(leftValue.consumed + 1)
        for (const rightValue of parseNodes(restTokens, { excludePatterns: [] })) {
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
  for (const indexOfAndToken of findAllIndexes(tokens, x => x.type === 'And')) {
    const leftTokens = tokens.slice(0, indexOfAndToken)
    for (const leftValue of parseNodes(leftTokens, {
      ...context
    , excludePatterns: [...context.excludePatterns, parseAndExpression]
    })) {
      if (leftValue.consumed === indexOfAndToken) {
        const rightTokens = tokens.slice(leftValue.consumed + 1)
        for (const rightValue of parseNodes(rightTokens, { excludePatterns: [] })) {
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
    for (const rightValue of parseNodes(restTokens, { excludePatterns: [] })) {
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
    for (const value of parseNodes(restTokens, { excludePatterns: [] })) {
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

// 模式解析的顺序将决定运算符的优先级, 这与运算符的优先级顺序相反:
// 运算符的优先级越低, 它在AST里的位置距离根节点就越近.
// 节点离根节点越近, 意味着其解析的时间点越早, 因此模式解析的优先级就越高.
export const nodePatterns: Array<INodePatternWithContext<Node>> = [
  parseOrExpression
, parseXorExpression
, parseAndExpression
, parseNotExpression
, parseParenthesisExpression
, parseIdentifier
]

function* parseNodes(
  tokens: Token[]
, context: IContext = { excludePatterns: [] }
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

function findAllIndexes<T>(
  iter: Iterable<T>
, predicate: (value: T, index: number) => boolean
): IterableIterator<number> {
  return pipe(
    iter
  , iter => map(iter, (x, i) => [x, i] as const)
  , iter => filter(iter, ([x, i]) => predicate(x, i))
  , iter => map(iter, ([x, i]) => i)
  )
}
