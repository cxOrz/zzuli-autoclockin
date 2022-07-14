const prompts = require('prompts');
const { red, lightGreen } = require('kolorist');
const { fetchInfo, login, addAttributes, postToSever } = require('./functions/user');
const { readSettings, readInfo, writeInfo, writeSettings } = require('./utils/file');
const { morningCheck } = require('./functions/morn');
const { homeCheck } = require('./functions/home');

(async () => {
  let tokens, info, global_flag = 0, localHomeInfo, localMornInfo, wj_type, answer
  // 读取配置
  let setting = JSON.parse(readSettings())
  // 检查在校晨检和居家打卡时否有本地信息
  localHomeInfo = JSON.parse(readInfo('home'))
  localMornInfo = JSON.parse(readInfo('morn'))
  try {
    answer = await prompts({
      type: 'select',
      name: 'wj_type',
      message: '选择打卡功能',
      choices: [
        { title: '晨检', value: 1 },
        { title: '居家打卡', value: 0 }
      ],
    })
    wj_type = answer.wj_type

    // 若有本地信息
    if (localHomeInfo.user_code && wj_type == 0) {
      answer = await prompts({
        type: 'confirm',
        name: 'last',
        message: '是否使用上次保存的信息?',
        initial: true
      })
      if (answer.last) {
        // 读取本地信息
        info = localHomeInfo
        global_flag = 1
      }
    } else if (localMornInfo.user_code && wj_type == 1) {
      answer = await prompts({
        type: 'confirm',
        name: 'last',
        message: '是否使用上次保存的信息?',
        initial: true
      })
      if (answer.last) {
        // 读取本地信息
        info = localMornInfo
        global_flag = 1
      }
    } else {
      // 若没有本地信息，没打过卡，需要先登录
      answer = await prompts({
        type: 'text',
        name: 'user_code',
        message: '学号'
      }, {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作取消')
        }
      })
      setting.user_code = answer.user_code
      answer = await prompts({
        type: 'text',
        name: 'password',
        message: '密码'
      }, {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作取消')
        }
      })
      setting.password = answer.password
    }

    // 登录，获取传来的各种token，其中包括code
    tokens = await login(setting.user_code, setting.password)
    setting.code = tokens.code

    // 登陆成功或有本地code
    if (setting.code) {
      // 不使用本地信息，则需要请求获取基本信息
      if (global_flag == 0) {
        info = await fetchInfo(setting.code, wj_type)
      }
      console.log(`你好，${info.user_name}`)
      console.log(`学号: ${info.user_code}`)
      console.log(`身份证: ${info.id_card}`)
      console.log(`性别: ${info.sex}`)
      console.log(`年龄: ${info.age}`)
      console.log(`学院: ${info.org}`)
      console.log(`年级: ${info.year}`)
      console.log(`专业: ${info.spec}`)
      console.log(`班级: ${info.class}`)
      console.log(`目前居住详细地址: ${info.province}${info.city}${info.district}${info.address}\n`)

      // 不使用本地信息，逐个填
      if (global_flag == 0) {
        // 晨检
        if (wj_type == 1) await morningCheck(info)
        // 居家
        else await homeCheck(info)
      }

      // 设置打卡时间
      answer = await prompts({
        type: 'confirm',
        name: 'auto',
        message: '是否设置定时自动打卡',
        initial: false
      })
      if (answer.auto) {
        answer = await prompts({
          type: 'number',
          name: 'h',
          message: '设置打卡时间，小时(0-23)',
          initial: 0
        })
        setting.h = answer.h
        answer = await prompts({
          type: 'number',
          name: 'm',
          message: '设置打卡时间，分钟(0-59)',
          initial: 3
        })
        setting.m = answer.m
        console.log(`你的打卡时间为每天${lightGreen(setting.h)}:${lightGreen(setting.m)}`)
        console.log('监听中，请勿终止本进程..')
        setInterval(async () => {
          const now = new Date()
          if (now.getMinutes() == setting.m && now.getHours() == setting.h) {
            addAttributes(info, wj_type)
            // 重新登录，更新身份凭证
            tokens = await login(setting.user_code, setting.password)
            postToSever(tokens, info, () => {
              if (wj_type == 0) {
                writeInfo(JSON.stringify(info), 'home')
                writeSettings(JSON.stringify(setting))
              } else {
                writeInfo(JSON.stringify(info), 'morn')
                writeSettings(JSON.stringify(setting))
              }
            })
          }
        }, 60000)
      } else {
        // 立即打卡
        addAttributes(info, wj_type)
        postToSever(tokens, info, () => {
          if (wj_type == 0) {
            writeInfo(JSON.stringify(info), 'home', () => { console.log('居家信息已写入本地！') })
            writeSettings(JSON.stringify(setting), () => { console.log('配置已写入本地！') })
          } else {
            writeInfo(JSON.stringify(info), 'morn', () => { console.log('晨检信息已写入本地！') })
            writeSettings(JSON.stringify(setting), () => { console.log('配置已写入本地！') })
          }
        })
      }
      // 登录成功的边界
    }
    else console.log('登陆失败，建议截图提交issue')
  } catch (e) {
    console.log(e.message)
  }
})()