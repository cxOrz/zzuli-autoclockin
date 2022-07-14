const { getUserInfo, msg_xsc, add, log } = require("../api/config")
const https = require('https')
const http = require('http')
const CryptoJS = require('../utils/crypto-js')
const { lightGreen, blue } = require('kolorist')

exports.user = {
  user_code: null,
  password: null,
}

exports.fetchInfo = async (code, wj_type) => {
  let data = ''
  return new Promise((resolve) => {
    https.get(`${getUserInfo}code=${code}&wj_type=${wj_type}`, (res) => {
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', resolve)
    })
  }).then(() => {
    return JSON.parse(data)
  })
}

// 登录获取打卡code
exports.login = (id, password) => {
  return new Promise((resolve) => {
    let data = ''
    let lt, excution
    let JSESSIONID, client
    // 第一步请求
    // 获得 lt, excution, JSESSIONID, client
    let date = new Date().toLocaleDateString().replace(/\//g, '-')
    if (date.substring(date.indexOf('-') + 1, date.lastIndexOf('-')).length == 1) {
      date = date.replace('-', '-0')
    }
    if (date.substring(date.lastIndexOf('-') + 1, date.length).length == 1) {
      date = date.slice(0, date.length - 1) + '0' + date.charAt(date.length - 1)
    }

    http.get(msg_xsc + date, (res) => {
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        lt = data.substring(data.indexOf('LT-'), data.indexOf('-jinghua') + 8)
        excution = data.substring(data.indexOf(`execution" value="`) + 18, data.indexOf('value="e') + 11)
        JSESSIONID = res.rawHeaders[9].substring(res.rawHeaders[9].indexOf('=') + 1, res.rawHeaders[9].indexOf(';'))
        client = res.rawHeaders[21].substring(res.rawHeaders[21].indexOf('=') + 1, res.rawHeaders[21].indexOf(';'))
        // console.log(res.rawHeaders[9]) // JSESSIONID
        // console.log(res.rawHeaders[21]) // client

        // 第二步请求
        // 获得 CASTGC, location
        let CASTGC, location
        let content = `username=${id}&password=${password}&lt=${lt}&execution=${excution}&_eventId=submit`
        const reqCASTGC = http.request(msg_xsc + date, {
          method: 'POST',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length,
            'Cookie': `client=${client};JSESSIONID=${JSESSIONID};username=null;password=null`,
            'Host': 'kys.zzuli.edu.cn',
            'Origin': 'http://kys.zzuli.edu.cn',
            'Pragma': 'no-cache',
            'Referer': msg_xsc + date,
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 12.0; Pixel 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36'
          }
        }, (res) => {
          res.on('data', (chunk) => {
            data += chunk
          })
          res.on('end', () => {
            CASTGC = res.headers['set-cookie'][1].substring(7, res.headers['set-cookie'][1].indexOf(';'))
            // console.log(CASTGC)
            location = res.headers.location
            // console.log(location)

            // 第三步请求
            // 获得PHPSESSID, location
            let PHPSESSID
            http.get(location, (res) => {
              res.on('data', (chunk) => {
                data += chunk
              })
              res.on('end', () => {
                PHPSESSID = res.headers['set-cookie'][1].substring(10, res.headers['set-cookie'][1].indexOf(';'))
                location = res.headers.location
                // console.log(PHPSESSID)
                // console.log(res.headers.location)

                // 第四步请求
                // 获得 location, 从location中提取标识码
                http.get(location, {
                  headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'max-age=0',
                    'Cookie': `PHPSESSID=${PHPSESSID}`,
                    'Host': 'msg.zzuli.edu.cn',
                    'Proxy-Connection': 'keep-alive',
                    'Referer': 'http://kys.zzuli.edu.cn/',
                    'Pragma': 'no-cache',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 12.0; Pixel 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36'
                  }
                }, (res) => {
                  res.on('data', (chunk) => {
                    data += chunk
                  })
                  res.on('end', () => {
                    let obj = {}
                    obj.code = res.rawHeaders[13].substring(res.rawHeaders[13].indexOf('code=') + 5, res.rawHeaders[13].length)
                    location = res.headers.location

                    // 第五步请求
                    // 获得以下两个东西，用于打卡
                    let XSRF_TOKEN, laravel_session
                    https.get(location, (res) => {
                      res.on('data', (chunk) => { data += chunk })
                      res.on('end', () => {
                        XSRF_TOKEN = res.headers['set-cookie'][0].substring(11, res.headers['set-cookie'][0].indexOf(';'))
                        laravel_session = res.headers['set-cookie'][1].substring(16, res.headers['set-cookie'][1].indexOf(';'))
                        // console.log(XSRF_TOKEN)
                        // console.log(laravel_session)
                        obj.XSRF_TOKEN = XSRF_TOKEN
                        obj.laravel_session = laravel_session
                        obj.PHPSESSID = PHPSESSID
                        // 把各种token都传出去
                        // console.log(obj)
                        resolve(obj)
                      })
                    })
                  })
                })
              })
            })
          })
        })
        reqCASTGC.write(content)
        reqCASTGC.end()
      })
    })
  })
}

