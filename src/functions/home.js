exports.homeCheck = async(info, read) => {
  await read.question('手机号: ', (i) => { info.mobile = i })
  await read.question('家长手机号: ', (i) => { info.jt_mobile = i })
  await read.question('输入所在省: ', (i) => { info.jz_province = i })
  await read.question('输入所在市/县: ', (i) => { info.jz_city = i })
  await read.question('输入所在区: ', (i) => { info.jz_district = i })
  await read.question('输入在i轻工大上定位所得结果: ', (i) => { info.jz_address = i })
  await read.question('以上输入的省、市、区，是否与i轻工大定位结果对应一致(\'y\'): ', (i) => {
    if (i == 'y') info.jz_sfyz = '是'
    else info.jz_sfyz = '否'
  })
  console.log('根据位置获取经纬度https://lbs.amap.com/demo/jsapi-v2/example/map/click-to-get-lnglat，必须与定位一致')
  await read.question('经纬度(\'如：113.508931,34.81148\',注意英文逗号): ', (input) => {
    info.lon = Number(input.substring(0, input.indexOf(',')))
    info.lat = Number(input.substring(input.indexOf(',') + 1, input.length))
    info.gcj_lon = info.lon
    info.gcj_lat = info.lat
  })
  await read.question('今日体温(正常\'y\'): ', (i) => {
    if (i != 'y')
      console.log('请到i轻工大填报！')
  })
  await read.question('有无新冠症状(无\'n\'): ', (i) => {
    if (i != 'n')
      console.log('请到i轻工大填报！')
  })
  await read.question('同住人员有无症状(无\'n\'): ', (i) => {
    if (i != 'n')
      console.log('请到i轻工大填报！')
  })
  await read.question('假期以来是否接触过确诊活疑似病例？是否被隔离过？(否\'n\'): ', (i) => {
    if (i != 'n')
      console.log('请到i轻工大填报！')
  })
  await read.question('你是否被确诊或疑似得过新冠？(否\'n\'): ', (i) => {
    if (i != 'n')
      console.log('请到i轻工大填报！')
  })
  await read.question('疫苗接种是否已完成？(未接种\'1\'，未完成\'2\'，已完成\'3\'): ', (i) => {
    switch (i) {
      case '2': info.jjymqk = '未完成接种'; break;
      case '3': info.jjymqk = '已完成接种'; break;
      default: info.jjymqk = '未接种'
    }
  })
  await read.question('10月以来核酸检测次数(\'0-99\'): ', (i) => {
    if (i <= 0) {
      info.hsjcqk = '未检测'
    } else if (i <= 6) {
      info.hsjcqk = `${i}次`
    } else info.hsjcqk = '更多次'
  })
  await read.question('最后一次检测时间，格式\'2022-01-02\'注意0，无\'n\'): ', (i) => {
    if (i == 'n') {
      info.last_time = ""
    } else info.last_time = i
  })
  await read.question('所在地风险等级(低风险\'1\'，中风险\'2\'，高风险\'3\'): ', (i) => {
    switch (i) {
      case 2: info.fxdj = '中风险'; break;
      case 3: info.fxdj = '高风险'; break;
      default: info.fxdj = '低风险'
    }
  })
  await read.question('所在区域管理分类(正常\'1\'，封闭区\'2\'，封控区\'3\'): ', (i) => {
    switch (i) {
      case 2: info.flgl = '封闭区'; break;
      case 3: info.flgl = '封控区'; break;
      default: info.flgl = '正常'
    }
  })
  await read.question('健康码状态(绿码\'1\'，黄色\'2\'，红色\'3\'): ', (i) => {
    switch (i) {
      case 2: info.jkmzt = '黄色'; break;
      case 3: info.jkmzt = '红色'; break;
      default: info.jkmzt = '绿色'
    }
  })
}