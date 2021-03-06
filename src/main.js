const path = require('path')
const inquirer = require('inquirer')
const { execSync } = require('child_process');

const projectActionPath = path.resolve(process.env.APPDATA, 'zpro', '.actions.json')
const projectTempPath = path.resolve(process.env.APPDATA, 'zpro', '.projectList.json')

const {writeJSON, readDir, readFile} = require('./utils/file')

const reset = (filePath) => {
  const actions = require('./default/actions.json')
  const projectList = {}

  if(filePath === projectActionPath) writeJSON(projectActionPath, JSON.stringify(actions))
  else if(filePath === projectTempPath) writeJSON(projectTempPath, JSON.stringify(projectList))
  else {
    writeJSON(projectActionPath, JSON.stringify(actions))
    writeJSON(projectTempPath, JSON.stringify(projectList))
  }
}

const getJson = (filePath) => {
  try {
    return JSON.parse(readFile(filePath))
  } catch (error) {
    reset(filePath)
    return JSON.parse(readFile(filePath))
  }
}

const add = (script, options) => {
  const [key, projectUrl] = options.args
  let projectList = getJson(projectTempPath)
  projectList[key] = projectUrl
  writeJSON(projectTempPath, JSON.stringify(projectList))
  console.log(`add ${key} -- ${projectUrl} success`)
}

const remove = (script, options) => {
  let projectList = getJson(projectTempPath)
  const [key] = options.args
  delete projectList[key]
  writeJSON(projectTempPath, JSON.stringify(projectList))
  console.log(`remove ${key} success`)
}

const list = () => {
  const projectList = getJson(projectTempPath)
    let res = '\n'
    for(key in projectList) {
      res += `${key}`.padEnd(10, ' ') +  `${projectList[key]}\n`
    }
    console.log(res)
}

const entry = async () => {
  
  let projectList = getJson(projectTempPath)
  let projectActions = getJson(projectActionPath)

  // if(projectList && typeof projectList === 'string') projectList = JSON.parse(projectList)

  if(!projectList || !projectList.default) {
    const {projectDir} = await inquirer.prompt(
      {
        type: 'input',
        name: 'projectDir',
        validate: (str) => !!str,
        message: "?????????????????????????????????????????????" 
      }
    )
    projectList = {default: projectDir}
    writeJSON(projectTempPath, JSON.stringify(projectList))
  }
  

  const res = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'dir',
      message: '?????????????????????',
      when: () => Object.keys(projectList).length > 1,
      choices: () => Object.keys(projectList).map(x => ({name: x, value: projectList[x]}))
    },
    {
      type: 'rawlist',
      name: 'project',
      message: "????????????????????????????????????",
      pageSize: 10,
      loop: true,
      choices: async ({dir=projectList['default']} = {}) => {
        return readDir(dir)
      } 
    },
    {
      type: 'rawlist',
      name: 'action',
      message: '?????????????????????',
      choices: Object.keys(projectActions).map(key => ({name: projectActions[key].name, value: key}))
    },
  ])

  const {dir=projectList['default'], project, action} = res

  const projectPath = path.join(dir, project)


  let {name, command} = projectActions[action]
  command = command.replace(/__projectPath__/ig, projectPath)
  execSync(command)
  console.log(`finished ${name}`)
  
}

const command = () => {
  const actions = getJson(projectActionPath)
    let res = ''
    let i = 1
    for(key in actions) {
      res += (`${i}) ${key}:`.padEnd(20, ' ')) + (`desc:${actions[key].name}`.padEnd(30, ' ')) +  `${actions[key].command}\n`
    }
    console.log(res)
}

const setCommand = (script, options) => {
  const [key, command, desc] = options.args
  if(!key || !command) {
    console.log('\nset-command fail')
    return console.log('zpro set-command <key> <command> [description] \n')
  }
  const actions = getJson(projectActionPath)
  actions[key] = {name: desc, command}
  writeJSON(projectActionPath, JSON.stringify(actions))
}

const delCommand = (script, options) => {
  const [key] = options.args
  if(!key) {
    console.log('\ndel-command fail')
    return console.log('zpro del-command <key> \n')
  }
  const actions = getJson(projectActionPath)
  delete actions[key]
  writeJSON(projectActionPath, JSON.stringify(actions))
}

const openconfig = () => {
  execSync(`start ${path.join(process.env.AppData, 'zpro')}`)
}

module.exports = {
  entry, add, remove, list, reset,openconfig,
  command, setCommand, delCommand
}