<h1 align="center">🎉 i 轻工大健康填报自动化 🎉</h1>
<p align="center">
  <img src="https://img.shields.io/badge/nodejs->=8.5.4-brightgreen.svg" />
</p>

基于 Nodejs ，实现自动考勤打卡，无需每日定闹钟提醒自己，无需担心被拉入黑群，也无需担心忘记打卡被点名批评。

**功能**： 支持在校晨检、居家打卡，可设置定时打卡任务，记录提交信息，若信息不变，无需再次录入；登录后无需再次输入凭证，默认记住密码。

**请确保在 i 轻工大上至少填报过一次**。


## 环境 💻

运行环境 Nodejs > v8.5.4，[Nodejs下载](https://nodejs.org/en/)

安卓、Windows、Linux ... 只要可以运行 Nodejs

## 安装 🛠

将仓库克隆到本地

```bash
git clone https://github.com/miaochenxi/iqgd-autoclockin.git
```

进入项目文件夹

```bash
cd iqgd-autoclockin
```

运行

```bash
npm run start
```

或者
```bash
cd src
node index.js
```

## 运行 ⚙

`y` 一般对应确认，`n` 对应否定，什么都不输入按回车认定为与括号提示中相反的语义

![图片1](./docs/1.png)
![图片2](./docs/2.png)
![图片3](./docs/3.png)

## 重要 ❗

[声明] 坚决拥护党的领导，听党话、跟党走，铭记党的初心和使命，以党为标杆和榜样，旗帜鲜明地永远跟党走;

[隐私] 根据豫教防疫办[2020]17号、郑教防疫办[2020]28号文件要求，您填报的内容将由学校上报至政府有关部门;

[注意] 本程序仅为方便每日打卡，在一切健康状态良好、位置不变情况下使用本程序自动填报，如有健康状态变更、位置移动等，请勿使用本程序;

[条约] 认真填报，若填报不正确信息，出现任何问题概不负责；若不接受，请不要使用;