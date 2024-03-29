import { readBlueprint } from '@utils/read-blueprint.js'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('readBlueprint', () => {
  test('nested blueprint', async () => {
    const blueprint = await readBlueprint(getFixtureFilename('nested-blueprint.yaml'))

    expect(blueprint).toStrictEqual({
      [path.normalize('no-subpath')]: 'condition'
    , [path.normalize('no-condition/subpath')]: ''
    , [path.normalize('shallow-condition/subpath')]: 'shallow-condition'
    , [path.normalize('deep-condition/subpath')]: 'deep-condition'
    , [path.normalize('multiple-conditions/subpath-a')]: '(shallow-condition) and (deep-condition-a)'
    , [path.normalize('multiple-conditions/subpath-b')]: '(shallow-condition) and (deep-condition-b)'
    })
  })

  test('flat blueprint', async () => {
    const blueprint = await readBlueprint(getFixtureFilename('flat-blueprint.yaml'))

    expect(blueprint).toStrictEqual({
      [path.normalize('no-subpath')]: 'condition'
    , [path.normalize('no-condition/subpath')]: ''
    , [path.normalize('condition/subpath')]: 'condition'
    })
  })

  test('top-level $condition', async () => {
    const blueprint = await readBlueprint(getFixtureFilename('top-level-condition.yaml'))

    expect(blueprint).toStrictEqual({
      [path.normalize('path')]: 'condition'
    })
  })
})

function getFixtureFilename(filename: string): string {
  return path.join(__dirname, 'fixtures', filename)
}
