import { readTagDefinitionFile } from '@utils/read-tag-definition-file.js'
import { computeCondition } from '@utils/compute-condition/index.js'

export async function test({
  tagDefinitionsFilename
, conditionExpression
}: {
  tagDefinitionsFilename: string
  conditionExpression: string
}): Promise<void> {
  const tagDefinintions = await readTagDefinitionFile(tagDefinitionsFilename)

  for (const [pathname, tags] of Object.entries(tagDefinintions)) {
    if (computeCondition(conditionExpression, tags)) {
      console.log(pathname)
    }
  }
}
