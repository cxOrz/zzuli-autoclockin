exports.morningCheck = async (info, read) => {
  await read.question('手机号: ', (i) => { info.mobile = i })
  await read.question('家长手机号: ', (i) => { info.jt_mobile = i })
  await read.question('居住的校区(\'科学校区、东风校区、校外走读...\'，禹州请打开i轻工大看着里面的字段一致填写): ', (i) => {
    info.region = i
  })
  await read.question('宿舍区(科学校区填写\'宿舍区\'，东风填写\'一区、二区、丰华区...\'，走读写\'无\'，禹州请打开i轻工大看着里面的字段一致填写): ', (i) => {
    info.area = i
  })
  await read.question('楼号(科学、东风校区填写\'1号楼、2号楼...\'，走读写\'无\'，禹州请打开i轻工大看着里面的字段一致填写): ', (i) => {
    info.build = i
  })
  await read.question('宿舍号(例如\'911\'): ', (i) => {
    info.dorm = i
  })
  await read.question('输入居住省(河南省): ', (i) => { info.jz_province = i })
  await read.question('输入居住市/县(郑州市): ', (i) => { info.jz_city = i })
  await read.question('输入居住区(中原区、金水区...): ', (i) => { info.jz_district = i })
  await read.question('输入在i轻工大上定位所得结果(河南省郑州市中原区郑州轻工业大学软件学院): ', (i) => { info.jz_address = i })
  await read.question('以上输入的省、市、区，是否与i轻工大定位结果对应一致(\'y\'): ', (i) => {
    if (i == 'y') info.jz_sfyz = '是'
    else info.jz_sfyz = '否'
  })
  console.log('经纬度查询https://lbs.amap.com/demo/jsapi-v2/example/map/click-to-get-lnglat，必须与定位一致')
  await read.question('所在经纬度(\'如：113.508273,34.811716\',注意英文逗号): ', (input) => {
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
  await read.question('是否被隔离过？(否\'n\'): ', (i) => {
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
  await read.question('10月以来本轮郑州疫情核酸检测次数(\'0-99\'): ', (i) => {
    if (i <= 0) {
      info.hsjcqk = '未检测'
    } else if (i <= 6) {
      info.hsjcqk = `${i}次`
    } else info.hsjcqk = '更多次'
  })
  await read.question('最后一次检测时间，格式\'2022-02-18\'注意0，无\'n\'): ', (i) => {
    if (i == 'n') {
      info.last_time = ""
    } else info.last_time = i
  })
  await read.question('健康码状态(绿码\'1\'，黄色\'2\'，红色\'3\'): ', (i) => {
    switch (i) {
      case 2: info.jkmzt = '黄色'; break;
      case 3: info.jkmzt = '红色'; break;
      default: info.jkmzt = '绿色'
    }
  })
}