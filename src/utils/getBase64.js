const CryptoJS = require("./crypto-js")
const { readInfo } = require("./file")

!async function () {
  let morn = readInfo('morn')
  let home = readInfo('home')
  if (morn.length > 10) {
    console.log('晨检：')
    console.log(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(morn)) + '\n')
  }
  if (home.length > 10) {
    console.log('居家：')
    console.log(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(home)) + '\n')
  }
  console.log('复制所需的内容，不要复制多余空格')
}()