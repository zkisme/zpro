const fs = require('fs')

const isDir = (filePath) => {
  return fs.lstatSync(filePath).isDirectory()
}

const isExist = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true
  } catch (error) {
    return false
  }
}

const createDir = (dirPath) => {
  fs.mkdirSync(dir, {recursive: true})
}

const createFile = (filePath, content, options) => {
  if(!isDir) createDir(fs.lstatSync(filePath))
  fs.writeFileSync(filePath, content, {encoding:'utf-8', ...options})
}

const readFile = (filePath, options,creat, defaultContent = '') => {
  if(!isExist(filePath)) {
    if(creat) createFile(filePath, defaultContent)
    else return undefined
  }

  return fs.readFileSync(filePath, {encoding: 'utf-8', ...options})
}

const readDir = (dirPath, options) => {
  return fs.readdirSync(dirPath,{...options})
}

const writeFile = (filePath, content = '', options) => {
  fs.writeFileSync(filePath, content, {encoding: 'utf-8', ...options})
}

module.exports = { readFile, writeFile, readDir }

