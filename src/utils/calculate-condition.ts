import { createToken, Lexer, CstParser, CstNode, IToken } from 'chevrotain'

const Identifier = createToken({
  name: 'Identifier'
, pattern: /[a-zA-Z0-9_-]+/
})
const And = createToken({ name: 'And', pattern: /and/ })
const Or = createToken({ name: 'Or', pattern: /or/ })
const Not = createToken({ name: 'Not', pattern: /not/ })
const Xor = createToken({ name: 'Xor', pattern: /xor/ })
const WhiteSpace = createToken({
  name: 'WhiteSpace'
, pattern: /\s+/
, group: Lexer.SKIPPED
})
const LeftParenthesis = createToken({
  name: 'LeftParenthesis'
, pattern: /\(/
})
const RightParenthesis = createToken({
  name: 'RightParenthesis'
, pattern: /\)/
})

const allTokens = [
  WhiteSpace
, And
, Or
, Not
, Xor
, LeftParenthesis
, RightParenthesis
, Identifier
]

const ConditionLexer = new Lexer(allTokens)

class ConditionParser extends CstParser {
  constructor() {
    super(allTokens)
    this.performSelfAnalysis()
  }

  public expression = this.RULE('expression', () => {
    this.SUBRULE(this.orExpression)
  })

  private orExpression = this.RULE('orExpression', () => {
    this.SUBRULE(this.xorExpression, { LABEL: 'lhs' })
    this.MANY(() => {
      this.CONSUME(Or)
      this.SUBRULE2(this.xorExpression, { LABEL: 'rhs' })
    })
  })

  private xorExpression = this.RULE('xorExpression', () => {
    this.SUBRULE(this.andExpression, { LABEL: 'lhs' })
    this.MANY(() => {
      this.CONSUME(Xor)
      this.SUBRULE2(this.andExpression, { LABEL: 'rhs' })
    })
  })

  private andExpression = this.RULE('andExpression', () => {
    this.SUBRULE(this.atomicExpression, { LABEL: 'lhs' })
    this.MANY(() => {
      this.CONSUME(And)
      this.SUBRULE2(this.atomicExpression, { LABEL: 'rhs' })
    })
  })

  private atomicExpression = this.RULE('atomicExpression', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.notExpression) }
    , { ALT: () => this.SUBRULE(this.parenthesisExpression) }
    , { ALT: () => this.CONSUME(Identifier) }
    ])
  })

  private notExpression = this.RULE('notExpression', () => {
    this.CONSUME(Not)
    this.SUBRULE(this.atomicExpression)
  })

  private parenthesisExpression = this.RULE('parenthesisExpression', () => {
    this.CONSUME(LeftParenthesis)
    this.SUBRULE(this.expression)
    this.CONSUME(RightParenthesis)
  })
}

const parser = new ConditionParser()

const BaseCstVisitor = parser.getBaseCstVisitorConstructor()
class ConditionInterpreter extends BaseCstVisitor {
  constructor(private tags: string[]) {
    super()

    this.validateVisitor()
  }

  expression(ctx: { orExpression: CstNode[] }): boolean {
    return this.visit(ctx.orExpression)
  }

  orExpression(ctx: { lhs: CstNode[]; rhs?: CstNode[] }): boolean {
    const lhsResult = this.visit(ctx.lhs)
    let result = lhsResult

    if (ctx.rhs) {
      ctx.rhs.forEach(rhs => {
        const rhsResult = this.visit(rhs)
        result = result || rhsResult
      })
    }

    return result
  }

  xorExpression(ctx: { lhs: CstNode[]; rhs?: CstNode[] }): boolean {
    const lhsResult = this.visit(ctx.lhs)
    let result = lhsResult

    if (ctx.rhs) {
      ctx.rhs.forEach(rhs => {
        const rhsResult = this.visit(rhs)
        result = (result && !rhsResult) || (!result && rhsResult) 
      })
    }

    return result
  }

  andExpression(ctx: { lhs: CstNode[]; rhs?: CstNode[] }): boolean {
    const lhsResult = this.visit(ctx.lhs)
    let result = lhsResult

    if (ctx.rhs) {
      ctx.rhs.forEach(rhs => {
        const rhsResult = this.visit(rhs)
        result = result && rhsResult
      })
    }

    return result
  }

  atomicExpression(ctx: {
    notExpression?: CstNode
    parenthesisExpression?: CstNode
    Identifier?: IToken[]
  }): boolean {
    if (ctx.notExpression) {
      return this.visit(ctx.notExpression)
    } else if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression)
    } else if (ctx.Identifier) {
      return this.tags.includes(ctx.Identifier[0].image)
    }
    throw new Error('Unknown atomic expression')
  }

  notExpression(ctx: { atomicExpression: CstNode }): boolean {
    const lhsResult = this.visit(ctx.atomicExpression)
    const result = !lhsResult
    return result
  }

  parenthesisExpression(ctx: { expression: CstNode }): boolean {
    return this.visit(ctx.expression)
  }
}

export function calculateCondition(condition: string, tags: string[]) {
  const lexingResult = ConditionLexer.tokenize(condition)

  parser.input = lexingResult.tokens
  const cst = parser.expression()
  if (parser.errors.length > 0) {
    throw parser.errors
  }

  return new ConditionInterpreter(tags).visit(cst)
}
