import { parseCondition } from '@utils/compute-condition/parse-condition.js'
import { getError } from 'return-style'

describe('parseCondition', () => {
  describe('empty', () => {
    test('without whitespaces', () => {
      const condition = ''

      const result = parseCondition(condition)

      expect(result).toBe(null)
    })

    test('edge case: with whitespaces', () => {
      const condition = '  '

      const result = parseCondition(condition)

      expect(result).toBe(null)
    })
  })

  describe('tag', () => {
    test('general', () => {
      const condition = 'a'

      const result = parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
    })

    test('edge case: with whitespaces', () => {
      const condition = '  a  '

      const result = parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
    })
  })

  describe('and', () => {
    test('general', () => {
      const condition = 'a and b'

      const result = parseCondition(condition)

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

    test('edge case: with more than one whitespaces', () => {
      const condition = 'a  and  b'

      const result = parseCondition(condition)

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

    test('edge case: missing left whitespaces', () => {
      const condition = 'aand b'

      const err = getError(() => parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })

    test('edge case: missing right whitespaces', () => {
      const condition = 'a andb'

      const err = getError(() => parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('or', () => {
    test('general', () => {
      const condition = 'a or b'

      const result = parseCondition(condition)

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

    test('edge case: with more than one whitespaces', () => {
      const condition = 'a  or  b'

      const result = parseCondition(condition)

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

    test('edge case: missing left whitespaces', () => {
      const condition = 'aor b'

      const err = getError(() => parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })

    test('edge case: missing right whitespaces', () => {
      const condition = 'a orb'

      const err = getError(() => parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('xor', () => {
    test('general', () => {
      const condition = 'a xor b'

      const result = parseCondition(condition)

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

    test('edge case: with more than one whitespaces', () => {
      const condition = 'a  xor  b'

      const result = parseCondition(condition)

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

    test('edge case: missing left whitespaces', () => {
      const condition = 'axor b'

      const err = getError(() => parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })

    test('edge case: missing right whitespaces', () => {
      const condition = 'a xorb'

      const err = getError(() => parseCondition(condition))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('not', () => {
    test('general', () => {
      const condition = 'not a'

      const result = parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'NotExpression'
      , right: {
          nodeType: 'IdentifierExpression'
        , value: 'a'
        }
      })
    })

    test('edge case: with more than one whitespaces', () => {
      const condition = 'not  a'

      const result = parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'NotExpression'
      , right: {
          nodeType: 'IdentifierExpression'
        , value: 'a'
        }
      })
    })

    test('edge case: missing right whitespaces', () => {
      const condition = 'nota'

      const result = parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'nota'
      })
    })
  })

  describe('parenthesis', () => {
    test('general', () => {
      const condition = '(a)'

      const result = parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
    })

    test('edge: with whitespaces', () => {
      const condition = '(  a  )'

      const result = parseCondition(condition)

      expect(result).toStrictEqual({
        nodeType: 'IdentifierExpression'
      , value: 'a'
      })
    })
  })

  describe('operator precedence', () => {
    test('without parenthesis', () => {
      const condition = 'a xor b and c'

      const result = parseCondition(condition)

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

    test('with parenthesis', () => {
      const condition = '(a xor b) and c'

      const result = parseCondition(condition)

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
