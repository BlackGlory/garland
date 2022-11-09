import { assert } from '@blackglory/prelude'
import { tokenize, parse, IToken } from 'extra-parser'
import { toArray, filter } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { tokenPatterns } from './token-patterns'
import { nodePatterns } from './node-patterns'
import {
  Node
, IAndExpression
, IIdentifier
, INotExpression
, IOrExpression
, IXorExpression
} from './ast'

interface IContext {
  tags: string[]
}

export function computeCondition(condition: string, tags: string[]): boolean {
  const tokens = pipe(
    tokenize(condition, tokenPatterns)
  , iter => filter(iter, isntWhiteSpace)
  , iter => toArray(iter)
  )
  if (tokens.length === 0) return false

  const expressions = toArray(parse(tokens, nodePatterns))
  assert(expressions.length === 1, 'The condition contains an invliad expression')

  const [expression] = expressions
  const context: IContext = { tags }
  return computeExpression(context, expression as Node)
}

function isWhiteSpace(token: IToken<string>): boolean {
  return token.type === 'WhiteSpace'
}

function isntWhiteSpace(token: IToken<string>): boolean {
  return !isWhiteSpace(token)
}

function computeExpression(context: IContext, node: Node): boolean {
  switch (node.type) {
    case 'AndExpression': return computeAndExpression(context, node)
    case 'OrExpression': return computeOrExpression(context, node)
    case 'XorExpression': return computeXorExpression(context, node)
    case 'NotExpression': return computeNotExpression(context, node)
    case 'Identifier': return computeIdentifier(context, node)
  }
}

function computeAndExpression(context: IContext, node: IAndExpression): boolean {
  return computeExpression(context, node.left)
      && computeExpression(context, node.right)
}

function computeOrExpression(context: IContext, node: IOrExpression): boolean {
  return computeExpression(context, node.left)
      || computeExpression(context, node.right)
}

function computeXorExpression(context: IContext, node: IXorExpression): boolean {
  const leftValue = computeExpression(context, node.left)
  const rightValue = computeExpression(context, node.right)
  return (leftValue && !rightValue)
      || (!leftValue && rightValue)
}

function computeNotExpression(context: IContext, node: INotExpression): boolean {
  return !computeExpression(context, node.right)
}

function computeIdentifier(context: IContext, node: IIdentifier): boolean {
  return context.tags.includes(node.value)
}
