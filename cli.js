#!/usr/bin/env node
const program = require('commander')

const {entry, add, remove, list, reset, command, setCommand, delCommand} = require('./src/main')

const package = require('./package.json')

program.version(package.version)
  .action(entry)

program.command('list')
  .alias('ls')
  .description('查看项目文件目录')
  .action(list)

program.command('add')
  .description('添加文件夹地址')
  .action(add)

program.command('remove')
  .description('移除文件夹地址')
  .action(remove)

program.command('command')
  .description('查看操作命令列表')
  .action(command)

program.command('set-command')
  .usage('set-command <key> <command> <description> ')
  .description('设置操作命令')
  .action(setCommand)

program.command('del-command')
  .description('设置操作命令')
  .action(delCommand)

program.command('reset')
  .description('设置操作命令')
  .action(reset)

program.parseAsync(process.argv)