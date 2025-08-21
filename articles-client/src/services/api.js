import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

/**
 * 記事取得API
 * @param {Object} options
 * @param {number} options.page - ページ番号
 * @param {number} options.limit - 1ページあたり件数
 * @param {string} [options.keyword] - 検索キーワード
 * @param {string} [options.startDate] - 開始日 (YYYY-MM-DD)
 * @param {string} [options.endDate] - 終了日 (YYYY-MM-DD)
 * @param {string} [options.sort] - ソート対象カラム (例: 'pv')
 * @param {string} [options.order] - ソート順 ('asc' or 'desc')
 * @param {string} [options.genre] - ジャンルID
 * @param {string} [options.author] - 著者ID
 */
export const getArticles = ({ page, limit, keyword, startDate, endDate, sort, order, genre, author }) => {
  return axios.get(`${API_BASE_URL}/articles`, {
    params: {
      page,
      limit,
      keyword: keyword || '',
      startDate: startDate || '',
      endDate: endDate || '',
      sort: sort || 'id',
      order: order || 'asc',
      genre: genre || '',
      author: author || ''
    }
  });
};
