import { ArticlesList } from './pages/ArticlesList.jsx';

export const App = () => {
  return (
    <div style={{ padding: '0 32px' }}>
    <div>
      <h1 style={{
  fontSize: '24px',
  fontWeight: '700',
  color: '#2563eb',
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: '8px',
  marginBottom: '16px'
}}>
  記事分析ツール
</h1>
      <ArticlesList />
    </div>
    </div>
  );
};
