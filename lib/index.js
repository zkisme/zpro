const program = require('commander')

program.command('list')
  .alias('ls')
  .description('查看项目文件目录')
  .action(async (script, options) => {
    console.log(script, options)
  })

program.parseAsync(process.argv)