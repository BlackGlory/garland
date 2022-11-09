import { computeCondition } from '@utils/compute-condition'

describe('computeCondition', () => {
  test('empty', () => {
    const condition = ''

    expect(computeCondition(condition, [])).toBe(false)
  })

  test('and', () => {
    const condition = 'a and b'

    expect(computeCondition(condition, [])).toBe(false)
    expect(computeCondition(condition, ['a'])).toBe(false)
    expect(computeCondition(condition, ['b'])).toBe(false)
    expect(computeCondition(condition, ['a', 'b'])).toBe(true)
  })

  test('or', () => {
    const condition = 'a or b'

    expect(computeCondition(condition, [])).toBe(false)
    expect(computeCondition(condition, ['a'])).toBe(true)
    expect(computeCondition(condition, ['b'])).toBe(true)
    expect(computeCondition(condition, ['a', 'b'])).toBe(true)
  })

  test('xor', () => {
    const condition = 'a xor b'

    expect(computeCondition(condition, [])).toBe(false)
    expect(computeCondition(condition, ['a'])).toBe(true)
    expect(computeCondition(condition, ['b'])).toBe(true)
    expect(computeCondition(condition, ['a', 'b'])).toBe(false)
  })

  test('not', () => {
    const condition = 'not a'

    expect(computeCondition(condition, [])).toBe(true)
    expect(computeCondition(condition, ['a'])).toBe(false)
  })

  test('parenthesis', () => {
    const condition = '(a)'

    expect(computeCondition(condition, [])).toBe(false)
    expect(computeCondition(condition, ['a'])).toBe(true)
  })

  describe('operator precedence', () => {
    test('without parenthesis', () => {
      const condition = 'a xor b and c'

      expect(computeCondition(condition, ['a'])).toBe(true)
      expect(computeCondition(condition, ['a', 'b'])).toBe(true)
      expect(computeCondition(condition, ['a', 'c'])).toBe(true)
      expect(computeCondition(condition, ['a', 'b', 'c'])).toBe(false)
    })

    test('with parenthesis', () => {
      const condition = '(a xor b) and c'

      expect(computeCondition(condition, ['a'])).toBe(false)
      expect(computeCondition(condition, ['a', 'b'])).toBe(false)
      expect(computeCondition(condition, ['a', 'c'])).toBe(true)
      expect(computeCondition(condition, ['a', 'b', 'c'])).toBe(false)
    })
  })
})
