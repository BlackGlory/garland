import {
  Node
, AndExpressionNode
, IdentifierExpressionNode
, NotExpressionNode
, OrExpressionNode
, XorExpressionNode
} from './nodes.js'
import { parseCondition } from './parse-condition.js'

interface IContext {
  tags: string[]
}

export async function computeCondition(
  condition: string
, tags: string[]
): Promise<boolean> {
  const node = await parseCondition(condition)
  if (node) {
    const context: IContext = { tags }
    return computeNode(context, node)
  } else {
    return false
  }
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
