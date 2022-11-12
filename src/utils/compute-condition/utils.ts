import { IToken, INode, INodePattern, INodePatternMatch } from 'extra-parser'
import {
  Falsy
, isntFalsy
, isString
, isFunction
, isObject
, NonEmptyArray
} from '@blackglory/prelude'
import { toArray, findAllIndexes } from 'iterable-operator'

export interface IValueExpression<NodeType extends string, Value> extends INode {
  nodeType: NodeType
  value: Value
}

export interface IUnaryOperatorExpression<
  NodeType extends string
, Right extends INode
> extends INode {
  nodeType: NodeType
  right: Right
}

export interface IBinaryOperatorExpression<
  NodeType extends string
, Left extends INode
, Right extends INode
> extends INode {
  nodeType: NodeType
  left: Left
  right: Right
}

export function createValueOperatorExpressionPattern<
  Token extends IToken
, Node extends IValueExpression<string, Value>
, Value
>({ tokenType, nodeType, transform }: {
  tokenType: string
  nodeType: Node['nodeType']
  transform: (value: string) => Value
}): INodePattern<Token, IValueExpression<Node['nodeType'], Node['value']>> {
  return tokens => {
    const mutableTokens = toArray(tokens)

    const token = consumeToken(mutableTokens, tokenType)
    if (isntFalsy(token)) {
      return {
        consumed: 1
      , node: {
          nodeType
        , value: transform(token.value)
        }
      }
    }
  }
}

export function createGroupedOperatorExpressionPattern<
  Token extends IToken
, Node extends INode
>({ leftTokenType, rightTokenType, nodePattern }: {
  leftTokenType: string
  rightTokenType: string
  nodePattern: INodePattern<Token, Node>
}): INodePattern<Token, Node> {
  return async tokens => {
    const matches = await matchSequence<[IToken, INode, IToken]>(
      tokens
    , [
        leftTokenType
      , nodePattern as INodePattern<IToken, Node>
      , rightTokenType
      ]
    )
    if (isntFalsy(matches)) {
      const [leftToken, nodeMatch, rightToken] = matches
      return {
        consumed: 1 + nodeMatch.consumed + 1
      , node: nodeMatch.node as Node
      }
    }
  }
}

export function createUnaryOperatorExpressionPattern<
  Token extends IToken
, Node extends IUnaryOperatorExpression<string, Right>
, Right extends INode
>({ tokenType, nodeType, rightNodePattern }: {
  tokenType: string
  nodeType: Node['nodeType']
  rightNodePattern: INodePattern<Token, Right>
}): INodePattern<
  Token
, IUnaryOperatorExpression<Node['nodeType'], Node['right']>
> {
  return async tokens => {
    const matches = await matchSequence<[IToken, INode]>(tokens, [
      tokenType
    , rightNodePattern as INodePattern<IToken, Right>
    ])
    if (isntFalsy(matches)) {
      const [leftToken, rightMatch] = matches
      return {
        consumed: 1 + rightMatch.consumed
      , node: {
          nodeType
        , right: rightMatch.node as Right
        }
      }
    }
  }
}

export function createBinaryOperatorExpressionPattern<
  Token extends IToken
, Node extends IBinaryOperatorExpression<string, Left, Right>
, Left extends INode
, Right extends INode
>({ tokenType, nodeType, rightNodePattern, leftNodePattern }: {
  tokenType: string
  nodeType: Node['nodeType']
  leftNodePattern: INodePattern<Token, Left>
  rightNodePattern: INodePattern<Token, Right>
}): INodePattern<
  Token
