<h1 align="center">🎉 i 轻工大疫情打卡工具 🎉</h1>
<p align="center">
  <img src="https://img.shields.io/badge/nodejs->=v12.16-brightgreen.svg" />
  <img src="https://github.com/cxOrz/zzuli-autoclockin/actions/workflows/node.js.yml/badge.svg" />
</p>

基于 Nodejs ，实现自动填报健康状态。

**功能**： 支持在校晨检、居家，可设置定时任务，提交信息和凭证默认缓存在本地，若信息不变，无需再次录入；若未填报将以邮件形式通知；

**为了与仓库保持同步，请不定期运行 `git pull` 更新代码**。


## 环境 💻

运行环境 Nodejs > v12.16，[Nodejs下载](https://nodejs.org/en/)

安卓、Windows、Linux ... 只要可以运行 Nodejs

## 命令
`npm start`：运行程序，进行信息填报。

`npm run encrypt`：对填报信息进行 Base64 编码，输出到控制台。

`npm run action`：在 Github Action 执行的填报命令。

`npm run remind`：运行状态监测服务，每日 0:10 进行状态检测，未填报则发送邮件通知。

## 使用 🛠

### 方式一

在本地运行，比较简单，只需两步。

1、将仓库克隆到本地，进入项目目录安装依赖

```bash
git clone https://github.com/cxOrz/zzuli-autoclockin.git && 
cd zzuli-autoclockin && npm install
```

2、运行

```bash
npm run start
```

### 方式二

在服务器上部署，下列步骤以 Ubuntu21.04 为例。

1. 使用ssh连接服务器，并克隆项目到服务器，假定你已克隆到 `~/zzuli-autoclockin` 目录。
2. 运行 `sudo apt install screen` ，安装 screen 是为了后台运行本程序，以免断了ssh连接时程序也中断。
3. 运行 `screen -S zzuli` 创建一个会话，我们要在这里面运行打卡程序。
4. 进入项目目录，运行 `npm start` 进行打卡信息、时间设定，时间可以设为0点3分，学校的服务器时间要慢一两分钟，不放心可在睡前用手机看看是否已填报。
5. 看到这样的输出就可以关闭ssh连接了，静候打卡成功：
```
你的打卡时间为每天0:3
监听中，可以最小化窗口，请勿关闭...(CTRL+D退出)
```

### 方式三

方便，利用 GitHub Actions 执行 Nodejs CI 定时任务，但需要细心和一定动手能力。

1. fork 本仓库  
fork 完成后请在 Actions 中**开启**`Github Action`，并点击 `NodeJS CI` 任务，**启用**此任务。
建议在 fork 后，将自己的仓库设置为私有，以免个人信息公开可见。若不想设置私有，可在每次上传代码之前，清空json文件夹下所有文件的内容，均写为 `{}`。

2. 将你的仓库克隆到你的电脑

```bash
git clone 你的仓库地址
```

3. 在电脑上先进行一次填报，目的是将你的信息记录，并在下一步进行编码。如何运行，参考方式一。

4. 填报完成后，运行 `npm run encrypt` ，根据上一步填报的内容，将输出晨检(MORNINFO)或是居家信息(HOMEINFO)的Base64编码，复制你需要的，将在下一步中使用。

5. 在浏览器中进入你的仓库 Settings-->Secrets，右上方 `New repository secret` ，依次点击添加：`ZZULI_USERNAME` 值为智慧门户用户名， `ZZULI_PASSWORD` 值为门户密码， `MORNINFO` 值为上一步复制的晨检信息编码， `HOMEINFO` 值为上一步复制的居家信息编码。（MORNINFO 和 HOMEINFO 打哪种卡添加哪个，用不到的可以暂时不添加，请不要复制多余空格）
![设置](./docs/secrets.png)

6. 在Github上编辑项目的 .github/workflows文件夹下的 `node.js.yml` 文件，注意缩进，不正确的缩进将出现语法错误。
![配置文件](./docs/yml-config.png)

- 使用的格林威治时间，比北京时间早8小时，如果设置早上07:25执行，则应写为 '25 23 * * *' ，图片测试时截的，懒得更新了
- 具体cron语法 https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#schedule
- 在校晨检设置 type 参数为 1 ，居家填报设置 type 参数为 0
- 自己使用时，请将 on 后的 `push:` 与 `pull request:` 删除，这是测试CI时用的，否则你也将在提交或 merge pull request 时执行任务

7. 完成以上步骤后，commit 并 push ，任务将在指定时间执行，可在你仓库的 Actions 中查看运行结果
![](./docs/actions.png)

## 重要 ❗

坚决拥护党的领导，听党话、跟党走，铭记党的初心和使命，以党为标杆和榜样，旗帜鲜明地永远跟党走;根据豫教防疫办[2020]17号、郑教防疫办[2020]28号文件要求，您填报的内容将由学校上报至政府有关部门;本程序仅为方便每日打卡，在一切健康状态良好、位置不变情况下使用本程序自动填报，如有健康状态变更、位置移动等，请勿使用本程序;认真填报，若填报不正确信息，出现任何问题概不负责；若不接受，请不要使用;

## 灵感

迸发于 2021.9.23 ，由于上午忘记打卡，直接被拉入黑榜。
