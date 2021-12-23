import * as fs from 'fs/promises'
import * as YAML from 'js-yaml'
import { validateBlueprint } from '@utils/validate-blueprint'
import { toArray } from 'iterable-operator'
import { isNull } from '@blackglory/types'
import * as path from 'path'

interface IBlueprint {
  [path: string]:
  | { $condition?: string }
  | { [subpath: string]: IBlueprint | null }
  | null
}

export async function readBlueprint(
  filename: string
): Promise<Record<string, string>> {
  const text = await fs.readFile(filename, 'utf-8')
  const data = YAML.load(text)
  validateBlueprint(data)
  return flatBlueprint(data as IBlueprint)
}

function flatBlueprint(
  blueprint: IBlueprint
): Record<string, string> {
  return Object.fromEntries(toArray(flatBlueprint(blueprint)))

  function* flatBlueprint(
    blueprint: IBlueprint
  , paths: string[] = []
  , conditions: string[] = []
  ): Iterable<[path: string, condition: string]> {
    const condition = blueprint.$condition as string | undefined
    const newConditions = condition ? [...conditions, condition] : conditions

    if (isEndpoint()) {
      yield [
        path.normalize(paths.join('/'))
      , composeConditions(newConditions)
      ]
    } else {
      for (const [key, value] of Object.entries(blueprint)) {
        if (key === '$condition') continue

        if (isNull(value)) {
          yield [
            path.normalize([...paths, key].join('/'))
          , composeConditions(newConditions)
          ]
        } else {
          yield* flatBlueprint(
            value as IBlueprint
          , [...paths, key]
          , newConditions
          )
        }
      }
    }

    function isEndpoint() {
      const keys = Object.keys(blueprint)
      const subPaths = keys.filter(x => x !== '$condition')
      return subPaths.length === 0
    }
  }
}

function composeConditions(conditions: string[]): string {
  if (conditions.length === 0) return ''
  if (conditions.length === 1) return conditions[0]
  return conditions.map(x => `(${x})`).join(' and ')
}
