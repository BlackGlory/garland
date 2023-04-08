import { getTagStats } from '@commands/tags.js'

test('getTagStats', () => {
  const tagDefinitions: Record<string, string[]> = {
    'file-a': ['foo', 'bar']
  , 'file-b': ['bar']
  }

  const result = getTagStats(tagDefinitions)

  expect(result).toStrictEqual({
    foo: 1
  , bar: 2
  })
})
