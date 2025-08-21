const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const { validateArticle } = require('../validators/articleValidator');

router.get('/', articlesController.getArticles);
router.get('/:id', articlesController.getArticleById);
router.post('/', validateArticle, articlesController.createArticle);
router.put('/:id', validateArticle, articlesController.updateArticle);
router.delete('/:id', articlesController.deleteArticle);

module.exports = router;
