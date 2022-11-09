import { assert } from '@blackglory/prelude'
import { tokenize, parse, IToken } from 'extra-parser'
import { toArray, filter } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { tokenPatterns } from './token-patterns'
import { nodePatterns } from './node-patterns'
import { Token } from './tokens'
import {
  Node
, AndExpression
, IdentifierExpression
, NotExpression
, OrExpression
, XorExpression
} from './nodes'

interface IContext {
  tags: string[]
}

export function computeCondition(condition: string, tags: string[]): boolean {
  const tokens = pipe(
    tokenize<Token>(condition, tokenPatterns)
  , iter => filter(iter, isntWhiteSpace)
  , iter => toArray(iter)
  )
  if (tokens.length === 0) return false

  const nodes = toArray(parse<Token, Node>(tokens, nodePatterns))
  assert(nodes.length === 1, 'The condition contains an invliad expression')

  const [node] = nodes
  const context: IContext = { tags }
  return computeNode(context, node)
}

function isWhiteSpace(token: IToken<string>): boolean {
  return token.type === 'WhiteSpace'
}

function isntWhiteSpace(token: IToken<string>): boolean {
  return !isWhiteSpace(token)
}

function computeNode(context: IContext, node: Node): boolean {
  switch (node.type) {
    case 'AndExpression': return computeAndExpression(context, node)
    case 'OrExpression': return computeOrExpression(context, node)
    case 'XorExpression': return computeXorExpression(context, node)
    case 'NotExpression': return computeNotExpression(context, node)
    case 'IdentifierExpression': return computeIdentifier(context, node)
  }
}

function computeAndExpression(context: IContext, node: AndExpression): boolean {
  return computeNode(context, node.left)
      && computeNode(context, node.right)
}

function computeOrExpression(context: IContext, node: OrExpression): boolean {
  return computeNode(context, node.left)
      || computeNode(context, node.right)
}

function computeXorExpression(context: IContext, node: XorExpression): boolean {
  const leftValue = computeNode(context, node.left)
  const rightValue = computeNode(context, node.right)
  return (leftValue && !rightValue)
      || (!leftValue && rightValue)
}

function computeNotExpression(context: IContext, node: NotExpression): boolean {
  return !computeNode(context, node.right)
}

function computeIdentifier(context: IContext, node: IdentifierExpression): boolean {
  return context.tags.includes(node.value)
}
