#!/usr/bin/env node
import { program } from 'commander'
import { build } from '@commands/build'
import { tags } from '@commands/tags'

interface IGlobalOptions {
  tags: string
}

program
  .name(require('../package.json').name)
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .requiredOption('--tags <filename>', 'tag definitions file')

program
  .command('tags')
  .description('list all tags')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()

    tags({ tagDefinitionsFilename: globalOptions.tags })
  })

program
  .command('build',)
  .description('build folder hierarchy')
  .argument('<blueprint>', 'blueprint file')
  .action((blueprintFilename: string) => {
    const globalOptions = program.opts<IGlobalOptions>()

    build({
      blueprintFilename
    , tagDefinitionsFilename: globalOptions.tags
    })
  })

program.parse()
