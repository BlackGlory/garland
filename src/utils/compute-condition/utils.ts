import { IToken, INode, INodePattern, INodePatternMatch } from 'extra-parser'
import { Falsy, isntFalsy } from '@blackglory/prelude'
import { findAllIndexes } from 'iterable-operator'

export interface IValueExpression<
  NodeType extends string
, Value
> extends INode<NodeType> {
  value: Value
}

export interface IUnaryOperatorExpression<
  NodeType extends string
, Right extends INode<string>
> extends INode<NodeType> {
  right: Right
}

export interface IBinaryOperatorExpression<
  NodeType extends string
, Left extends INode<string>
, Right extends INode<string>
> extends INode<NodeType> {
  left: Left
  right: Right
}

export interface IContext<Token extends IToken<string>> {
  excludePatterns: Array<INodePattern<Token, INode<string>>>
}

export interface INodePatternWithContext<
  Token extends IToken<string>
, Node extends INode<string>
> extends INodePattern<Token, Node> {
  (tokens: Token[], context?: IContext<Token>): INodePatternMatch<Node> | Falsy
}

export function createValueOperatorExpressionPattern<
  Token extends IToken<string>
, Node extends IValueExpression<string, Value>
, Value
>({ tokenType, nodeType, transform }: {
  tokenType: string
  nodeType: Node['type']
  transform: (value: string) => Value
}): INodePatternWithContext<Token, IValueExpression<Node['type'], Node['value']>> {
  return tokens => {
    const [firstToken] = tokens
    if (firstToken?.type === tokenType) {
      return {
        consumed: 1
      , node: {
          type: nodeType
        , value: transform(firstToken.value)
        }
      }
    }
  }
}

export function createGroupedOperatorExpressionPattern<
  Token extends IToken<string>
, Node extends INode<string>
>({ leftTokenType, rightTokenType, nodePattern }: {
  leftTokenType: string
  rightTokenType: string
  nodePattern: INodePatternWithContext<Token, Node>
}): INodePatternWithContext<Token, Node> {
  return tokens => {
    const [firstToken, ...restTokens] = tokens
    if (firstToken?.type === leftTokenType) {
      const result = nodePattern(restTokens, createEmptyContext())
      if (isntFalsy(result) && tokens[result.consumed + 1]?.type === rightTokenType) {
        return {
          consumed: 1 + result.consumed + 1
        , node: result.node
        }
      }
    }
  }
}

export function createUnaryOperatorExpressionPattern<
  Token extends IToken<string>
, Node extends IUnaryOperatorExpression<string, Right>
, Right extends INode<string>
>({ tokenType, nodeType, rightNodePattern }: {
  tokenType: string
  nodeType: Node['type']
  rightNodePattern: INodePatternWithContext<Token, Right>
}): INodePatternWithContext<Token, IUnaryOperatorExpression<Node['type'], Node['right']>> {
  return tokens => {
    const [firstToken, ...restTokens] = tokens
    if (firstToken?.type === tokenType) {
      const rightValue = rightNodePattern(restTokens, createEmptyContext())
      if (isntFalsy(rightValue)) {
        return {
          consumed: 1 + rightValue.consumed
        , node: {
            type: nodeType
          , right: rightValue.node
          }
        }
      }
    }
  }
}

export function createBinaryOperatorExpressionPattern<
  Token extends IToken<string>
, Node extends IBinaryOperatorExpression<string, Left, Right>
, Left extends INode<string>
, Right extends INode<string>
>({ tokenType, nodeType, rightNodePattern, leftNodePattern }: {
  tokenType: string
  nodeType: Node['type']
  leftNodePattern: INodePatternWithContext<Token, Left>
  rightNodePattern: INodePatternWithContext<Token, Right>
}): INodePatternWithContext<
  Token
, IBinaryOperatorExpression<Node['type'], Node['left'], Node['right']>
> {
  return function nodePattern(
    tokens: Token[]
  , context: IContext<Token> = createEmptyContext()
  ): INodePatternMatch<
    IBinaryOperatorExpression<Node['type'], Node['left'], Node['right']>
  > | Falsy {
    for (const indexOfToken of findAllIndexes(tokens, x => x.type === tokenType)) {
      const leftTokens = tokens.slice(0, indexOfToken)
      const leftValue = leftNodePattern(leftTokens, {
        ...context
      , excludePatterns: [...context.excludePatterns, nodePattern]
      })
      if (isntFalsy(leftValue) && leftValue.consumed === indexOfToken) {
        const rightTokens = tokens.slice(leftValue.consumed + 1)
        const rightValue = rightNodePattern(rightTokens, createEmptyContext())
        if (isntFalsy(rightValue)) {
          return {
            consumed: leftValue.consumed + 1 + rightValue.consumed
          , node: {
              type: nodeType
            , left: leftValue.node
            , right: rightValue.node
            }
          }
        }
      }
    }
  }
}

export function createCompositePattern<
  Token extends IToken<string>
, Node extends INode<string>
>(
  nodePatterns: Array<INodePatternWithContext<Token, Node>>
): INodePatternWithContext<Token, Node> {
  return (
    tokens
  , context: IContext<Token> = createEmptyContext()
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
}

export function createEmptyContext<Token extends IToken<string>>(): IContext<Token> {
  return { excludePatterns: [] }
}
