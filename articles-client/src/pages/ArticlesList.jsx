
import { useEffect, useState } from 'react';
import { getArticles } from '../services/api';
import { SearchForm } from '../components/SearchForm';
import { ArticlesTable } from '../components/ArticlesTable';
import { Pagination } from '../components/Pagination';

export const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // ←追加
  const [error, setError] = useState(null); // ←追加

  const articlesPerPage = 10;

  //  検索条件（確定値）は親で保持：ページング/ソートでも使い回す
  const [filters, setFilters] = useState({
    keyword: '',
    startDate: '',
    endDate: '',
    genre: '',
    author: '',
  });

  // ソート用の state
  const [sortColumn, setSortColumn] = useState('id');  // 初期は id
  const [sortOrder, setSortOrder] = useState('asc');   // 昇順
  
  // 条件が変わったら必ず再取得（ページ、フィルタ、ソート）
  useEffect(() => {
    fetchArticles();
  }, [currentPage, filters, sortColumn, sortOrder]);

  const fetchArticles = async () => {
    try {
      // 空値は送らない
      const params = {
        page: currentPage,
        pageSize: articlesPerPage,
        sort: sortColumn,
        order: sortOrder,
      };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      const response = await getArticles(params);
      setArticles(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("記事の取得に失敗しました");
      console.error('記事の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // 子フォームから確定した検索条件を受け取る
  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // ソート切替
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return (
   <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/*  左：検索フォーム */}
        <SearchForm onSearch={handleSearch} initialFilters={filters} />

        {/* 右：テーブルとページネーション */}
        <div style={{ flex: 1 }}>
          {/* ステータス */}
        {loading && <p>読み込み中...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
      {/* テーブル */}
      <ArticlesTable
        articles={articles}
        onSort={handleSort}
        sort={sortColumn}
        order={sortOrder}
      />

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  </div>
);
};