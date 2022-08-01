#!/usr/bin/env node
import { program } from 'commander'
import { build } from '@commands/build'
import { tags } from '@commands/tags'
import { test } from '@commands/test'

interface IGlobalOptions {
  tagDefinitions: string
}

const { name, version, description } = require('../package.json')
process.title = name

program
  .name(name)
  .version(version)
  .description(description)
  .requiredOption('--tag-definitions <filename>', 'tag definitions file')

program
  .command('tags')
  .description('list all tags')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()

    tags({ tagDefinitionsFilename: globalOptions.tagDefinitions })
  })

program
  .command('build')
  .description('build folder hierarchy')
  .argument('<blueprint>', 'blueprint file')
  .action((blueprintFilename: string) => {
    const globalOptions = program.opts<IGlobalOptions>()

    build({
      blueprintFilename
    , tagDefinitionsFilename: globalOptions.tagDefinitions
    })
  })

program
  .command('test')
  .description('test condition expression')
  .argument('<expression>', 'condition expression')
  .action((conditionExpression: string) => {
    const globalOptions = program.opts<IGlobalOptions>()

    test({
      tagDefinitionsFilename: globalOptions.tagDefinitions
    , conditionExpression
    })
  })

program.parse()
