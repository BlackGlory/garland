import { assert } from '@blackglory/prelude'
import { tokenize, parse, IToken } from 'extra-parser'
import { toArrayAsync, filterAsync } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { tokenPatterns } from './token-patterns'
import { nodePatterns } from './node-patterns'
import { WhiteSpaceToken } from './tokens'
import {
  Node
, AndExpressionNode
, IdentifierExpressionNode
, NotExpressionNode
, OrExpressionNode
, XorExpressionNode
} from './nodes'

interface IContext {
  tags: string[]
}

export async function computeCondition(
  condition: string
, tags: string[]
): Promise<boolean> {
  const tokens = await pipe(
    tokenize(tokenPatterns, condition)
  , iter => filterAsync(iter, isntWhiteSpace)
  , iter => toArrayAsync(iter)
  )
  if (tokens.length === 0) return false

  const nodes = await toArrayAsync(parse(nodePatterns, tokens))
  assert(nodes.length === 1, 'The condition contains an invliad expression')

  const [node] = nodes
  const context: IContext = { tags }
  return computeNode(context, node)
}

function isWhiteSpace(token: IToken): token is WhiteSpaceToken {
  return token.tokenType === 'WhiteSpace'
}

function isntWhiteSpace<T extends IToken>(token: T): token is Exclude<T, WhiteSpaceToken> {
  return !isWhiteSpace(token)
}

function computeNode(context: IContext, node: Node): boolean {
  switch (node.nodeType) {
    case 'AndExpression': return computeAndExpression(context, node)
    case 'OrExpression': return computeOrExpression(context, node)
    case 'XorExpression': return computeXorExpression(context, node)
    case 'NotExpression': return computeNotExpression(context, node)
    case 'IdentifierExpression': return computeIdentifier(context, node)
  }
}

function computeAndExpression(context: IContext, node: AndExpressionNode): boolean {
  return computeNode(context, node.left)
      && computeNode(context, node.right)
}

function computeOrExpression(context: IContext, node: OrExpressionNode): boolean {
  return computeNode(context, node.left)
      || computeNode(context, node.right)
}

function computeXorExpression(context: IContext, node: XorExpressionNode): boolean {
  const leftValue = computeNode(context, node.left)
  const rightValue = computeNode(context, node.right)
  return (leftValue && !rightValue)
      || (!leftValue && rightValue)
}

function computeNotExpression(context: IContext, node: NotExpressionNode): boolean {
  return !computeNode(context, node.right)
}

function computeIdentifier(context: IContext, node: IdentifierExpressionNode): boolean {
  return context.tags.includes(node.value)
}