, IBinaryOperatorExpression<Node['nodeType'], Node['left'], Node['right']>
> {
  return async tokens => {
    const matches = await matchSequence<[INode, IToken, INode]>(
      tokens
    , [
        leftNodePattern as INodePattern<IToken, Left>
      , tokenType
      , rightNodePattern as INodePattern<IToken, Right>
      ]
    )
    if (isntFalsy(matches)) {
      const [leftMatch, token, rightMatch] = matches
      return {
        consumed: leftMatch.consumed + 1 + rightMatch.consumed
      , node: {
          nodeType
        , left: leftMatch.node as Node['left']
        , right: rightMatch.node as Node['right']
        }
      }
    }
  }
}

export function createCompositePattern<
  Token extends IToken = IToken
, Node extends INode = INode
>(
  nodePatterns: ReadonlyArray<INodePattern<Token, Node>>
): INodePattern<Token, Node> {
  return async tokens => {
    for (const pattern of nodePatterns) {
      const match = await pattern(tokens)
      if (isntFalsy(match)) {
        return match
      }
    }
  }
}

type MapSequenceToPatterns<
  Sequence extends ReadonlyArray<IToken | INode>
> = {
  [Index in keyof Sequence]:
    [Sequence[Index]] extends [infer Element]
  ? (
      Element extends IToken
      ? string
    : Element extends INode
      ? INodePattern<IToken, Element>
    : never
    )
  : never
}

type MapSequenceToMatches<
  Sequence extends ReadonlyArray<IToken | INode>
> = {
  [Index in keyof Sequence]:
    [Sequence[Index]] extends [infer Element]
  ? (
      Element extends IToken
      ? IToken
    : Element extends INode
      ? INodePatternMatch<Element>
    : never
    )
  : never
}

/**
 * 模式将被拆分为以下子模式来处理:
 * - `[TokenType, ...TokenType[]]`
 * - `[NodePattern, ...NodePattern[]]`:
 *   根据NodePattern的定义, 这种子模式有可能陷入死循环.
 * - `[NodePattern, TokenType]`:
 *    这种子模式适用于二元或三元运算符这样的规则.
 *    在引擎盖下, 它首先匹配TokenType以防止NodePattern在匹配时陷入死循环.
 */
async function matchSequence<
  Sequence extends ReadonlyArray<IToken | INode>
