import { readBlueprint } from '@utils/read-blueprint'
import { readTagDefinitions } from '@utils/read-tag-definitions'
import { computeCondition } from '@utils/compute-condition'
import { ensureDir } from 'extra-filesystem'
import { mapKeys } from '@utils/map-keys'
import { isObject } from '@blackglory/prelude'
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
      if (await computeCondition(condition, tags)) {
        try {
          const pathname = path.join(targetPathname, path.basename(sourcePathname))
          await fs.symlink(sourcePathname, pathname)
          console.log(`${pathname}: linked`)
        } catch (e) {
          if (isObject(e) && e.code === 'EEXIST') {
            console.log(`${targetPathname}: already exists`)
          } else {
            throw e
          }
        }
      }
    }
  }
}
