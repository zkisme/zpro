const path = require('path')
const inquirer = require('inquirer')
const { execSync } = require('child_process');

const {readFile, writeFile, readDir} = require('./utils/file')

const add = (script, options) => {
  const [projectUrl] = options.args
}

const remove = () => {

}

const list = () => {

}

const entry = async () => {
  const projectTempPath = path.resolve(__dirname, '../temp/projectList.json')
  let projectList = readFile(projectTempPath)

  if(!projectList) {
    const {projectDir} = await inquirer.prompt(
      {
        type: 'input',
        name: 'projectDir',
        message: "请输入项目文件夹的绝对路径" 
      }
    )
    projectList = {default: projectDir}
    writeFile(projectTempPath, JSON.stringify(projectList))
  }
  
  if(typeof projectList === 'string') projectList = JSON.parse(projectList)
  

  const res = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'dir',
      message: '选择项目文件夹',
      choices: () => Object.keys(projectList).map(x => ({name: x, value: projectList[x]}))
    },
    {
      type: 'rawlist',
      name: 'project',
      message: "选择项目（可以输入序号）",
      pageSize: 10,
      loop: true,
      choices: async ({dir=projectList['default']} = {}) => {
        return readDir(dir)
      } 
    },
    {
      type: 'rawlist',
      name: 'action',
      message: '选择项目文件夹',
      choices: [
        {name: '进入cmd', value: 1},
        {name: 'vscode打开', value: 2},
        {name: '打开文件夹目录', value: 3}
      ]
    },
  ])

  const {dir, project, action} = res

  const projectPath = path.join(dir, project)

  switch(action) {
    case 1:
      execSync(`start cmd.exe /k cd ${projectPath}`)
      console.log('已打开命令行窗口')
      break
    case 2:
      execSync(`code ${projectPath}`)
      console.log('已打开vscode窗口')
      break
    case 3:
      execSync(`start ${projectPath}`)
      console.log(`已打开${projectPath}文件夹`)
      break
  }
  
}

module.exports = {entry, add, remove, list}