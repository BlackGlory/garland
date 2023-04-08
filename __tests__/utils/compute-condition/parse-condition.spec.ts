import { parseCondition } from '@utils/compute-condition/parse-condition.js'
import { getErrorPromise } from 'return-style'

describe('parseCondition', () => {
  describe('empty', () => {
    test('without whitespaces', async () => {
      const condition = ''

      const result = await parseCondition(condition)

      expect(result).toBe(null)
    })

    test('edge case: with whitespaces', async () => {
      const condition = '  '

      const result = await parseCondition(condition)

      expect(result).toBe(null)
    })
  })

  describe('tag', () => {
    test('general', async () => {
      const condition = 'a'

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
    })

    test('edge case: with whitespaces', async () => {
      const condition = '  a  '

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
    })
  })

  describe('and', () => {
    test('general', async () => {
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

    test('edge case: with more than one whitespaces', async () => {
      const condition = 'a  and  b'

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

    test('edge case: missing left whitespaces', async () => {
      const condition = 'aand b'

      const err = await getErrorPromise(parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })

    test('edge case: missing right whitespaces', async () => {
      const condition = 'a andb'

      const err = await getErrorPromise(parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('or', () => {
    test('general', async () => {
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

    test('edge case: with more than one whitespaces', async () => {
      const condition = 'a  or  b'

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

    test('edge case: missing left whitespaces', async () => {
      const condition = 'aor b'

      const err = await getErrorPromise(parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })

    test('edge case: missing right whitespaces', async () => {
      const condition = 'a orb'

      const err = await getErrorPromise(parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('xor', () => {
    test('general', async () => {
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

    test('edge case: with more than one whitespaces', async () => {
      const condition = 'a  xor  b'

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

    test('edge case: missing left whitespaces', async () => {
      const condition = 'axor b'

      const err = await getErrorPromise(parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })

    test('edge case: missing right whitespaces', async () => {
      const condition = 'a xorb'

      const err = await getErrorPromise(parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('not', () => {
    test('general', async () => {
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

    test('edge case: with more than one whitespaces', async () => {
      const condition = 'not  a'

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'NotExpression'
      , right: {
          nodeType: 'IdentifierExpression'
        , value: 'a'
        }
      })
    })

    test('edge case: missing right whitespaces', async () => {
      const condition = 'nota'

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'nota'
      })
    })
  })

  describe('parenthesis', () => {
    test('general', async () => {
      const condition = '(a)'

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
    })

    test('edge: with whitespaces', async () => {
      const condition = '(  a  )'

      const result = await parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
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
