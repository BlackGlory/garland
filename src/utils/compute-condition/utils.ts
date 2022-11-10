import { IToken, INode, INodePattern, INodePatternMatch } from 'extra-parser'
import { Falsy, isntFalsy } from '@blackglory/prelude'
import { toArray, findAllIndexes } from 'iterable-operator'

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

export function createValueOperatorExpressionPattern<
  Token extends IToken<string>
, Node extends IValueExpression<string, Value>
, Value
>({ tokenType, nodeType, transform }: {
  tokenType: string
  nodeType: Node['type']
  transform: (value: string) => Value
}): INodePattern<Token, IValueExpression<Node['type'], Node['value']>> {
  return tokens => {
    const mutableTokens = toArray(tokens)

    const token = consumeToken(mutableTokens, tokenType)
    if (isntFalsy(token)) {
      return {
        consumed: 1
      , node: {
          type: nodeType
        , value: transform(token.value)
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
  nodePattern: INodePattern<Token, Node>
}): INodePattern<Token, Node> {
  return tokens => {
    const mutableTokens = toArray(tokens)

    const leftToken = consumeToken(mutableTokens, leftTokenType)
    if (isntFalsy(leftToken)) {
      const result = consumeNode<Token, Node>(mutableTokens, nodePattern)
      if (isntFalsy(result)) {
        const rightToken = consumeToken(mutableTokens, rightTokenType)
        if (isntFalsy(rightToken)) {
          return {
            consumed: 1 + result.consumed + 1
          , node: result.node
          }
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
  rightNodePattern: INodePattern<Token, Right>
}): INodePattern<
  Token
, IUnaryOperatorExpression<Node['type'], Node['right']>
> {
  return tokens => {
    const mutableTokens = toArray(tokens)

    const leftToken = consumeToken(mutableTokens, tokenType)
    if (isntFalsy(leftToken)) {
      const rightValue = consumeNode<Token, Right>(mutableTokens, rightNodePattern)
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
  leftNodePattern: INodePattern<Token, Left>
  rightNodePattern: INodePattern<Token, Right>
}): INodePattern<
  Token
, IBinaryOperatorExpression<Node['type'], Node['left'], Node['right']>
> {
  return tokens => {
    for (const indexOfToken of findAllIndexes(tokens, x => x.type === tokenType)) {
      const leftTokens = tokens.slice(0, indexOfToken)
      const leftValue = consumeNode<Token, Left>(leftTokens, leftNodePattern)
      if (isntFalsy(leftValue) && leftValue.consumed === indexOfToken) {
        const rightTokens = tokens.slice(indexOfToken + 1)

        const rightValue = consumeNode<Token, Right>(rightTokens, rightNodePattern)
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
  nodePatterns: Array<INodePattern<Token, Node>>
): INodePattern<Token, Node> {
  return tokens => {
    for (const pattern of nodePatterns) {
      const result = pattern(tokens)
      if (isntFalsy(result)) {
        return result
      }
    }
  }
}

/**
 * 尝试匹配token, 如果成功, 则消耗掉相应的token.
 * 
 * @param tokens 匹配成功时会发生原地修改
 */
function consumeToken<T extends IToken<string>>(
  tokens: Array<IToken<string>>
, tokenType: string
): T | Falsy {
  const firstToken: IToken<string> | undefined = tokens[0]
  
  if (firstToken && firstToken.type === tokenType) {
    tokens.shift()
    return firstToken as T
  }
}

/**
 * 
 * 尝试匹配node, 如果成功, 则消耗掉相应的token.
 * 
 * @param tokens 匹配成功时会发生原地修改
 */
function consumeNode<
  Token extends IToken<string>
, Node extends INode<string>
, NodePattern extends INodePattern<Token, Node> = INodePattern<Token, Node>
>(
  tokens: Token[]
, nodePattern: NodePattern
): INodePatternMatch<Node> | Falsy {
  const result = nodePattern(tokens)

  if (isntFalsy(result)) {
    tokens.splice(0, result.consumed)
    return result
  }
}
