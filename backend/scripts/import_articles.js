// CSVファイルをMySQLにインポートするスクリプト
// - 軽いバリデーションを実施（必須項目・日付・数値チェック）
// - 不正行はスキップし、理由をログ出力する

require('dotenv').config({ path: '.env' });
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
  const rows = fileContent.split('\n').slice(1); // 1行目はヘッダー

  console.log(`Importing ${rows.length} rows from ${filePath}`);

  rows.forEach((row, idx) => {
    if (!row.trim()) return; // 空行スキップ

    const columns = row.split(',');
    if (columns.length < 9) {
      console.log(`Line ${idx + 2}: skipped (expected 9 columns, got ${columns.length})`);
      return;
    }

    const [
      id, title, body, published_at,
      author_id, genre_id, pv, referrer, keywords
    ] = columns.map(v => v.trim());

    // --- 軽いバリデーション ---
    if (!title || !body) {
      console.log(`Line ${idx + 2}: skipped (missing title/body)`);
      return;
    }
    if (isNaN(Date.parse(published_at))) {
      console.log(`Line ${idx + 2}: skipped (invalid date: ${published_at})`);
      return;
    }
    if (isNaN(parseInt(author_id)) || isNaN(parseInt(genre_id))) {
      console.log(`Line ${idx + 2}: skipped (invalid author_id/genre_id)`);
      return;
    }

    // デフォルト値: pvが空なら0にする
    const pvValue = pv && !isNaN(parseInt(pv)) ? parseInt(pv) : 0;

    const sql = `
      INSERT INTO ${tableName}
      (title, body, published_at, author_id, genre_id, pv, referrer, keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [title, body, published_at, author_id, genre_id, pvValue, referrer, keywords];

    connection.query(sql, params, (err, results) => {
      if (err) {
        console.error(`Error inserting row ${idx + 2}:`, err.message);
        return;
      }
      console.log(`Inserted row ${idx + 2}: ID=${results.insertId}`);
    });
  });
};

const articlesCSV = path.join(__dirname, 'data', 'articles.csv');
importCSV(articlesCSV, 'articles');

connection.end();
