import * as fs from 'fs/promises'
import * as YAML from 'js-yaml'
import { validateTagDefinitions } from '@utils/validate-tag-definitions'
import { isArray } from '@blackglory/prelude'
import { toArray } from 'iterable-operator'
import * as path from 'path'

interface ITagDefinitions {
  [path: string]: string[] | ITagDefinitions
}

export async function readTagDefinitions(
  filename: string
): Promise<Record<string, string[]>> {
  const text = await fs.readFile(filename, 'utf-8')
  const data = YAML.load(text)
  validateTagDefinitions(data)
  return flatTagDefinitions(data as ITagDefinitions)
}

function flatTagDefinitions(
  tagDefinitions: ITagDefinitions
): Record<string, string[]> {
  return Object.fromEntries(toArray(flatTagDefinitions(tagDefinitions)))

  function* flatTagDefinitions(
    tagDefinitions: ITagDefinitions
  , paths: string[] = []
  ): Iterable<[path: string, tags: string[]]> {
    for (const [key, value] of Object.entries(tagDefinitions)) {
      if (isArray(value)) {
        yield [path.normalize([...paths, key].join('/')), value]
      } else {
        yield* flatTagDefinitions(value, [...paths, key])
      }
    }
  }
}
