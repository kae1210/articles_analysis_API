// 環境変数の読み込み
require('dotenv').config();
const express = require('express');
const articlesRoutes = require('./routes/articles');
const cors = require('cors');
const app = express();

// CORS設定：フロント（React）からのリクエスト許可
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

// JSON形式のリクエストボディを扱うため
app.use(express.json());

// 記事関連APIのルート
app.use('/articles', articlesRoutes);

// サーバー起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
