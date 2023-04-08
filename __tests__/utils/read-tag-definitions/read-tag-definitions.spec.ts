import { readTagDefinitions } from '@utils/read-tag-definitions.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('readTagDefinitions', () => {
  test('nested tag definitions', async () => {
    const tags = await readTagDefinitions(getFixtureFilename('nested-tag-definitions.yaml'))

    expect(tags).toStrictEqual({
      [path.normalize('example1.com/owner1/repo1')]: ['tag1', 'tag2']
    , [path.normalize('example1.com/owner2/repo2')]: ['tag2', 'tag3']
    , [path.normalize('example2.com/owner3/repo3')]: ['tag3', 'tag4']
    })
  })

  test('flat tag definitions', async () => {
    const tags = await readTagDefinitions(getFixtureFilename('flat-tag-definitions.yaml'))

    expect(tags).toStrictEqual({
      [path.normalize('example1.com/owner1/repo1')]: ['tag1', 'tag2']
    , [path.normalize('example1.com/owner2/repo2')]: ['tag2', 'tag3']
    , [path.normalize('example2.com/owner3/repo3')]: ['tag3', 'tag4']
    })
  })
})

function getFixtureFilename(filename: string): string {
  return path.join(__dirname, 'fixtures', filename)
}
