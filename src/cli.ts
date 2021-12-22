#!/usr/bin/env node
import { program } from 'commander'
import { build } from '@commands/build'
import { tags } from '@commands/tags'

program
  .name(require('../package.json').name)
  .version(require('../package.json').version)
  .description(require('../package.json').description)

program
  .command('tags')
  .description('列出所有标签和具有标签的对象数量(按从大到小排列)')
  .action(() => tags())

program
  .command('build',)
  .description('构建层次结构')
  .action(() => build())

program.parse()
