// クエリパラメータからWHERE句と値の配列を作成するヘルパー
// 目的: getArticlesでのフィルター処理を整理して読みやすくする

const buildWhereClause = (query) => {
    const { keyword, genre, author, startDate, endDate } = query;
    const whereClauses = [];
    const values = [];
  
    // キーワード検索(title or body)
    if (keyword) {
      whereClauses.push('(title LIKE ? OR body LIKE ?)');
      values.push(`%${keyword}%`, `%${keyword}%`);
    }
  
    // ジャンルID指定
    if (genre) {
      whereClauses.push('genre_id = ?');
      values.push(genre);
    }
  
    // 著者ID指定
    if (author) {
      whereClauses.push('author_id = ?');
      values.push(author);
    }
  
    // 公開日範囲
    if (startDate) {
      whereClauses.push('published_at >= ?');
      values.push(startDate);
    }
    if (endDate) {
      // 日付の終端を23:59:59にして1日の範囲をカバー
      whereClauses.push('published_at <= ?');
      values.push(`${endDate} 23:59:59`);
    }
  
    return {
      whereSQL: whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '',
      values
    };
  }
  
  module.exports = { buildWhereClause };
  