import { readBlueprint } from '@utils/read-blueprint'
import { readTagDefinitions } from '@utils/read-tag-definitions'
import { calculateCondition } from '@utils/calculate-condition'
import { link } from 'fs/promises'
import { ensureDir } from 'extra-filesystem'
import * as path from 'path'

export async function build({
  blueprintFilename
, tagDefinitionsFilename
}: {
  blueprintFilename: string
  tagDefinitionsFilename: string
}): Promise<void> {
  const blueprint = await readBlueprint(blueprintFilename)
  const tagDefinintions = await readTagDefinitions(tagDefinitionsFilename)

  for (const [targetPathname, condition] of Object.entries(blueprint)) {
    await ensureDir(targetPathname)

    for (const [sourcePathname, tags] of Object.entries(tagDefinintions)) {
      if (calculateCondition(condition, tags)) {
        await link(
          sourcePathname
        , path.join(targetPathname, path.basename(sourcePathname))
        )
      }
    }
  }
}
