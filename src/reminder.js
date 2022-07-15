const nodemailer = require("nodemailer");
const prompts = require('prompts');
const { blue, red } = require('kolorist')
const { successLogUrl, reminderCheck } = require('./functions/user');
const { readSettings, writeSettings } = require('./utils/file');

const questions = [
  {
    type: 'text',
    name: 'host',
    message: 'SMTP服务器',
    initial: 'smtp.qq.com'
  },
  {
    type: 'confirm',
    name: 'ssl',
    message: '是否启用SSL',
    initial: true
  },
  {
    type: 'number',
    name: 'port',
    message: '端口号',
    initial: 465
  },
  {
    type: 'text',
    name: 'user',
    message: '邮件账号',
    initial: 'xxxxxxxxx@qq.com'
  },
  {
    type: 'text',
    name: 'pass',
    message: '授权码(密码)'
  },
  {
    type: 'text',
    name: 'to',
    message: '接收邮箱'
  }
]
let setting = JSON.parse(readSettings());

(async () => {
  if (setting.mailing.pass === "" || !setting.mailing.pass) {
    try {
      const response = await prompts(questions, {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作取消')
        }
      });
      setting.mailing.host = response.host;
      setting.mailing.ssl = response.ssl;
      setting.mailing.port = response.port;
      setting.mailing.user = response.user;
      setting.mailing.pass = response.pass;
      setting.mailing.to = response.to;
    } catch (err) {
      console.log(err.message);
      process.exit(0);
    }
  }

  let transporter = nodemailer.createTransport({
    host: setting.mailing.host,
    port: setting.mailing.port,
    secure: setting.mailing.ssl,
    auth: {
      user: setting.mailing.user,
      pass: setting.mailing.pass,
    },
  });
  if (setting.user_code === "" || !setting.user_code) {
    try {
      setting.user_code = (await prompts({
        type: 'text',
        name: 'user_code',
        message: '学号'
      }, {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作取消')
        }
      })).user_code;
    } catch (err) {
      console.log(err.message);
      process.exit(0);
    }
  }
  writeSettings(JSON.stringify(setting));

  console.log(blue('「监测中」 每天 0:10 检查，若未填报将以邮件通知...'))

  setInterval(async () => {
    let now = new Date()
    // 每天 0:10 检测打卡状态
    if (now.getMinutes() === 10 && now.getHours() === 0) {
      const status = await reminderCheck(successLogUrl(setting.user_code));
      if (!status) {
        await transporter.sendMail({
          from: `"Reminder" <${setting.mailing.user}>`,
          to: setting.mailing.to,
          subject: "✖ 疫情打卡",
          html: '<strong style="color:orangered;">健康状态未填报，请注意！</strong>'
        });
        console.log(red('✖ 尚未填报 ') + now.toLocaleTimeString())
      } else {
        console.log(blue('✔ 检测通过 ') + now.toLocaleTimeString())
      }
    }
    now = null;
  }, 60000)
})().catch(console.error);
