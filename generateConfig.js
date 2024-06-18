import fs from 'fs';
import dotenv from 'dotenv';

// 获取当前环境，默认为开发环境
// const environment = process.env.VITE_NODE_ENV || 'production';
const envFile = '.env.example';

// 读取对应的 .env 文件
dotenv.config({ path: envFile });

const config = {};

// 提取以 VITE_GLOBAL_ 开头的变量
for (const key in process.env) {
  if (key.startsWith('VITE_GLOBAL_')) {
    config[key] = process.env[key];
  }
}

// 调试输出
// console.log('提取的配置变量:', config);

// 生成 config.js 文件内容
const configContent = `window.__CONFIG__ = ${JSON.stringify(config, null, 2)}`;

// 写入 config.js 文件
fs.writeFileSync('public/app.config.js', configContent, 'utf8');

console.log('app.config.js 文件生成完毕！');