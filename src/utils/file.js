const fs = require('fs')
const path = require('path')

exports.readSettings = () => {
  return fs.readFileSync(path.join(__dirname, '../json/setting.json'), 'utf-8')
}

exports.writeSettings = (data, callback = () => { }) => {
  fs.writeFile(path.join(__dirname, '../json/setting.json'), data, 'utf-8', callback)
}

exports.readInfo = (filename) => {
  return fs.readFileSync(path.join(__dirname, `../json/${filename}.json`), 'utf-8')
}

exports.writeInfo = (data, filename, callback = () => { }) => {
  fs.writeFile(path.join(__dirname, `../json/${filename}.json`), data, 'utf-8', callback)
}