>(
  tokens: ReadonlyArray<IToken>
, patterns: MapSequenceToPatterns<Sequence>
): Promise<MapSequenceToMatches<Sequence> | Falsy> {
  if (isTokenTypes(patterns)) {
    const matches: Array<IToken> = []

    const mutableTokens = toArray(tokens)
    for (const pattern of patterns) {
      const match = consumeToken(mutableTokens, pattern)
      if (isntFalsy(match)) {
        matches.push(match)
      } else {
        return
      }
    }

    return matches as MapSequenceToMatches<Sequence>
  } else if (isNodePatterns(patterns)) {
    const matches: Array<INodePatternMatch<INode>> = []

    const mutableTokens = toArray(tokens)
    for (const pattern of patterns) {
      const match = await consumeNode(mutableTokens, pattern)
      if (isntFalsy(match)) {
        matches.push(match)
      } else {
        return
      }
    }

    return matches as MapSequenceToMatches<Sequence>
  } else if (isNodePatternNodeType(patterns)) {
    const [nodePattern, tokenType] = patterns

    for (const indexOfToken of findAllIndexes(tokens, x => x.tokenType === tokenType)) {
      const leftTokens = tokens.slice(0, indexOfToken)
      const leftMatch = await nodePattern(leftTokens)
      if (
        isntFalsy(leftMatch) &&
        leftMatch.consumed === indexOfToken
      ) {
        const matches: [INodePatternMatch<INode>, IToken] = [
          leftMatch
        , tokens[indexOfToken]
        ]
        return matches as MapSequenceToMatches<Sequence>
      }
    }
  } else {
    const matches: Array<INodePatternMatch<INode> | IToken> = []
    const remainingTokens = toArray(tokens)
    for (const subPatterns of splitPatterns(patterns)) {
      const subMatches = await matchSequence<Array<IToken | INode>>(
        remainingTokens
      , subPatterns
      )
      if (isntFalsy(subMatches)) {
        const consumed = subMatches
          .map(match => {
            return 'consumed' in match
                  ? match.consumed
                  : 1
          })
          .reduce((acc, cur) => acc + cur, 0)
        remainingTokens.splice(0, consumed)
        matches.push(...subMatches)
      } else {
        return
      }
    }
    return matches as MapSequenceToMatches<Sequence>
  }

  type SubPatterns =
  | [INodePattern<IToken, INode>, string]
  | NonEmptyArray<string>
  | NonEmptyArray<INodePattern<IToken, INode>>

  /**
   * 该函数会匹配尽可能长的subPatterns.
   */
  function* splitPatterns(
    patterns: MapSequenceToPatterns<Sequence>
  ): IterableIterator<SubPatterns> {
    const mutablePatterns = toArray(patterns)

    while (mutablePatterns.length > 0) {
      if (isTokenType(mutablePatterns[0])) {
        const indexOfNodePattern = mutablePatterns.findIndex(x => isNodePattern(x))
        if (indexOfNodePattern === -1) {
          yield mutablePatterns.splice(0) as NonEmptyArray<string>
        } else {
          yield mutablePatterns.splice(0, indexOfNodePattern) as NonEmptyArray<string>
        }
      } else if (isNodePattern(mutablePatterns[0])) {
        const indexOfToken = mutablePatterns.findIndex(x => isTokenType(x))
        if (indexOfToken === -1) {
          yield mutablePatterns.splice(0) as NonEmptyArray<
            INodePattern<IToken, INode>
          >
        } else {
          yield mutablePatterns.splice(0, indexOfToken + 1) as [
            INodePattern<IToken, INode>
          , string
          ]
        }
      } else {
        throw new Error('Unknown patterns')
      }
    }
  }

  function isTokenTypes(arr: ReadonlyArray<unknown>): arr is ReadonlyArray<string> {
    return arr.every(isTokenType)
  }

  function isTokenType(val: unknown): val is string {
    return isString(val)
  }

  function isNodePatterns(
    arr: ReadonlyArray<unknown>
  ): arr is ReadonlyArray<INodePattern<IToken, INode>> {
    return arr.every(isNodePattern)
  }

  function isNodePattern(
    val: unknown
  ): val is INodePattern<IToken, INode> {
    return isFunction(val)
  }

  function isNodePatternNodeType(
    arr: ReadonlyArray<unknown>
  ): arr is readonly [INodePattern<IToken, INode>, string] {
    return arr.length === 2
        && isNodePattern(arr[0])
        && isTokenType(arr[1])
  }
}

function isToken(val: unknown): val is IToken {
  return isObject(val)
      && 'tokenType' in val && isString
      && 'value' in val && isString(val.value)
}

function isNode(val: unknown): val is INode {
  return isObject(val)
      && 'nodeType' in val && isString(val.nodeType)
}

/**
 * 尝试匹配token, 如果成功, 则消耗掉相应的token.
 * 
 * @param tokens 匹配成功时会发生原地修改
 */
function consumeToken<Token extends IToken = IToken>(
  tokens: Array<Token>
, tokenType: string
): Token | Falsy {
  const firstToken: IToken | undefined = tokens[0]
  
  if (firstToken && firstToken.tokenType === tokenType) {
    tokens.shift()
    return firstToken as Token
  }
}

/**
 * 尝试匹配node, 如果成功, 则消耗掉相应的token.
 * 
 * @param tokens 匹配成功时会发生原地修改
 */
async function consumeNode<Token extends IToken = IToken, Node extends INode = INode>(
  tokens: Token[]
, nodePattern: INodePattern<Token, Node>
): Promise<INodePatternMatch<Node> | Falsy> {
  const match = await nodePattern(tokens)

  if (isntFalsy(match)) {
    tokens.splice(0, match.consumed)
    return match
  }
}
