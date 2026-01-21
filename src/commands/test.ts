import { readTagDefinitionsFile } from '@utils/read-tag-definitions-file.js'
import { computeCondition } from '@utils/compute-condition/index.js'

export async function test({
  tagDefinitionsFilename
, conditionExpression
}: {
  tagDefinitionsFilename: string
  conditionExpression: string
}): Promise<void> {
  const tagDefinintions = await readTagDefinitionsFile(tagDefinitionsFilename)

  for (const [pathname, tags] of Object.entries(tagDefinintions)) {
    if (computeCondition(conditionExpression, tags)) {
      console.log(pathname)
    }
  }
}
