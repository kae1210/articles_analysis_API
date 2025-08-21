import { useEffect, useState } from 'react';

export const SearchForm = ({ onSearch, initialFilters = {} }) => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    setKeyword(initialFilters.keyword || '');
    setStartDate(initialFilters.startDate || '');
    setEndDate(initialFilters.endDate || '');
    setGenre(initialFilters.genre || '');
    setAuthor(initialFilters.author || '');
  }, [initialFilters]);

  const handleSubmit = () => {
    onSearch({ keyword, startDate, endDate, genre, author });
  };

  return (
    <div style={{
      flex: '0 0 280px',
      background: '#fff',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      height: 'fit-content',
    }}>
      <h3 style={{ marginBottom: '16px', color: '#333' }}>🔍 記事検索</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="キーワード"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
        />

        {/* 日付入力 */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>開始日</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: '94%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>終了日</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: '94%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
        </div>

        {/* ジャンル */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          <option value="">ジャンルを選択</option>
          <option value="1">ファッション</option>
          <option value="2">アウトドア</option>
          <option value="3">家電</option>
          <option value="4">美容</option>
          <option value="5">旅行</option>
        </select>

        {/* 著者 */}
        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          <option value="">著者を選択</option>
          <option value="1">田中</option>
          <option value="2">佐藤</option>
          <option value="3">鈴木</option>
          <option value="4">高橋</option>
          <option value="5">伊藤</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            padding: '10px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          検索
        </button>
      </div>
    </div>
  );
};

