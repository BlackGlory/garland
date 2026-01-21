#!/usr/bin/env node
import { program } from 'commander'
import { build } from '@commands/build.js'
import { tags } from '@commands/tags.js'
import { test } from '@commands/test.js'
import { name, version, description } from '@utils/package.js'

interface IGlobalOptions {
  tagDefinitions: string
}

process.title = name

program
  .name(name)
  .version(version)
  .description(description)
  .requiredOption('--tag-definitions <filename>', 'tag definition file')

program
  .command('tags')
  .description('list all tags')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()
    const tagDefinitionsFilename = getTagDefinitionsFilename(globalOptions)

    tags({ tagDefinitionsFilename })
  })

program
  .command('build')
  .description('build folder hierarchy')
  .argument('<blueprint>', 'blueprint file')
  .action((blueprintFilename: string) => {
    const globalOptions = program.opts<IGlobalOptions>()
    const tagDefinitionsFilename = getTagDefinitionsFilename(globalOptions)

    build({
      tagDefinitionsFilename
    , blueprintFilename
    })
  })

program
  .command('test')
  .description('test condition expression')
  .argument('<expression>', 'condition expression')
  .action((conditionExpression: string) => {
    const globalOptions = program.opts<IGlobalOptions>()
    const tagDefinitionsFilename = getTagDefinitionsFilename(globalOptions)

    test({
      tagDefinitionsFilename
    , conditionExpression
    })
  })

program.parse()

function getTagDefinitionsFilename(options: IGlobalOptions): string {
  return options.tagDefinitions
}
