import { readBlueprintFile } from '@utils/read-blueprint-file.js'
import { readTagDefinitionFile } from '@utils/read-tag-definition-file.js'
import { computeCondition } from '@utils/compute-condition/index.js'
import { ensureDir } from 'extra-filesystem'
import { mapKeys } from '@utils/map-keys.js'
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
  const blueprint = await readBlueprintFile(blueprintFilename)
  const tagDefinintions = mapKeys(
    await readTagDefinitionFile(tagDefinitionsFilename)
  , pathname => path.join(path.dirname(tagDefinitionsFilename), pathname)
  )

  for (const [dirname, condition] of Object.entries(blueprint)) {
    await ensureDir(dirname)

    for (const [sourcePathname, tags] of Object.entries(tagDefinintions)) {
      if (computeCondition(condition, tags)) {
        const destinationPathname = path.join(dirname, path.basename(sourcePathname))

        try {
          await fs.symlink(sourcePathname, destinationPathname)

          console.log(`${destinationPathname}: linked`)
        } catch (e) {
          if (isObject(e) && e.code === 'EEXIST') {
            console.log(`${destinationPathname}: already exists`)
          } else {
            throw e
          }
        }
      }
    }
  }
}