// data 
exports.postToSever = (tokens, data, success = () => { }) => {
  const req = https.request(add, {
    method: 'POST',
    headers: {
      'Host': 'msg.zzuli.edu.cn',
      'Connection': 'keep-alive',
      'Accept': 'application/json, text/plain, */*',
      'X-XSRF-TOKEN': tokens.XSRF_TOKEN.replace(/\%3D/g, '='),
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
      'Content-Type': 'application/json;charset=UTF-8',
      'Origin': `https://msg.zzuli.edu.cn`,
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cookie': `PHPSESSID=${tokens.PHPSESSID}; XSRF-TOKEN=${tokens.XSRF_TOKEN};laravel_session=${tokens.laravel_session}`
    }
  }, (res) => {
    let content = ''
    res.on('data', (chunk) => {
      content += chunk
    })
    res.on('end', () => {
      // console.log(content)
      let rs = JSON.parse(content)
      if (rs.code == 0) {
        console.log(lightGreen(new Date().toLocaleTimeString()) + ' 已完成打卡，查看' + blue(this.successLogUrl(data.user_code)))
        // 执行传入的回调函数
        success()
      } else console.log('打卡失败')
    })
  })
  req.write(JSON.stringify(data), 'utf-8')
  req.end()
}

exports.successLogUrl = (user_code) => {
  let key = CryptoJS.enc.Utf8.parse('1234567887654321');
  let encrypted = CryptoJS.AES.encrypt(user_code, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  }).toString();
  return log + encodeURIComponent(encrypted);
}

exports.addAttributes = (obj, wj_type) => {
  // 处理date，补零
  let date = new Date()
  date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  if (date.substring(date.indexOf('-') + 1, date.lastIndexOf('-')).length == 1) {
    date = date.replace('-', '-0')
  }
  if (date.substring(date.lastIndexOf('-') + 1, date.length).length == 1) {
    date = date.slice(0, date.length - 1) + '0' + date.charAt(date.length - 1)
  }
  // 判断在校晨检还是居家打卡
  if (wj_type == 0) {
    obj.date = date
    obj.region = ''
    obj.area = ''
    obj.build = ''
    obj.dorm = ''
    obj.hj_province = ''
    obj.hj_city = ''
    obj.hj_district = ''
    obj.out = '否'
    obj.out_address = [{ start_date: "", end_date: "", province: "", city: "", district: "", area: "", address: "" }]
    obj.hb = '否'
    obj.hb_area = ''
    obj.hn = '否'
    obj.hn_area = ''
    obj.sj_province = ''
    obj.sj_city = ''
    obj.sj_district = ''
    obj.temp = '正常'
    obj.jrzz = '无'
    obj.jzqk = ''
    obj.stzk = '无'
    obj.jcbl = '否'
    obj.jcqk = ''
    obj.yqgl = '否'
    obj.glrq = ''
    obj.gljc = ''
    obj.glp = ''
    obj.glc = ''
    obj.gld = ''
    obj.gla = ''
    obj.glyy = ''
    obj.other = ''
    obj.no_yy = ''
    obj.no_jtyy = ''
    obj.glztlb = ''
    obj.hb_date = ''
    obj.jz_qzbl = ''
    obj.tz_qzbl = ''
    obj.tz_province = ''
    obj.tz_city = ''
    obj.tz_district = ''
    obj.tz_area = ''
    obj.tz_address = ''
    obj.jc_yqjc = ''
    obj.jc_jcrq = ''
    obj.jc_province = ''
    obj.jc_city = ''
    obj.jc_district = ''
    obj.jc_area = ''
    obj.jc_address = ''
    obj.qz_yqbl = '否'
    obj.qz_yqrq = ''
    obj.zl_province = ''
    obj.zl_city = ''
    obj.zl_district = ''
    obj.zl_area = ''
    obj.zl_address = ''
    obj.zl_sfzy = ''
    obj.zl_zyrq = ''
    obj.xq_province = ''
    obj.xq_city = ''
    obj.xq_district = ''
    obj.xq_area = ''
    obj.xq_address = ''
    obj.home_time = ''
    obj.jz_sfyz = "是"
    obj.wj_type = 0
  }
  else if (wj_type == 1) {
    obj.date = date
    obj.out = ""
    obj.out_address = "[]"
    obj.hb = ""
    obj.hb_area = ""
    obj.hn = ""
    obj.hn_area = ""
    obj.sj_province = ""
    obj.sj_city = ""
    obj.sj_district = ""
    obj.temp = '正常'
    obj.jrzz = '无'
    obj.jzqk = ''
    obj.stzk = '无'
    obj.jcbl = ''
    obj.jcqk = ''
    obj.yqgl = '否'
    obj.glrq = ""
    obj.gljc = ""
    obj.glp = ""
    obj.glc = ""
    obj.gld = ""
    obj.gla = ""
    obj.glyy = ""
    obj.other = ""
    obj.no_yy = ""
    obj.no_jtyy = ""
    obj.hb_date = ""
    obj.jz_qzbl = ""
    obj.tz_qzbl = ""
    obj.tz_province = ""
    obj.tz_city = ""
    obj.tz_district = ""
    obj.tz_area = ""
    obj.tz_address = ""
    obj.jc_yqjc = ""
    obj.jc_jcrq = ""
    obj.jc_province = ""
    obj.jc_city = ""
    obj.jc_district = ""
    obj.jc_area = ""
    obj.jc_address = ""
    obj.qz_yqbl = "否"
    obj.qz_yqrq = ""
    obj.zl_province = ""
    obj.zl_city = ""
    obj.zl_district = ""
    obj.zl_area = ""
    obj.zl_address = ""
    obj.zl_sfzy = ""
    obj.zl_zyrq = ""
    obj.xq_province = ""
    obj.xq_city = ""
    obj.xq_district = ""
    obj.xq_area = ""
    obj.xq_address = ""
    obj.home_time = ""
    // 省、市、区，是否与i轻工大定位结果对应一致
    obj.jz_sfyz = "是"
    obj.wj_type = 1
  }
}