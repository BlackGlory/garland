import { readBlueprint } from '@utils/read-blueprint'
import { readTagDefinitions } from '@utils/read-tag-definitions'
import { calculateCondition } from '@utils/calculate-condition'
import { ensureDir } from 'extra-filesystem'
import { mapKeys } from '@utils/map-keys'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function build({
  blueprintFilename
, tagDefinitionsFilename
}: {
  blueprintFilename: string
  tagDefinitionsFilename: string
}): Promise<void> {
  const blueprint = await readBlueprint(blueprintFilename)
  const tagDefinintions = mapKeys(
    await readTagDefinitions(tagDefinitionsFilename)
  , pathname => path.join(path.dirname(tagDefinitionsFilename), pathname)
  )

  for (const [targetPathname, condition] of Object.entries(blueprint)) {
    await ensureDir(targetPathname)

    for (const [sourcePathname, tags] of Object.entries(tagDefinintions)) {
      if (calculateCondition(condition, tags)) {
        await fs.symlink(
          sourcePathname
        , path.join(targetPathname, path.basename(sourcePathname))
        )
      }
    }
  }
}
