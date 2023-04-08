import { WhiteSpaceToken } from './tokens.js'
import { Node } from './nodes.js'
import { assert } from '@blackglory/prelude'
import { tokenize, parse, IToken } from 'extra-parser'
import { toArrayAsync, filterAsync } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { tokenPatterns } from './token-patterns.js'
import { nodePatterns } from './node-patterns.js'

export async function parseCondition(condition: string): Promise<Node | null> {
  const tokens = await pipe(
    tokenize(tokenPatterns, condition)
  , iter => filterAsync(iter, isntWhiteSpace)
  , iter => toArrayAsync(iter)
  )
  if (tokens.length === 0) return null

  const nodes = await toArrayAsync(parse(nodePatterns, tokens))
  assert(nodes.length === 1, 'The condition contains an invalid expression')

  const [node] = nodes
  return node
}

function isWhiteSpace(token: IToken): token is WhiteSpaceToken {
  return token.tokenType === 'WhiteSpace'
}

function isntWhiteSpace<T extends IToken>(
  token: T
): token is Exclude<T, WhiteSpaceToken> {
  return !isWhiteSpace(token)
}
