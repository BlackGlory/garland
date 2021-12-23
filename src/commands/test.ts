import { readTagDefinitions } from '@utils/read-tag-definitions'
import { calculateCondition } from '@utils/calculate-condition'

export async function test({
  tagDefinitionsFilename
, conditionExpression
}: {
  tagDefinitionsFilename: string
  conditionExpression: string
}): Promise<void> {
  const tagDefinintions = await readTagDefinitions(tagDefinitionsFilename)

  for (const [pathname, tags] of Object.entries(tagDefinintions)) {
    if (calculateCondition(conditionExpression, tags)) {
      console.log(pathname)
    }
  }
}
