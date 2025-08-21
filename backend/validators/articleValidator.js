const { body } = require('express-validator');

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

module.exports = { validateArticle };
