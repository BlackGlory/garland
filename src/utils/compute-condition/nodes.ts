import { INode } from 'extra-parser'

export type Node =
| IIdentifier
| IOrExpression
| IXorExpression
| IAndExpression
| INotExpression

export interface IIdentifier extends INode<'Identifier'> {
  value: string
}

export interface IOrExpression extends INode<'OrExpression'> {
  left: Node
  right: Node
}

export interface IXorExpression extends INode<'XorExpression'> {
  left: Node
  right: Node
}

export interface IAndExpression extends INode<'AndExpression'> {
  left: Node
  right: Node
}

export interface INotExpression extends INode<'NotExpression'> {
  right: Node
}
