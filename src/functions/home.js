const prompts = require('prompts')
const { red } = require('kolorist')
const questions = [
  {
    type: 'text',
    name: 'mobile',
    message: '你的手机号码'
  },
  {
    type: 'text',
    name: 'jt_mobile',
    message: '家长的手机号码'
  },
  {
    type: 'text',
    name: 'jz_province',
    message: '你目前所在省',
    initial: '河南省'
  },
  {
    type: 'text',
    name: 'jz_city',
    message: '所在市或县',
    initial: '郑州市'
  },
  {
    type: 'text',
    name: 'jz_district',
    message: '所在区',
    initial: '金水区'
  },
  {
    type: 'text',
    name: 'jz_address',
    message: '在i轻工大上定位所得结果'
  },
  {
    type: 'text',
    name: 'lon',
    message: () => {
      console.log('根据位置获取经纬度https://lbs.amap.com/demo/jsapi-v2/example/map/click-to-get-lnglat，必须与定位一致')
      return '经度'
    },
    initial: "113.508931"
  },
  {
    type: 'text',
    name: 'lat',
    message: '纬度',
    initial: "34.81148"
  },
  {
    type: 'confirm',
    name: 'temperature',
    message: '自身和同住人员健康状态一切正常?',
    initial: true
  },
  {
    type: 'select',
    name: 'jjymqk',
    message: '疫苗接种情况',
    choices: [
      { title: '未接种', value: '未接种' },
      { title: '未完成', value: '未完成接种' },
      { title: '已接种', value: '已完成接种' },
      { title: '已完成加强针', value: '已完成加强针' }
    ],
    initial: 2
  },
  {
    type: 'number',
    name: 'hsjcqk',
    message: '10月以来本轮郑州疫情核酸检测次数(0-99)',
    initial: 7
  },
  {
    type: 'date',
    name: 'last_time',
    message: '最后一次检测时间',
    initial: new Date(2022, 6, 14)
  },
  {
    type: 'select',
    name: 'last_result',
    message: '最后一次检测结果',
    choices: [
      { title: '阴性', value: '阴性' },
      { title: '阳性', value: '阳性' }
    ],
    initial: 0
  },
  {
    type: 'select',
    name: 'fxdj',
    message: '所在地风险等级',
    choices: [
      { title: '低风险', value: '低风险' },
      { title: '中风险', value: '中风险' },
      { title: '高风险', value: '高风险' }
    ],
    initial: 0
  },
  {
    type: 'select',
    name: 'flgl',
    message: '所在区域管理分类',
    choices: [
      { title: '正常', value: '正常' },
      { title: '封闭区', value: '封闭区' },
      { title: '封控区', value: '封控区' }
    ],
    initial: 0
  },
  {
    type: 'select',
    name: 'jkmzt',
    message: '健康码状态',
    choices: [
      { title: '绿色', value: '绿色' },
      { title: '黄色', value: '黄色' },
      { title: '红色', value: '红色' }
    ],
    initial: 0
  },
];

exports.homeCheck = async (info) => {
  const response = await prompts(questions, {
    onCancel: () => {
      throw new Error(red('✖') + ' 操作取消')
    }
  });
  delete response.temperature
  response.lon = Number(response.lon)
  response.lat = Number(response.lat)
  Object.assign(info, response)
  info.gcj_lon = response.lon
  info.gcj_lat = response.lat
  // 核酸检测次数
  if (info.hsjcqk <= 0) {
    info.hsjcqk = '未检测'
  } else if (info.hsjcqk <= 6) {
    info.hsjcqk = `${info.hsjcqk}次`
  } else info.hsjcqk = '更多次'
  // 最后检测时间
  info.last_time = `${info.last_time.getFullYear()}-${info.last_time.getMonth() + 1}-${info.last_time.getDate()}`
}