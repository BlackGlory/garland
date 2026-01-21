import { readTagDefinitionsFile } from '@utils/read-tag-definitions-file.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('readTagDefinitionsFile', () => {
  test('nested tag definitions', async () => {
    const tags = await readTagDefinitionsFile(getFixtureFilename('nested-tag-definitions.yaml'))

    expect(tags).toStrictEqual({
      [path.normalize('example1.com/owner1/repo1')]: ['tag1', 'tag2']
    , [path.normalize('example1.com/owner2/repo2')]: ['tag2', 'tag3']
    , [path.normalize('example2.com/owner3/repo3')]: ['tag3', 'tag4']
    })
  })

  test('flat tag definitions', async () => {
    const tags = await readTagDefinitionsFile(getFixtureFilename('flat-tag-definitions.yaml'))

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
