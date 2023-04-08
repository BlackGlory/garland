import { parseCondition } from '@utils/compute-condition/parse-condition.js'

describe('parseCondition', () => {
  test('empty', async () => {
    const condition = ''

    const result = await parseCondition(condition)

    expect(result).toBe(null)
  })

  test('tag', async () => {
    const condition = 'a'

    const result = await parseCondition(condition)

    expect(result).toStrictEqual({
      nodeType: 'IdentifierExpression'
    , value: 'a'
    })
  })

  test('and', async () => {
    const condition = 'a and b'

    const result = await parseCondition(condition)

    expect(result).toStrictEqual({
      nodeType: 'AndExpression'
    , left: {
        nodeType: 'IdentifierExpression'
      , value: 'a'
      }
    , right: {
        nodeType: 'IdentifierExpression'
      , value: 'b'
      }
    })
  })

  test('or', async () => {
    const condition = 'a or b'

    const result = await parseCondition(condition)

    expect(result).toStrictEqual({
      nodeType: 'OrExpression'
    , left: {
        nodeType: 'IdentifierExpression'
      , value: 'a'
      }
    , right: {
        nodeType: 'IdentifierExpression'
      , value: 'b'
      }
    })
  })

  test('xor', async () => {
    const condition = 'a xor b'

    const result = await parseCondition(condition)

    expect(result).toStrictEqual({
      nodeType: 'XorExpression'
    , left: {
        nodeType: 'IdentifierExpression'
      , value: 'a'
      }
    , right: {
        nodeType: 'IdentifierExpression'
      , value: 'b'
      }
    })
  })

  test('not', async () => {
    const condition = 'not a'

    const result = await parseCondition(condition)

    expect(result).toStrictEqual({
      nodeType: 'NotExpression'
    , right: {
        nodeType: 'IdentifierExpression'
      , value: 'a'
      }
    })
  })

  test('parenthesis', async () => {
    const condition = '(a)'

    const result = await parseCondition(condition)

    expect(result).toStrictEqual({
      nodeType: 'IdentifierExpression'
    , value: 'a'
    })
  })

  describe('operator precedence', () => {
    test('without parenthesis', async () => {
      const condition = 'a xor b and c'

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'XorExpression'
      , left: {
          nodeType: 'IdentifierExpression'
        , value: 'a'
        }
      , right: {
          nodeType: 'AndExpression'
        , left: {
            nodeType: 'IdentifierExpression'
          , value: 'b'
          }
        , right: {
            nodeType: 'IdentifierExpression'
          , value: 'c'
          }
        }
      })
    })

    test('with parenthesis', async () => {
      const condition = '(a xor b) and c'

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'AndExpression'
      , left: {
          nodeType: 'XorExpression'
        , left: {
            nodeType: 'IdentifierExpression'
          , value: 'a'
          }
        , right: {
            nodeType: 'IdentifierExpression'
          , value: 'b'
          }
        }
      , right: {
          nodeType: 'IdentifierExpression'
        , value: 'c'
        }
      })
    })
  })
})
