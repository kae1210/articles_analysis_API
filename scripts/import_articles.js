
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
    const rows = fileContent.split('\n').slice(1); // ヘッダー行を除外
  
    console.log(`Importing ${rows.length} rows from ${filePath}`);
  
    rows.forEach((row, idx) => {
      if (!row.trim()) return; // 空行スキップ
  
      const columns = row.split(',');
      if (columns.length < 9) {
        console.log(`Line ${idx+2}: skipped (columns=${columns.length})`);
        return;
      }
  
      const sql = `
        INSERT INTO ${tableName}
        (title, body, published_at, author_id, genre_id, pv, referrer, keywords)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = columns.slice(1, 9).map(v => v.trim());
  
      connection.query(sql, params, (err, results) => {
        if (err) {
          console.error(`Error inserting row ${idx+2}:`, err.message);
          return;
        }
        console.log(`Inserted row ${idx+2}: ID=${results.insertId}`);
      });
    });
  };
  
  const articlesCSV = path.join(__dirname, 'data', 'articles.csv');
  importCSV(articlesCSV, 'articles');

connection.end();
