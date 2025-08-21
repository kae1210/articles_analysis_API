const pool = require('../db/db.js');
const { validationResult } = require('express-validator');
const { buildWhereClause } = require('../helpers/buildWhereClause');
const { withDefault } = require('../helpers/handleDefaults');

// 記事一覧取得
exports.getArticles = async (req, res) => {
  // ページングとソートの初期値設定
  const { page = 1, pageSize = 10, sort = 'id', order = 'asc' } = req.query;
  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  const { whereSQL, values } = buildWhereClause(req.query);

  const allowedSortColumns = ['id', 'title', 'published_at', 'pv', 'created_at'];
  const sortBy = allowedSortColumns.includes(sort) ? sort : 'id';
  const sortOrder = ['asc','desc'].includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';

  try {
    // 記事取得
    const [rows] = await pool.query(
      `SELECT * FROM articles ${whereSQL} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    // 総記事数取得
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM articles ${whereSQL}`,
      values
    );

    res.json({
      currentPage: parseInt(page, 10),
      pageSize: limit,
      totalArticles: countResult[0].total,
      totalPages: Math.ceil(countResult[0].total / limit),
      results: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// ID指定で記事取得
exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Article not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// 記事作成
exports.createArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, body, published_at, author_id, genre_id, pv, referrer, keywords } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO articles 
       (title, body, published_at, author_id, genre_id, pv, referrer, keywords) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        body,
        published_at,
        author_id,
        genre_id,
        withDefault(pv, 0),
        withDefault(referrer, null),
        withDefault(keywords, null)
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Article created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

// 記事更新
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, body, published_at, author_id, genre_id, pv, referrer, keywords } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Article not found' });

    await pool.query(
      `UPDATE articles
       SET title = ?, body = ?, published_at = ?, author_id = ?, genre_id = ?, pv = ?, referrer = ?, keywords = ?
       WHERE id = ?`,
      [
        title,
        body,
        published_at,
        author_id,
        genre_id,
        withDefault(pv, 0),
        withDefault(referrer, null),
        withDefault(keywords, null),
        id
      ]
    );

    res.json({ message: 'Article updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// 記事削除
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};
