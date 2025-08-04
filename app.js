require('dotenv').config();
const express = require('express');
const articlesRoutes = require('./routes/articles');

const app = express();
app.use(express.json());

// APIルートの登録
app.use('/articles', articlesRoutes);


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
