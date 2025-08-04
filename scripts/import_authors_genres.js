require('dotenv').config({ path: '.env' });
// このスクリプトでは events_analysis_API直下の .env を読み込み


const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect();

const importCSV = (filePath, tableName) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rows = fileContent.split('\n').slice(1); // ヘッダーを除く
  rows.forEach(row => {
    if (!row.trim()) return;    // 空行をスキップ
    const columns = row.split(',');
    if (!columns[1]) return;    // name カラムがない行をスキップ
  
    const name = columns[1].trim();
    const sql = `INSERT INTO ${tableName} (name) VALUES (?)`;
    connection.query(sql, [name], (err) => {
      if (err) throw err;
    });
  });  
};

const authorsCSV = path.join(__dirname, 'data', 'authors.csv');
const genresCSV = path.join(__dirname, 'data', 'genres.csv');

importCSV(authorsCSV, 'authors');
importCSV(genresCSV, 'genres');

connection.end();
