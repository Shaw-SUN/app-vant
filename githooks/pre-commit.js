#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {exec} = require('./exec');
 /* Branch Naming Convention */

/* Check Forbidden Tokens */
// const FILES_REGEX = {ts: /\.ts$/, spec: /\.spec\.ts$/};
/** Map of forbidden tokens and their match regex */
const forbiddenTokens = {
  // fit: { rgx: /fit\(/, fileRgx: FILES_REGEX.spec},
  // fdescribe: { rgx: /fdescribe\(/, fileRgx: FILES_REGEX.spec},
  // ".skip": { rgx: /(describe|context|it)\.skip/, fileRgx: FILES_REGEX.spec},
  // ".only": { rgx: /(describe|context|it)\.only/, fileRgx: FILES_REGEX.spec},
  // debugger: { rgx: /(debugger);?/, fileRgx: FILES_REGEX.ts},
  "debugger": { rgx: /(vconsole);?/i, fileRgx: /.[html|js|vue|nj]$/},
  "tab character": { rgx: /(	);?/, fileRgx: /.[php|js|md|vue]$/},
};

let status = 0;

const gitCommand = `git diff --staged --name-only`;
const stagedFiles = exec(gitCommand).split('\n');

// vue文件名的首字母必须是大写
const vueFileRgx1 = /^[a-z][A-z0-9]*.vue$/;
const vueFileRgx2 = /\/[a-z][A-z0-9]*.vue$/;
const failedVueFiles = stagedFiles.filter((file) => {
  return vueFileRgx1.test(file.trim()) || vueFileRgx2.test(file.trim())
});
if (failedVueFiles.length > 0) {
  console.log('---- Error Info Begin ----');
  const msg = 'Filenames of vue components should be PascalCase';
  console.log(chalk.bgRed.black.bold(msg));
  console.log(chalk.bgRed.black(failedVueFiles.join('\n')));
  console.log('----  Error Info End  ----');
  process.exit(1);
}
// 检测是否含有禁止字符
for (let [term, value] of Object.entries(forbiddenTokens)) {
  const {rgx, fileRgx, message} = value;
  /* Filter relevant files using the files regex */
  const relevantFiles = stagedFiles.filter((file) => fileRgx.test(file.trim()));
  const failedFiles = relevantFiles.reduce((acc, fileName) => {
    const filePath = path.resolve(process.cwd(), fileName.replace('client/', ''));
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
      if (rgx.test(content)) {
        const ignoreFiles = [
          'githooks/pre-commit.js',
          'public/jsbridge.js',
          'src/assets/js/jsbridge.js',
          'package.json',
          'package-lock.json'
        ];
        if (ignoreFiles.indexOf(fileName) === -1) {
          acc.push(fileName);
        }
      }
    }
    return acc;
  }, []);

  /* Log all the failed failes for this token with the matching message */
  if (failedFiles.length > 0) {
    console.log('---- Error Info Begin ----');
    const msg = message || `The following files contains '${term}' in them:`;
    console.log(chalk.bgRed.black.bold(msg));
    console.log(chalk.bgRed.black(failedFiles.join('\n')));
    console.log('----  Error Info End  ----');
    process.exit(1);
  }
}

// 检测图片大小是否超限
// checkImageSize(path.resolve(__dirname, '../public/img'), 250)
checkImageSize(path.resolve(__dirname, '../src/assets/images'), 250)

function checkImageSize(filePath, limitSize) {
  const _file = fs.statSync(filePath)
  // 判断是否为文件夹
  if (_file.isDirectory()) {
    const dirArr = fs.readdirSync(filePath)
    dirArr.forEach(function(dirname) {
      checkImageSize(filePath + '/' + dirname, limitSize)
    })
  } else {
    const size = fs.statSync(filePath).size/1024
    if (size > limitSize) {
      console.log(chalk.bgRed.black.bold('文件大小超过' + limitSize + 'kb 路径:' + filePath ));
      process.exit(1);
    }
  }
}


process.exit(0);
