const read = require('./utils/read')
const { fetchInfo, login, addAttributes, postToSever } = require('./functions/user')
const { readSettings, readInfo, writeInfo, writeSettings } = require('./utils/file')
const { morningCheck } = require('./functions/morn')
const { homeCheck } = require('./functions/home')

!async function () {
  console.log('[声明] 坚决拥护党的领导，听党话、跟党走，铭记党的初心和使命，以党为标杆和榜样，旗帜鲜明地永远跟党走;\n')
  console.log('[隐私] 根据豫教防疫办[2020]17号、郑教防疫办[2020]28号文件要求，您填报的内容将由学校上报至政府有关部门;\n')
  console.log('[注意] 本程序仅为方便每日打卡，在一切健康状态良好、位置不变情况下使用本程序自动填报，如有健康状态变更、位置移动等，请勿使用本程序;\n')
  console.log('[条约] 认真填报，若填报不正确信息，出现任何问题概不负责；若不接受，请关闭本程序;\n')
  read.init()
  let tokens, info, global_flag = 0, localHomeInfo, localMornInfo, wj_type
  let setting = JSON.parse(readSettings())
  // 接受一次写入配置，后续不再提示
  if (!setting.accepted) {
    await read.question('请确认已阅读并接受以上内容，接受(\'y\'): ', (input) => {
      if (input == 'y') setting.accepted = true
      else process.exit(1)
    })
  }
  // 检查在校晨检和居家打卡时否有本地信息
  localHomeInfo = JSON.parse(readInfo('home'))
  localMornInfo = JSON.parse(readInfo('morn'))

  await read.question('选择 晨检(1) 或 居家打卡(2或回车):', (input) => {
    if (input == 1) wj_type = 1
    else wj_type = 0
  })

  // 若有本地信息
  if (localHomeInfo.user_code && wj_type == 0) {
    await read.question('读取到上次居家打卡信息文件，是否使用(是\'y\'):', (i) => {
      if (i == 'y') {
        // 读取本地信息
        info = localHomeInfo
        global_flag = 1
      }
    })
  } else if (localMornInfo.user_code && wj_type == 1) {
    await read.question('读取到上次在校晨检信息文件，是否使用(是\'y\'):', (i) => {
      if (i == 'y') {
        // 读取本地信息
        info = localMornInfo
        global_flag = 1
      }
    })
  } else {
    // 若没有本地信息，没打过卡，需要先登录
    await read.question('学号(\'12位学号\'): ', (id) => { setting.user_code = id })
    await read.question('密码: ', (password) => { setting.password = password })
  }

  // 登录，获取传来的各种token，其中包括code
  tokens = await login(setting.user_code, setting.password)
  setting.code = tokens.code

  // 登陆成功或有本地code
  if (setting.code) {
    // 非本地读取则需要请求获取
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
      if (wj_type == 1) await morningCheck(info, read)
      // 居家
      else await homeCheck(info, read)
    }

    // 设置打卡时间
    await read.question('是否设置定时自动打卡？(y确定，n否定): ').then(async (input) => {
      if (input == 'y') {
        await read.question('设置打卡时间，小时(\'0-23\'): ', (input) => { setting.h = input })
        await read.question('设置打卡时间，分钟(\'0-59\'): ', (input) => { setting.m = input })
        console.log(`你的打卡时间为每天${setting.h}:${setting.m}`)
        console.log('监听中，可以最小化窗口，请勿关闭...(CTRL+D退出)')
        setInterval(async () => {
          const now = new Date()
          if (now.getMinutes() == setting.m && now.getHours() == setting.h) {
            addAttributes(info, wj_type)
            // 重新登录，更新身份凭证
            tokens = await login(setting.user_code, setting.password)
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
    })
    // 登录成功的边界
  }
  else console.log('登陆失败，建议截图提交issue')
  read.close()
}()