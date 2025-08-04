// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // .envから読み込み
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,        // 接続待ちを許可
  connectionLimit: 10,             // 同時接続数の上限
  queueLimit: 0                    // 無制限キュー
});

//module.exportsで指定した値=poolを外部のファイルから読み込んで再利用することができる
module.exports = pool;
