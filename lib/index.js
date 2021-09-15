const program = require('commander')

const {entry, add, remove, list} = require('./main')

const package = require('../package.json')

program.version(package.version)
  .action(entry)

program.command('list')
  .alias('ls')
  .description('查看项目文件目录')
  .action(async (script, options) => {
    console.log(script, options)
  })

program.command('add')
  .description('添加文件夹地址')
  .action(add)

program.command('remove')
  .description('移除文件夹地址')
  .action(() => {
    console.log('移除文件夹地址')
  })

program.parseAsync(process.argv)