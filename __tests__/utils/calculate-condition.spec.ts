import { calculateCondition } from '@utils/calculate-condition'

describe('calculateCondition', () => {
  test('and', () => {
    const condition = 'a and b'

    expect(calculateCondition(condition, [])).toBe(false)
    expect(calculateCondition(condition, ['a'])).toBe(false)
    expect(calculateCondition(condition, ['b'])).toBe(false)
    expect(calculateCondition(condition, ['a', 'b'])).toBe(true)
  })

  test('or', () => {
    const condition = 'a or b'

    expect(calculateCondition(condition, [])).toBe(false)
    expect(calculateCondition(condition, ['a'])).toBe(true)
    expect(calculateCondition(condition, ['b'])).toBe(true)
    expect(calculateCondition(condition, ['a', 'b'])).toBe(true)
  })

  test('xor', () => {
    const condition = 'a xor b'

    expect(calculateCondition(condition, [])).toBe(false)
    expect(calculateCondition(condition, ['a'])).toBe(true)
    expect(calculateCondition(condition, ['b'])).toBe(true)
    expect(calculateCondition(condition, ['a', 'b'])).toBe(false)
  })

  test('not', () => {
    const condition = 'not a'

    expect(calculateCondition(condition, [])).toBe(true)
    expect(calculateCondition(condition, ['a'])).toBe(false)
  })

  test('parenthesis', () => {
    const condition = '(a)'

    expect(calculateCondition(condition, [])).toBe(false)
    expect(calculateCondition(condition, ['a'])).toBe(true)
  })
})
