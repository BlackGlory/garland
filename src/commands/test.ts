import { readTagDefinitions } from '@utils/read-tag-definitions.js'
import { computeCondition } from '@utils/compute-condition/index.js'

export async function test({
  tagDefinitionsFilename
, conditionExpression
}: {
  tagDefinitionsFilename: string
  conditionExpression: string
}): Promise<void> {
  const tagDefinintions = await readTagDefinitions(tagDefinitionsFilename)

  for (const [pathname, tags] of Object.entries(tagDefinintions)) {
    if (await computeCondition(conditionExpression, tags)) {
      console.log(pathname)
    }
  }
}
