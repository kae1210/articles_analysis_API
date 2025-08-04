// requireで、module.exportsしているファイルからモジュール（pool）を読み込む
const pool = require('../db'); 
const { validationResult } = require('express-validator');

exports.getArticles = async (req, res) => {
  try {
    // クエリから値を取得。記法:オブジェクトの分割代入
    const { page = 1, pageSize = 10, keyword, genre, author, sort, order, startDate, endDate } = req.query;

    const limit = parseInt(pageSize, 10);

    //「ページ番号を元に、何件目からデータを取得すべきか？」を計算しているコード。「10」は10進数の意味
    const offset = (parseInt(page, 10) - 1) * limit;

    // WHERE句を動的に生成
    let whereClauses = [];
    let values = [];

    //%はワイルドカード、どこかにその文字列が含まれていることを表す
    if (keyword) {
      whereClauses.push(`(title LIKE ? OR body LIKE ?)`);
      values.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (genre) {
      whereClauses.push(`genre_id = ?`);
      values.push(genre);
    }

    if (author) {
      whereClauses.push(`author_id = ?`);
      values.push(author);
    }

    if (startDate) {
        whereClauses.push(`published_at >= ?`);
        values.push(startDate);
      }
  
      if (endDate) {
        whereClauses.push(`published_at <= ?`);
        values.push(`${endDate} 23:59:59`);
      }

    // 記法：三項演算子 「ある条件 ? tureの時 : falseの時」1つ以上条件があればWHERE句をつける、そうでなければ空文字
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // --- ソート関連の安全処理 ---
    const allowedSortColumns = ['id', 'title', 'published_at', 'pv', 'created_at'];
    const allowedOrder = ['asc', 'desc'];

    const sortBy = allowedSortColumns.includes(sort) ? sort : 'id';
    const sortOrder = allowedOrder.includes(order?.toLowerCase()) ? order.toLowerCase() : 'asc';

    const [rows] = await pool.query(
      `SELECT * FROM articles ${whereSQL} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM articles ${whereSQL}`,
      values
    );

    const totalArticles = countResult[0].total;
    // Math.ceil() は 小数点を切り上げる関数
    const totalPages = Math.ceil(totalArticles / limit);

    res.json({
      currentPage: parseInt(page, 10),
      pageSize: limit,
      totalArticles,
      totalPages,
      results: rows
    });

  } catch (err) {
    console.error(err);
    // 記事を取得できませんでした、というエラーを返す
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

exports.getArticleById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
  
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  };
  

exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { title, body, published_at, author_id, genre_id, pv, referrer, keywords } = req.body;
  
    try {
      const [existing] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
  
      await pool.query(
        `UPDATE articles
         SET title = ?, body = ?, published_at = ?, author_id = ?, genre_id = ?, pv = ?, referrer = ?, keywords = ?
         WHERE id = ?`,
        [title, body, published_at, author_id, genre_id, pv || 0, referrer || null, keywords || null, id]
      );
  
      res.json({ message: 'Article updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update article' });
    }
  };
  
  exports.createArticle = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { title, body, published_at, author_id, genre_id, pv, referrer, keywords } = req.body;
  
    try {
      const [result] = await pool.query(
        `INSERT INTO articles 
         (title, body, published_at, author_id, genre_id, pv, referrer, keywords) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, body, published_at, author_id, genre_id, pv || 0, referrer || null, keywords || null]
      );
  
      res.status(201).json({ id: result.insertId, message: 'Article created' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create article' });
    }
  };
  
  exports.deleteArticle = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
  
      res.json({ message: 'Article deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  };
  