'use strict';

module.exports = core;
const semver = require('semver');
const colors = require('colors');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const pkg = require('../package.json');
let args;
checkInputArgs();
const log = require('@rigger-cli/log');
const contants = require('./const');

async function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkUserHome()
        checkEnv()
        await checkGlobalUpdate()
    } catch (error) {
        console.error(error.message)
    }
}
function checkNodeVersion(){
    const currentVersion = process.version
    const lowestVersion = contants.LOWER_NODE_VERSION
    if(!semver.gte(currentVersion,lowestVersion)) {
        throw new Error(colors.red(`rigger-cli 需要安装 v${lowestVersion} 以上版本的 Node`))
    }
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
      throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}
function checkPkgVersion() {
    log.info('cli', pkg.version);
}

function checkInputArgs(){
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    checkArgs()
}

function checkArgs(){
    if(args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
}

function checkEnv(){
    const dotenv = require('dotenv')
    let config = dotenv.config({})
    log.verbose('环境变量',config)
}

// 更新包
async function checkGlobalUpdate(){
    const currentVersion = pkg.version
    const npmName = pkg.name
    const getNpmInfo = require('@rigger-cli/get-npm-info')
    const data = await getNpmInfo(npmName)
    console.log('******',data)
}