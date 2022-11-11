import { computeCondition } from '@utils/compute-condition'

describe('computeCondition', () => {
  test('empty', async () => {
    const condition = ''

    expect(await computeCondition(condition, [])).toBe(false)
  })

  test('tag', async () => {
    const condition = 'a'

    expect(await computeCondition(condition, [])).toBe(false)
    expect(await computeCondition(condition, ['a'])).toBe(true)
    expect(await computeCondition(condition, ['a', 'b'])).toBe(true)
  })

  test('and', async () => {
    const condition = 'a and b'

    expect(await computeCondition(condition, [])).toBe(false)
    expect(await computeCondition(condition, ['a'])).toBe(false)
    expect(await computeCondition(condition, ['b'])).toBe(false)
    expect(await computeCondition(condition, ['a', 'b'])).toBe(true)
  })

  test('or', async () => {
    const condition = 'a or b'

    expect(await computeCondition(condition, [])).toBe(false)
    expect(await computeCondition(condition, ['a'])).toBe(true)
    expect(await computeCondition(condition, ['b'])).toBe(true)
    expect(await computeCondition(condition, ['a', 'b'])).toBe(true)
  })

  test('xor', async () => {
    const condition = 'a xor b'

    expect(await computeCondition(condition, [])).toBe(false)
    expect(await computeCondition(condition, ['a'])).toBe(true)
    expect(await computeCondition(condition, ['b'])).toBe(true)
    expect(await computeCondition(condition, ['a', 'b'])).toBe(false)
  })

  test('not', async () => {
    const condition = 'not a'

    expect(await computeCondition(condition, [])).toBe(true)
    expect(await computeCondition(condition, ['a'])).toBe(false)
  })

  test('parenthesis', async () => {
    const condition = '(a)'

    expect(await computeCondition(condition, [])).toBe(false)
    expect(await computeCondition(condition, ['a'])).toBe(true)
  })

  describe('operator precedence', () => {
    test('without parenthesis', async () => {
      const condition = 'a xor b and c'

      expect(await computeCondition(condition, ['a'])).toBe(true)
      expect(await computeCondition(condition, ['a', 'b'])).toBe(true)
      expect(await computeCondition(condition, ['a', 'c'])).toBe(true)
      expect(await computeCondition(condition, ['a', 'b', 'c'])).toBe(false)
    })

    test('with parenthesis', async () => {
      const condition = '(a xor b) and c'

      expect(await computeCondition(condition, ['a'])).toBe(false)
      expect(await computeCondition(condition, ['a', 'b'])).toBe(false)
      expect(await computeCondition(condition, ['a', 'c'])).toBe(true)
      expect(await computeCondition(condition, ['a', 'b', 'c'])).toBe(false)
    })
  })
})
