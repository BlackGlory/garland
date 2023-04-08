import { readTagDefinitions } from '@utils/read-tag-definitions.js'
import { compareNumbersDescending } from 'extra-sort'

export async function tags({ tagDefinitionsFilename }: {
  tagDefinitionsFilename: string
}): Promise<void> {
  const tagDefinintions = await readTagDefinitions(tagDefinitionsFilename)
  const tagStats = getTagStats(tagDefinintions)
  const sortedTags = Object.entries(tagStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => compareNumbersDescending(a.count, b.count))
  const report = sortedTags
    .map(({ name, count }) => `${name}(${count})`)
    .join(' ')
  console.log(report)
}

export function getTagStats(
  tagDefinitions: Record<string, string[]>
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const tags of Object.values(tagDefinitions)) {
    for (const tag of tags) {
      if (result[tag]) {
        result[tag] = result[tag] + 1
      } else {
        result[tag] = 1
      }
    }
  }
  return result
}
