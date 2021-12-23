import { readTagDefinitions } from '@utils/read-tag-definitions'
import * as path from 'path'

test('readTagDefinitions', async () => {
  const tags = await readTagDefinitions(getFixtureFilename('tags.yaml'))

  expect(tags).toStrictEqual({
    [path.normalize('example1.com/owner1/repo1')]: ['tag1', 'tag2']
  , [path.normalize('example1.com/owner2/repo2')]: ['tag2', 'tag3']
  , [path.normalize('example2.com/owner3/repo3')]: ['tag3', 'tag4']
  , [path.normalize('example3.com/owner4/repo4')]: ['tag4', 'tag5']
  })
})

function getFixtureFilename(filename: string): string {
  return path.join(__dirname, 'fixtures', filename)
}
