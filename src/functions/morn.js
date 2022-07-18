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
    type: 'select',
    name: 'region',
    message: '居住的校区',
    choices: [
      { title: '科学校区', value: '科学校区' },
      { title: '东风校区', value: '东风校区' },
      { title: '禹州实习训练基地', value: '禹州实习训练基地' },
      { title: '校外走读', value: '校外走读' }
    ],
    initial: 0
  },
  {
    type: 'select',
    name: 'area',
    message: '宿舍区域',
    choices: [
      { title: '宿舍区', value: '宿舍区' },
      { title: '一区', value: '一区' },
      { title: '二区', value: '二区' },
      { title: '三区', value: '三区' },
      { title: '丰华区', value: '丰华区' },
      { title: '秋实区', value: '秋实区' },
      { title: '无', value: '无' }
    ],
    initial: 0
  },
  {
    type: 'text',
    name: 'build',
    message: '宿舍楼',
    initial: '8号楼'
  },
  {
    type: 'text',
    name: 'dorm',
    message: '宿舍号',
    initial: '1024'
  },
  {
    type: 'text',
    name: 'jz_province',
    message: '目前所在省',
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
    initial: '中原区'
  },
  {
    type: 'text',
    name: 'jz_address',
    message: '在i轻工大上定位所得结果'
  },
  {
    type: 'number',
    name: 'lon',
    message: () => {
      console.log('根据位置获取经纬度https://lbs.amap.com/demo/jsapi-v2/example/map/click-to-get-lnglat')
      return '经度'
    },
    initial: "113.508931"
  },
  {
    type: 'number',
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
      { title: '已接种', value: '已完成接种' }
    ],
    initial: 2
  },
  {
    type: 'number',
    name: 'hsjcqk',
    message: '10月以来本轮郑州疫情核酸检测次数(0-99)',
    initial: 0
  },
  {
    type: 'date',
    name: 'last_time',
    message: '最后一次检测时间',
    initial: new Date(2022, 6, 14)
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

exports.morningCheck = async (info) => {
  const response = await prompts(questions, {
    onCancel: () => {
      throw new Error(red('✖') + ' 操作取消')
    }
  });
  delete response.temperature
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