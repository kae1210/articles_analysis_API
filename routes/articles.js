// routes/articles.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

// バリデーションルールを配列で定義
const validateArticle = [
    body('title').notEmpty().withMessage('タイトルは必須です'),
    body('body').notEmpty().withMessage('本文は必須です'),
    body('published_at').isISO8601().withMessage('公開日は正しい日付形式である必要があります'),
    body('author_id').isInt({ min: 1 }).withMessage('著者IDは正の整数である必要があります'),
    body('genre_id').isInt({ min: 1 }).withMessage('ジャンルIDは正の整数である必要があります'),
    body('pv').isInt({ min: 0 }).optional(),
    body('referrer').optional().isString(),
    body('keywords').optional().isString()
  ];
  
  //  一覧（検索・フィルター・ページネーション対応済）
router.get('/', articlesController.getArticles);

//  単一記事取得
router.get('/:id', articlesController.getArticleById);

//  新規作成（バリデーションあり）
router.post('/', validateArticle, articlesController.createArticle);

//  更新（バリデーションあり）
router.put('/:id', validateArticle, articlesController.updateArticle);

//  削除
router.delete('/:id', articlesController.deleteArticle);


module.exports = router;
